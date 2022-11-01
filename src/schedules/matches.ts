import { format } from 'date-fns';
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
  const lastMatch = await prisma.matches.findFirst({
    orderBy: {
      created_at: "desc"
    }
  });
  const startDate = lastMatch ? format(new Date(lastMatch?.date), "dd/MM/yyyy") : "30/10/2022"
  const todayFormatted = format(new Date(), "dd/MM/yyyy") 
  try {
    const response = await footballApi.get<MatchResponse>(`/allscores/?langId=31&timezoneName=America/Sao_Paulo&sports=1&startDate=${startDate}&endDate=${todayFormatted}&&withTop=true`);
    let finishedMatches = response.data.games.filter(game => game.statusText === "Fim")
    
    const lastIndex = finishedMatches.findIndex(game => game.id === lastMatch?.id_external_api);
    
    if(lastIndex !== -1) {
      finishedMatches = finishedMatches.slice(lastIndex + 1)
    }

    await prisma.matches.createMany({
      data: finishedMatches.map(match => {
        return {
          id_external_api: match.id,
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