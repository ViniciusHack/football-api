import { Matches, PrismaClient } from '@prisma/client';
import { compareAsc } from 'date-fns';
import express from 'express';

const app = express();
const prisma = new PrismaClient();

app.get("/matches/finished", async (req, res) => {
  const matches = await prisma.matches.findMany() // Processando todos as partidas, não tão performático?

  const finishedMatches = matches.filter(match => compareAsc(match.date, new Date()))

  return res.json({ matches: finishedMatches })
})

interface Match {
  id: number;
}

app.post("/matches", async (req, res) => {
  const matches = req.body.matches as Matches;

  await prisma.matches.createMany({
    data: matches
  })
})