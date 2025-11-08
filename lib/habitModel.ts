import { ParsedData } from "./dataset";
import { Context, DatasetRow } from "./types";

export type HabitScores = {
  perGenre: Record<string, {
    score: number;
    repetition: number; // similarity-weighted count
    reinforcement: number; // similarity-weighted positive count
    similarity: number; // average similarity to target context
    support: number; // raw interactions count
  }>;
};

export function computeHabitScores(args: {
  data: ParsedData;
  userId: string;
  targetContext: Context;
  thresholds: { repetitionMin: number; positiveRatingMin: number };
  weights: { repetition: number; reinforcement: number; similarity: number };
}): HabitScores {
  const { data, userId, targetContext, thresholds, weights } = args;
  const userRows = data.rows.filter((r) => r.userId === userId);
  const per: Record<string, { rep: number; reinf: number; simSum: number; n: number; rawCount: number }> = {};

  for (const r of userRows) {
    const sim = contextSimilarity(rowToContext(r), targetContext);
    const isPositive = r.rating >= thresholds.positiveRatingMin;
    per[r.genre] ??= { rep: 0, reinf: 0, simSum: 0, n: 0, rawCount: 0 };
    per[r.genre].rep += sim;
    per[r.genre].reinf += isPositive ? sim : 0;
    per[r.genre].simSum += sim;
    per[r.genre].n += 1;
    per[r.genre].rawCount += 1;
  }

  // Normalization
  const maxRep = Math.max(1e-9, ...Object.values(per).map((v) => v.rep));
  const maxReinf = Math.max(1e-9, ...Object.values(per).map((v) => v.reinf));

  const perGenre: HabitScores["perGenre"] = {};
  for (const genre of Object.keys(per)) {
    const v = per[genre];
    const repetition = v.rep / maxRep; // [0,1]
    const reinforcement = v.reinf / (maxReinf || 1); // [0,1]
    const similarity = v.n > 0 ? v.simSum / v.n : 0; // [0,1]

    // Soft penalty if raw repetition below minimum
    const repetitionPenalty = v.rawCount < thresholds.repetitionMin ? 0.6 : 1.0;

    const score = repetitionPenalty * (
      weights.repetition * repetition +
      weights.reinforcement * reinforcement +
      weights.similarity * similarity
    ) / Math.max(1e-9, (weights.repetition + weights.reinforcement + weights.similarity));

    perGenre[genre] = { score, repetition, reinforcement, similarity, support: v.rawCount };
  }

  return { perGenre };
}

export function contextSimilarity(a: Context, b: Context): number {
  let matches = 0;
  let total = 7;
  if (a.timeOfDay === b.timeOfDay) matches++;
  if (a.dayType === b.dayType) matches++;
  if (a.season === b.season) matches++;
  if (a.location === b.location) matches++;
  if (a.weather === b.weather) matches++;
  if (a.social === b.social) matches++;
  if (a.mood === b.mood) matches++;
  return matches / total;
}

function rowToContext(r: DatasetRow): Context {
  return {
    timeOfDay: r.timeOfDay,
    dayType: r.dayType,
    season: r.season,
    location: r.location,
    weather: r.weather,
    social: r.social,
    mood: r.mood,
  };
}
