# ⚾ MLB AI Insights API

An AI-powered MLB insights API built on Vercel Serverless Functions.  
It transforms raw MLB Stats API data into human-like summaries, player trends, and team insights using an LLM.

---

## 🚀 Features

- AI-generated game summaries  
- Player trend analysis  
- Team performance insights  
- JSON-only responses  
- Serverless, auto-scaling architecture  
- Easy to integrate into apps, dashboards, and fantasy tools  

---

## 📡 Endpoints

### POST `/api/insights/game`
Generate AI insights for a specific MLB game.

**Body:**
```json
{ "gameId": 123456 }
