import express from "express";
import { exec } from "child_process";
import fs from "fs";
import path from "path";
import util from "util";
import axios from "axios";

const execPromise = util.promisify(exec);
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

const downloadsDir = "./downloads";
const outputDir = "./output";

if (!fs.existsSync(downloadsDir)) fs.mkdirSync(downloadsDir);
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/process-video", async (req, res) => {
  try {
    const { videoUrl, start, end } = req.body;

    const inputPath = path.join(downloadsDir, "input.mp4");
    const outputPath = path.join(outputDir, `cut-${Date.now()}.mp4`);

    // Baixar vídeo
    const response = await axios({
      method: "GET",
      url: videoUrl,
      responseType: "stream"
    });

    const writer = fs.createWriteStream(inputPath);
    response.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });

    // Cortar + converter para 9:16
    const command = `
      ffmpeg -y -ss ${start} -to ${end} -i ${inputPath}
      -vf "scale=1080:1920"
      -c:a copy ${outputPath}
    `;

    await execPromise(command);

    res.json({
      status: "completed",
      downloadUrl: `http://localhost:${PORT}/file/${path.basename(outputPath)}`
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao processar vídeo" });
  }
});

app.get("/file/:name", (req, res) => {
  const filePath = path.join(outputDir, req.params.name);
  res.download(filePath);
});

app.listen(PORT, () => {
  console.log(`Worker rodando na porta ${PORT}`);
});
