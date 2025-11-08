"use client";

import { parseCsvToData, ParsedData } from "../lib/dataset";

export default function FileUploader({ onParsed }: { onParsed: (d: ParsedData) => void }) {
  return (
    <div className="row">
      <input
        type="file"
        accept=".csv,text/csv"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          const text = await file.text();
          const parsed = parseCsvToData(text);
          onParsed(parsed);
        }}
      />
      <a href="/data/ldos_comoda_sample.csv" download>
        <button>Download sample CSV</button>
      </a>
    </div>
  );
}
