import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));

// 🔹 Benchmarks simulados (iniciais)
const BENCHMARKS = {
  "marketing digital": { CPM: 22.5, CPC: 1.8, CTR: 1.2 },
  "estetica": { CPM: 25.4, CPC: 2.3, CTR: 1.0 },
  "odontologia": { CPM: 30.2, CPC: 2.9, CTR: 0.9 },
  "clinicas medicas": { CPM: 28.7, CPC: 2.7, CTR: 1.0 },
  "moda": { CPM: 20.8, CPC: 1.5, CTR: 1.4 },
  "restaurantes": { CPM: 18.3, CPC: 1.3, CTR: 1.6 },
  "e
