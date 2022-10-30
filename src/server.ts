
import cors from 'cors';
import express from 'express';
import { prisma } from './prisma/prismaClient';
import { job } from './schedules/matches';

const app = express();

const PORT = process.env.PORT ?? 8000;

app.use(cors())
app.use(express.json())

job.invoke()

app.get("/matches/finished", async (req, res) => {
  const matches = await prisma.matches.findMany({
    orderBy: {
      date: 'desc'
    }
  })

  return res.json(matches)
})

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))