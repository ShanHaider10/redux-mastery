import { config } from "dotenv";
import express from "express";
import next from "next";
import cors from "cors";
import connectDB from "./src/config/db.js";
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
config({ path: ".env" });
const PORT = process.env.PORT || 4000;

app.prepare().then(async () => {
  await connectDB();
  const server = express();
  server.use(
    cors({
      origin: ["http://localhost:3000", "http://localhost:3001"],
      methods: ["GET", "POST", "PUT", "DELETE"],
      Credential: true,
    })
  );

  server.use(express.json());

  server.get("/api/custom", (_req, res) => {
    return res.json({ message: "this is a custom api" });
  });

  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`Ready on http://localhost:${PORT}`);
  });
});
