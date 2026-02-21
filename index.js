import express from "express";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.json({ status: "Worker online 🚀" });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/process-video", async (req, res) => {
  console.log("Job recebido");

  // Simula processamento
  setTimeout(() => {
    console.log("Job processado");
  }, 3000);

  res.json({
    status: "completed",
    cuts: [
      {
        title: "Corte teste",
        downloadUrl: "https://example.com/test.mp4"
      }
    ]
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
