import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));

// 🔹 Benchmarks simulados (pode crescer depois)
const BENCHMARKS = {
  "marketing digital": { CPM: 22.5, CPC: 1.8, CTR: 1.2 },
  "estetica": { CPM: 25.4, CPC: 2.3, CTR: 1.0 },
  "odontologia": { CPM: 30.2, CPC: 2.9, CTR: 0.9 },
  "clinicas medicas": { CPM: 28.7, CPC: 2.7, CTR: 1.0 },
  "moda": { CPM: 20.8, CPC: 1.5, CTR: 1.4 },
  "restaurantes": { CPM: 18.3, CPC: 1.3, CTR: 1.6 },
  "educacao": { CPM: 17.5, CPC: 1.2, CTR: 1.5 },
  "financas": { CPM: 35.0, CPC: 3.2, CTR: 0.8 }
};

// 🔹 Função para buscar o nicho mais parecido
function findClosestNiche(input) {
  const key = input.toLowerCase();
  let bestMatch = null;
  let similarity = 0;

  Object.keys(BENCHMARKS).forEach((niche) => {
    const overlap = niche.split(" ").filter(w => key.includes(w)).length;
    const ratio = overlap / niche.split(" ").length;
    if (ratio > similarity) {
      similarity = ratio;
      bestMatch = niche;
    }
  });

  return bestMatch;
}

// 🔹 Função de cálculo principal
function calculateEstimates(niche, postType, objective, userBudget = null) {
  const closest = BENCHMARKS[niche.toLowerCase()] 
    ? niche.toLowerCase() 
    : findClosestNiche(niche);

  if (!closest) {
    return { error: "Nicho não encontrado. Tente algo mais específico." };
  }

  const base = BENCHMARKS[closest];

  // Ajustes por tipo de post
  const postTypeMultipliers = {
    'Feed': { CPM: 1.0, CPC: 1.0, CTR: 1.0 },
    'Stories': { CPM: 0.9, CPC: 1.1, CTR: 0.95 },
    'Reels': { CPM: 1.2, CPC: 1.3, CTR: 1.15 },
    'Carrossel': { CPM: 1.05, CPC: 1.0, CTR: 1.05 },
    'Anúncio de Vídeo': { CPM: 1.3, CPC: 1.1, CTR: 1.1 }
  };

  // Ajustes por objetivo
  const objectiveMultipliers = {
    'Reconhecimento de marca': { CPM: 0.9, CPC: 1.0, CTR: 0.95 },
    'Engajamento': { CPM: 1.0, CPC: 1.0, CTR: 1.0 },
    'Geração de cadastros': { CPM: 1.1, CPC: 1.2, CTR: 0.85 },
    'Conversão / Vendas': { CPM: 1.3, CPC: 1.5, CTR: 0.7 }
  };

  const factor = postTypeMultipliers[postType] || postTypeMultipliers['Feed'];
  const objectiveFactor = objectiveMultipliers[objective] || objectiveMultipliers['Engajamento'];

  const CPM = +(base.CPM * factor.CPM * objectiveFactor.CPM).toFixed(2);
  const CPC = +(base.CPC * factor.CPC * objectiveFactor.CPC).toFixed(2);
  const CTR = +(base.CTR * factor.CTR * objectiveFactor.CTR).toFixed(2);

  const orc_min = +(CPM * 2).toFixed(2);
  const orc_rec = +(CPM * 4).toFixed(2);

  const daily = userBudget ? userBudget : orc_min;
  const duration = 7;
  const total = +(daily * duration).toFixed(2);

  return {
    niche: closest,
    CPM,
    CPC,
    CTR,
    postType,
    objective,
    investimento: {
      inserido: userBudget ? `R$ ${userBudget.toFixed(2)}` : null,
      minimo: `R$ ${orc_min} / dia`,
      recomendado: `R$ $
