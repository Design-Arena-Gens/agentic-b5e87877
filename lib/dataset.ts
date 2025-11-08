import Papa from "papaparse";
import { ContextOptions, DatasetRow } from "./types";

export type ParsedData = {
  rows: DatasetRow[];
  users: string[];
  items: string[];
  genres: string[];
  contextOptions: ContextOptions;
  itemToGenre: Record<string, string>;
  itemMean: Record<string, number>;
  userItemRatings: Record<string, Record<string, number>>;
};

export function parseCsvToData(csvText: string): ParsedData {
  const parsed = Papa.parse(csvText.trim(), { header: true, skipEmptyLines: true });
  const rows: DatasetRow[] = (parsed.data as any[]).map((r) => ({
    userId: String(r.userId ?? r.user ?? r.U ?? "u0").trim(),
    itemId: String(r.itemId ?? r.item ?? r.I ?? r.movieId ?? "i0").trim(),
    rating: Number(r.rating ?? r.R ?? r.score ?? 0),
    timeOfDay: String(r.timeOfDay ?? r.time ?? "evening").trim(),
    dayType: String(r.dayType ?? r.day ?? "working-day").trim(),
    season: String(r.season ?? "winter").trim(),
    location: String(r.location ?? "home").trim(),
    weather: String(r.weather ?? "clear").trim(),
    social: String(r.social ?? "alone").trim(),
    mood: String(r.mood ?? "neutral").trim(),
    genre: String(r.genre ?? r.category ?? "drama").trim(),
  }));

  const users = Array.from(new Set(rows.map((r) => r.userId)));
  const items = Array.from(new Set(rows.map((r) => r.itemId)));
  const genres = Array.from(new Set(rows.map((r) => r.genre)));
  const itemToGenre: Record<string, string> = {};
  for (const r of rows) itemToGenre[r.itemId] = r.genre;

  const contextOptions: ContextOptions = {
    timeOfDay: uniq(rows.map((r) => r.timeOfDay)).sort(),
    dayType: uniq(rows.map((r) => r.dayType)).sort(),
    season: uniq(rows.map((r) => r.season)).sort(),
    location: uniq(rows.map((r) => r.location)).sort(),
    weather: uniq(rows.map((r) => r.weather)).sort(),
    social: uniq(rows.map((r) => r.social)).sort(),
    mood: uniq(rows.map((r) => r.mood)).sort(),
  };

  const userItemRatings: Record<string, Record<string, number>> = {};
  const itemAgg: Record<string, { s: number; n: number }> = {};
  for (const r of rows) {
    userItemRatings[r.userId] ??= {};
    userItemRatings[r.userId][r.itemId] = r.rating;
    itemAgg[r.itemId] ??= { s: 0, n: 0 };
    itemAgg[r.itemId].s += r.rating;
    itemAgg[r.itemId].n += 1;
  }
  const itemMean: Record<string, number> = {};
  for (const [itemId, { s, n }] of Object.entries(itemAgg)) itemMean[itemId] = s / Math.max(1, n);

  return { rows, users, items, genres, contextOptions, itemToGenre, itemMean, userItemRatings };
}

function uniq<T>(a: T[]): T[] {
  return Array.from(new Set(a));
}
