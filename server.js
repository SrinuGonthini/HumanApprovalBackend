import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import connectDB from "./config/db.js";
import approvalRoutes from "./routes/approvals.js";

connectDB();

import "./services/approvalWorker.js"; 

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/api/approvals", approvalRoutes);


app.get("/health", (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3500;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
