import { scheduleJob } from 'node-schedule';
import { footballApi } from '../lib/axios';
import { prisma } from '../prisma/prismaClient';

interface MatchResponse {
  games: {
    id: number;
    startTime: string;
    statusText: "Fim" | "Adiado";
    homeCompetitor: {
      score: number;
      name: string;
      symbolicName: string;
    };
    awayCompetitor: {
      score: number;
      name: string;
      symbolicName: string;
    }
  }[]
}

export const job = scheduleJob("*/5 * * * *", async () => {
  console.log("Fetching matches")
  const startDate = "28/10/2022"
  const endDate = "31/10/2022"
  try {
    const response = await footballApi.get<MatchResponse>(`/allscores/?langId=31&timezoneName=America/Sao_Paulo&sports=1&startDate=${startDate}&endDate=${endDate}&&withTop=true`);
    let finishedMatches = response.data.games.filter(game => game.statusText === "Fim")

    const lastCreated = await prisma.matches.findFirst({
      orderBy: {
        date: 'desc'
      }
    });
    
    const lastIndex = finishedMatches.findIndex(game => game.id === lastCreated?.id);
    
    if(lastIndex !== -1) {
      finishedMatches = finishedMatches.slice(lastIndex + 1)
    }

    await prisma.matches.createMany({
      data: finishedMatches.map(match => {
        console.log(match.id)
        return {
          id: match.id,
          away_team: match.awayCompetitor.name,
          away_score: Math.round(match.awayCompetitor.score),
          home_team: match.homeCompetitor.name,
          home_score: Math.round(match.homeCompetitor.score),
          date: new Date(match.startTime)
        }
      })
    })
  } catch (err) {
    console.error(err)
  }
})