import express from "express";
import snowRouter from "./routes/snow";

const app = express();
const port = process.env.PORT || 3000;

app.get("/", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/snow", snowRouter);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
