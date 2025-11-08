import { ParsedData } from "./dataset";
import { Context } from "./types";
import { HabitScores, contextSimilarity } from "./habitModel";

export type Recommendation = {
  itemId: string;
  genre: string;
  score: number;
  explanations: {
    habit: number; // [0,1]
    itemMean: number; // [0,1]
    novelty: number; // [0,1]
  };
};

export function generateRecommendations(args: {
  data: ParsedData;
  userId: string;
  targetContext: Context;
  habitScores: HabitScores;
}): Recommendation[] {
  const { data, userId, habitScores } = args;
  const userRatings = data.userItemRatings[userId] ?? {};
  const recs: Recommendation[] = [];

  for (const itemId of data.items) {
    const genre = data.itemToGenre[itemId] ?? "unknown";
    const habit = habitScores.perGenre[genre]?.score ?? 0;
    const itemMean = (data.itemMean[itemId] ?? 3) / 5; // normalize [0,1]
    const seen = userRatings[itemId] !== undefined;
    const novelty = seen ? 0.2 : 1.0;

    // Blend: prioritize habit, then item quality, then novelty
    const score = 0.6 * habit + 0.35 * itemMean + 0.05 * novelty;

    recs.push({ itemId, genre, score, explanations: { habit, itemMean, novelty } });
  }

  recs.sort((a, b) => b.score - a.score);
  return recs;
}
