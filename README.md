# ⚾ MLB AI Insights API

The **MLB AI Insights API** is a lightweight, production‑ready baseball intelligence engine that blends **real MLB StatsAPI data** with **AI‑generated analysis**.  
It provides game, player, and team insights in clean JSON — perfect for apps, dashboards, betting tools, fantasy platforms, and baseball content creators.

Deployed on **Vercel** with serverless functions and powered by **Google Gemini** for natural‑language insights.

---

## 🚀 Live Demo (UI Tester)

A simple browser‑based tester is deployed here:

**https://mlb-ai-insights.vercel.app**

You can test:
- Team insights  
- Player insights  
- Game insights  
- Today’s MLB games (auto‑fetch game IDs)

---

## 📡 API Endpoints

All endpoints accept **POST** with JSON bodies.

### 1. `/api/insights/team`
Generate AI insights for any MLB team.

#### Request (by name)
```json
{
  "teamName": "Mets"
}
