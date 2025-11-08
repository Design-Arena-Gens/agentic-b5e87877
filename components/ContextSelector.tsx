"use client";

import { Context, ContextOptions } from "../lib/types";

export default function ContextSelector({
  value,
  onChange,
  options,
}: {
  value: Context;
  onChange: (c: Context) => void;
  options?: ContextOptions;
}) {
  const opts = options ?? {
    timeOfDay: ["morning", "afternoon", "evening", "night"],
    dayType: ["working-day", "weekend"],
    season: ["winter", "spring", "summer", "autumn"],
    location: ["home", "public-place", "friend-home", "work"],
    weather: ["clear", "rain", "snow", "cloudy"],
    social: ["alone", "with-partner", "with-friends", "with-family"],
    mood: ["happy", "neutral", "sad", "excited", "tired"],
  };

  return (
    <div className="row" style={{ gap: 16, alignItems: "flex-end", flexWrap: "wrap" }}>
      <div>
        <label>Time of day</label>
        <select
          value={value.timeOfDay}
          onChange={(e) => onChange({ ...value, timeOfDay: e.target.value })}
        >
          {opts.timeOfDay.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Day type</label>
        <select value={value.dayType} onChange={(e) => onChange({ ...value, dayType: e.target.value })}>
          {opts.dayType.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Season</label>
        <select value={value.season} onChange={(e) => onChange({ ...value, season: e.target.value })}>
          {opts.season.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Location</label>
        <select value={value.location} onChange={(e) => onChange({ ...value, location: e.target.value })}>
          {opts.location.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Weather</label>
        <select value={value.weather} onChange={(e) => onChange({ ...value, weather: e.target.value })}>
          {opts.weather.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Social</label>
        <select value={value.social} onChange={(e) => onChange({ ...value, social: e.target.value })}>
          {opts.social.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Mood</label>
        <select value={value.mood} onChange={(e) => onChange({ ...value, mood: e.target.value })}>
          {opts.mood.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
