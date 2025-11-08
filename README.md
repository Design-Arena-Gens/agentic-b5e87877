# Neuro-Symbolic CARS (LDOS-CoMoDa-style) — Habits & Compositional Generalization

Habits = Context [Behaviors (Repetition + Positive Reinforcement)]

This app demonstrates a simple, explainable neuro-symbolic approach to contextual recommendations with compositional generalization across context facets (time, day, season, location, weather, social, mood). It uses a habit model that transfers behavior strength from similar contexts to a target context.

## How it works (short)
- Parse a LDOS-CoMoDa-like CSV (sample included in `public/data/ldos_comoda_sample.csv`).
- Compute per-user habit strengths over behaviors (genres) using:
  - Repetition: frequency of a behavior weighted by similarity to the target context.
  - Positive Reinforcement: same but only for ratings ≥ threshold.
  - Context Similarity: exact-facet overlap ratio between past and target contexts.
- Blend habit strength with item quality (item mean rating) and novelty to rank items.

The symbolic part is the habit equation and context similarity. The neural part can be added later by swapping in a learned scorer; the current version prioritizes simplicity and explainability.

## Run locally

```bash
npm install
npm run build
npm start
# open http://localhost:3000
```

- Use the sample CSV or upload your own LDOS-CoMoDa-style CSV with columns:
  `userId,itemId,rating,timeOfDay,dayType,season,location,weather,social,mood,genre`.

## Deployment (Vercel)
Use the provided command (auth configured):

```bash
vercel deploy --prod --yes --token $VERCEL_TOKEN --name agentic-b5e87877
```

Then verify:

```bash
curl https://agentic-b5e87877.vercel.app
```

## Notes
- Context similarity is a simple facet match ratio in [0,1].
- Habit score normalizes repetition and reinforcement across genres, then blends with similarity.
- Compositional generalization emerges by transferring credit from partially matching past contexts to the target context.
- Tune thresholds and weights in the UI to observe different behaviors.
