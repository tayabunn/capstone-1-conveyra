import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:3000", credentials: true }));
app.use(express.json({ limit: "32kb" }));

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "conveyra-backend", timestamp: new Date().toISOString() });
});

// Start backend server
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Conveyra backend server running on http://localhost:${PORT}`);
  });
}

export default app;
