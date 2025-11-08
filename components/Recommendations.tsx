"use client";

import { HabitScores } from "../lib/habitModel";
import { Recommendation } from "../lib/recommender";

export default function Recommendations({
  userId,
  recs,
  habitScores,
}: {
  userId: string;
  recs: Recommendation[];
  habitScores?: HabitScores;
}) {
  return (
    <div>
      <div className="small">User: {userId}</div>
      {habitScores && (
        <div className="small" style={{ margin: "8px 0" }}>
          Showing top recommendations; scores blend habit strength (repetition, positive reinforcement, context similarity) with item quality.
        </div>
      )}
      <table className="table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Genre</th>
            <th>Score</th>
            <th>Why</th>
          </tr>
        </thead>
        <tbody>
          {recs.slice(0, 15).map((r) => (
            <tr key={r.itemId}>
              <td>{r.itemId}</td>
              <td><span className="badge">{r.genre}</span></td>
              <td>{r.score.toFixed(3)}</td>
              <td className="small">
                habit({r.genre})={r.explanations.habit.toFixed(3)}; itemMean={r.explanations.itemMean.toFixed(3)}; novelty={r.explanations.novelty.toFixed(3)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
