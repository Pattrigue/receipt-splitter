import dotenv from "dotenv";
import express from "express";
import ViteExpress from "vite-express";

dotenv.config();

const port = parseInt(process.env.PORT || "3000", 10);
const app = express();

ViteExpress.listen(app, port, () => {
  console.log(`Server is listening on port ${port}...`);
});
