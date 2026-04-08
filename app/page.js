"use client";
import { useState } from "react";

export default function Home() {
  const [mode, setMode] = useState("game");
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    let endpoint = "";
    let body = {};

    if (mode === "game") {
      endpoint = "/api/insights/game";
      body = { gameId: input };
    }

    if (mode === "player") {
      endpoint = "/api/insights/player";
      // Accept ID or name
      if (isNaN(input)) body = { playerName: input };
      else body = { playerId: Number(input) };
    }

    if (mode === "team") {
      endpoint = "/api/insights/team";
      if (isNaN(input)) body = { teamName: input };
      else body = { teamId: Number(input) };
    }

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Unknown error");
      } else {
        setResult(data);
      }
    } catch (err) {
      setError("Network or server error");
    }

    setLoading(false);
  }

  return (
    <div style={{ padding: "40px", maxWidth: "700px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <h1>MLB AI Insights</h1>

      <label style={{ display: "block", marginBottom: "10px" }}>
        <strong>Select Insight Type:</strong>
      </label>

      <select
        value={mode}
        onChange={(e) => setMode(e.target.value)}
        style={{ padding: "10px", marginBottom: "20px", width: "100%" }}
      >
        <option value="game">Game Insights</option>
        <option value="player">Player Insights</option>
        <option value="team">Team Insights</option>
      </select>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder={
            mode === "game"
              ? "Enter Game ID"
              : mode === "player"
              ? "Enter Player Name or ID"
              : "Enter Team Name or ID"
          }
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{
            padding: "12px",
            width: "100%",
            marginBottom: "20px",
            fontSize: "16px",
          }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "12px 20px",
            fontSize: "16px",
            cursor: "pointer",
            width: "100%",
          }}
        >
          {loading ? "Loading..." : "Generate Insights"}
        </button>
      </form>

      {error && (
        <div style={{ marginTop: "20px", color: "red" }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {result && (
        <pre
          style={{
            marginTop: "20px",
            padding: "20px",
            background: "#f4f4f4",
            borderRadius: "8px",
            whiteSpace: "pre-wrap",
            fontSize: "14px",
          }}
        >
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
