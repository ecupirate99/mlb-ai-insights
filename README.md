# MLB AI Insights API

Serverless MLB insights API running on Vercel, powered by Gemini.

## Endpoints

- POST `/api/insights/game`
  - body: `{ "gameId": number }`
- POST `/api/insights/player`
  - body: `{ "playerId": number, "games": number }`
- POST `/api/insights/team`
  - body: `{ "teamId": number }`

## Setup

1. `npm install`
2. Add `GEMINI_API_KEY` to `.env.local`
3. `vercel dev` to run locally
4. Deploy with `vercel`
