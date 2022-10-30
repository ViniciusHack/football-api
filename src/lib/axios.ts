import axios from 'axios';

export const footballApi = axios.create({
  baseURL: "https://webws.365scores.com/web/games"
})