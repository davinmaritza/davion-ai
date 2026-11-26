import React, { useEffect, useState } from "react";
import { Warning } from "@phosphor-icons/react";
import { Badge, Callout } from "@radix-ui/themes";
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

  if (error) {
    return (
      <Callout.Root color="red" size="2">
        <Callout.Icon>
          <Warning size={16} weight="regular" />
        </Callout.Icon>
        <Callout.Text>{error}</Callout.Text>
      </Callout.Root>
    );
  }

  if (!data) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-200/40 dark:bg-slate-900 animate-pulse"
            />
          ))}
        </div>
        <div className="h-64 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-200/40 dark:bg-slate-900 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Validation & Multi-Dataset Benchmarks</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Holdout evaluation across cranial MRI cohorts, calibration error, and class confusion matrix.
          </p>
        </div>
        <Badge size="2" variant="soft" color="sky" className="font-mono">
          {data.source}
        </Badge>
      </div>

      {/* Metrics Summary Strip (clean border-divided cells without card overuse) */}
      <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90">
        <div className="p-4">
          <div className="text-[11px] text-slate-500 uppercase tracking-wider">Holdout Cohort</div>
          <div className="text-2xl font-bold font-mono tabular-nums mt-1">{data.cohort_size.toLocaleString()}</div>
        </div>
        <div className="p-4">
          <div className="text-[11px] text-slate-500 uppercase tracking-wider">Overall Accuracy</div>
          <div className="text-2xl font-bold font-mono tabular-nums mt-1 text-sky-600 dark:text-sky-400">
            {(data.overall_accuracy * 100).toFixed(2)}%
          </div>
        </div>
        <div className="p-4">
          <div className="text-[11px] text-slate-500 uppercase tracking-wider">Macro F1 / AUC</div>
          <div className="text-2xl font-bold font-mono tabular-nums mt-1">
            {data.macro_f1 !== undefined
              ? `${(data.macro_f1 * 100).toFixed(2)}%`
              : data.macro_roc_auc !== undefined
                ? data.macro_roc_auc.toFixed(3)
                : "N/A"}
          </div>
        </div>
        <div className="p-4">
          <div className="text-[11px] text-slate-500 uppercase tracking-wider">Calibration (ECE)</div>
          <div className="text-2xl font-bold font-mono tabular-nums mt-1">
            {data.ece !== null ? data.ece.toFixed(4) : "Baseline"}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 overflow-x-auto">
          <h3 className="text-sm font-semibold mb-3">4x4 Clinical Confusion Matrix</h3>
          <table className="w-full text-xs font-mono tabular-nums border-collapse">
            <thead>
              <tr>
                <th className="p-2.5 text-left border-b border-slate-200 dark:border-slate-700 text-slate-500">
                  Actual \ Pred
                </th>
                {data.classes.map((c) => (
                  <th
                    key={c}
                    className="p-2.5 text-center border-b border-slate-200 dark:border-slate-700 uppercase text-slate-600 dark:text-slate-300"
                  >
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.confusion_matrix.map((row, rIdx) => (
                <tr key={data.classes[rIdx]}>
                  <td className="p-2.5 font-semibold uppercase border-b border-slate-100 dark:border-slate-800/80">
                    {data.classes[rIdx]}
                  </td>
                  {row.map((val, cIdx) => (
                    <td
                      key={cIdx}
                      className={`p-2.5 text-center border-b border-slate-100 dark:border-slate-800/80 ${
                        rIdx === cIdx
                          ? "bg-sky-500/15 text-sky-700 dark:text-sky-300 font-bold"
                          : "text-slate-600 dark:text-slate-400"
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

        <div className="lg:col-span-5 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 space-y-3">
          <h3 className="text-sm font-semibold">Per-Dataset Accuracy Breakdown</h3>
          <div className="space-y-3">
            {Object.entries(data.per_dataset).map(([name, info]) => (
              <div key={name} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs gap-2">
                  <span className="font-medium truncate">{name}</span>
                  <span className="font-mono tabular-nums text-slate-600 dark:text-slate-300 shrink-0">
                    {(info.accuracy * 100).toFixed(2)}% (n={info.count})
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full bg-sky-600 dark:bg-sky-400" style={{ width: `${info.accuracy * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
