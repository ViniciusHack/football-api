import { PrismaClient } from '@prisma/client';
import express from 'express';

const app = express();
const prisma = new PrismaClient();

app.get("/finished", async (req, res) => {
  const result = await prisma.matches.findMany({
    where: {
      finished: true
    }
  })
})