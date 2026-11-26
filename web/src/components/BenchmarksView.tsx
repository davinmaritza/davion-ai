import React, { useEffect, useState } from "react";
import type { BenchmarkData } from "../types";

export const BenchmarksView: React.FC = () => {
  const [data, setData] = useState<BenchmarkData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/v1/benchmarks")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load benchmarks");
        return r.json();
      })
      .then(setData)
      .catch((e) => setError(e instanceof Error ? e.message : "Error"));
  }, []);

  if (error) return <p className="text-sm text-red-500">{error}</p>;
  if (!data) return <p className="text-sm text-slate-500">Loading benchmarks...</p>;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="text-xs text-slate-500 uppercase">Source</div>
          <div className="text-sm font-mono font-semibold mt-1">{data.source}</div>
        </div>
        <div className="p-4 rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="text-xs text-slate-500 uppercase">Holdout Cohort</div>
          <div className="text-2xl font-bold mt-1">{data.cohort_size.toLocaleString()}</div>
        </div>
        <div className="p-4 rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="text-xs text-slate-500 uppercase">Overall Accuracy</div>
          <div className="text-2xl font-bold mt-1">{(data.overall_accuracy * 100).toFixed(2)}%</div>
        </div>
      </div>

      <div className="p-4 rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-x-auto">
        <h2 className="text-sm font-semibold mb-3">4x4 Confusion Matrix</h2>
        <table className="w-full text-xs font-mono border-collapse">
          <thead>
            <tr>
              <th className="p-2 text-left border-b border-slate-300 dark:border-slate-700">Actual \ Pred</th>
              {data.classes.map((c) => (
                <th key={c} className="p-2 text-center border-b border-slate-300 dark:border-slate-700 uppercase">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.confusion_matrix.map((row, rIdx) => (
              <tr key={data.classes[rIdx]}>
                <td className="p-2 font-semibold uppercase border-b border-slate-200 dark:border-slate-800">
                  {data.classes[rIdx]}
                </td>
                {row.map((val, cIdx) => (
                  <td
                    key={cIdx}
                    className={`p-2 text-center border-b border-slate-200 dark:border-slate-800 ${
                      rIdx === cIdx ? "bg-sky-500/15 font-bold" : ""
                    }`}
                  >
                    {val}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900">
        <h2 className="text-sm font-semibold mb-2">Per-Dataset Accuracy</h2>
        <ul className="space-y-2 text-sm">
          {Object.entries(data.per_dataset).map(([name, info]) => (
            <li key={name} className="flex justify-between font-mono text-xs">
              <span>{name}</span>
              <span>
                {(info.accuracy * 100).toFixed(2)}% (n={info.count})
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
