import express from "express";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.json({ status: "Worker online 🚀" });
});

app.post("/process-video", (req, res) => {
  res.json({
    status: "processing",
    jobId: "123abc"
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
