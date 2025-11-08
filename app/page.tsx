"use client";

import { useEffect, useMemo, useState } from "react";
import { create } from "zustand";
import FileUploader from "../components/FileUploader";
import ContextSelector from "../components/ContextSelector";
import Recommendations from "../components/Recommendations";
import { ParsedData, parseCsvToData } from "../lib/dataset";
import { computeHabitScores } from "../lib/habitModel";
import { generateRecommendations } from "../lib/recommender";

interface AppState {
  data: ParsedData | null;
  setData: (d: ParsedData) => void;
}

const useApp = create<AppState>((set) => ({
  data: null,
  setData: (d) => set({ data: d }),
}));

export default function Page() {
  const { data, setData } = useApp();
  const [userId, setUserId] = useState<string>("");
  const [thresholds, setThresholds] = useState({ repetitionMin: 2, positiveRatingMin: 4 });
  const [weights, setWeights] = useState({ repetition: 1.0, reinforcement: 1.0, similarity: 1.0 });
  const [context, setContext] = useState({
    timeOfDay: "evening",
    dayType: "working-day",
    season: "winter",
    location: "home",
    weather: "clear",
    social: "with-partner",
    mood: "happy",
  });

  useEffect(() => {
    // Load sample on first load
    (async () => {
      const res = await fetch("/data/ldos_comoda_sample.csv");
      const text = await res.text();
      const parsed = parseCsvToData(text);
      setData(parsed);
      setUserId(parsed.users[0] ?? "u1");
    })();
  }, [setData]);

  const habitScores = useMemo(() => {
    if (!data || !userId) return null;
    return computeHabitScores({
      data,
      userId,
      thresholds,
      weights,
      targetContext: context,
    });
  }, [data, userId, thresholds, weights, context]);

  const recs = useMemo(() => {
    if (!data || !userId || !habitScores) return [];
    return generateRecommendations({ data, userId, targetContext: context, habitScores });
  }, [data, userId, context, habitScores]);

  return (
    <div className="grid">
      <section className="card">
        <h2>1) Load Dataset</h2>
        <p>Use sample or upload a LDOS-CoMoDa-like CSV.</p>
        <FileUploader onParsed={setData} />
        <div className="row">
          <label>User</label>
          <select value={userId} onChange={(e) => setUserId(e.target.value)}>
            {data?.users.map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
        </div>
      </section>

      <section className="card">
        <h2>2) Select Target Context</h2>
        <ContextSelector value={context} onChange={setContext} options={data?.contextOptions} />
        <div className="row">
          <div>
            <label>Repetition min</label>
            <input type="number" value={thresholds.repetitionMin} min={1} max={10}
              onChange={(e) => setThresholds((t) => ({ ...t, repetitionMin: Number(e.target.value) }))} />
          </div>
          <div>
            <label>Positive rating ?</label>
            <input type="number" value={thresholds.positiveRatingMin} min={1} max={10}
              onChange={(e) => setThresholds((t) => ({ ...t, positiveRatingMin: Number(e.target.value) }))} />
          </div>
        </div>
        <div className="row">
          <div>
            <label>Weight: Repetition</label>
            <input type="number" step="0.1" value={weights.repetition}
              onChange={(e) => setWeights((w) => ({ ...w, repetition: Number(e.target.value) }))} />
          </div>
          <div>
            <label>Weight: Reinforcement</label>
            <input type="number" step="0.1" value={weights.reinforcement}
              onChange={(e) => setWeights((w) => ({ ...w, reinforcement: Number(e.target.value) }))} />
          </div>
          <div>
            <label>Weight: Similarity</label>
            <input type="number" step="0.1" value={weights.similarity}
              onChange={(e) => setWeights((w) => ({ ...w, similarity: Number(e.target.value) }))} />
          </div>
        </div>
      </section>

      <section className="card">
        <h2>3) Recommendations</h2>
        <Recommendations userId={userId} recs={recs} habitScores={habitScores ?? undefined} />
      </section>
    </div>
  );
}
