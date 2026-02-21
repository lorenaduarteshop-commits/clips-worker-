app.post("/process-video", async (req, res) => {
  try {
    const { videoUrl, start, end } = req.body;

    const inputPath = path.join(downloadsDir, "input.mp4");
    const outputPath = path.join(outputDir, `cut-${Date.now()}.mp4`);

    console.log("Baixando vídeo do YouTube...");

    // Baixa usando yt-dlp
    await execPromise(
      `yt-dlp -f "bestvideo+bestaudio/best" -o ${inputPath} ${videoUrl}`
    );

    console.log("Cortando vídeo...");

    // Corta + converte para vertical
    await execPromise(`
      ffmpeg -y -ss ${start} -to ${end} -i ${inputPath}
      -vf "scale=1080:1920"
      -preset fast
      ${outputPath}
    `);

    res.json({
      status: "completed",
      downloadUrl: `/file/${path.basename(outputPath)}`
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao processar vídeo" });
  }
});
