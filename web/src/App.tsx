import React, { useEffect, useState } from "react";
import { AlertTriangle, BarChart3, FileDown, GitCompare, Moon, Scan, Sun, Upload } from "lucide-react";
import { MriViewport } from "./components/MriViewport";
import { CompareView } from "./components/CompareView";
import { BenchmarksView } from "./components/BenchmarksView";
import type { DiagnosisResult } from "./types";

type Tab = "workstation" | "compare" | "benchmarks";

export default function App() {
  const [dark, setDark] = useState(true);
  const [tab, setTab] = useState<Tab>("workstation");
  const [samples, setSamples] = useState<{ name: string; label_hint: string }[]>([]);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  useEffect(() => {
    fetch("/api/v1/samples")
      .then((r) => r.json())
      .then((d) => setSamples(d.samples ?? []))
      .catch(() => setSamples([]));
  }, []);

  const analyzeFile = async (file: File) => {
    setLoading(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/v1/diagnose", { method: "POST", body: form });
      if (!res.ok) throw new Error(await res.text());
      setResult(await res.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to analyze scan");
    } finally {
      setLoading(false);
    }
  };

  const analyzeSample = async (sampleName: string) => {
    setLoading(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("sample_name", sampleName);
      const res = await fetch("/api/v1/diagnose", { method: "POST", body: form });
      if (!res.ok) throw new Error(await res.text());
      setResult(await res.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load sample");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors">
      <header className="no-print border-b border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Scan className="text-sky-500" size={22} />
            <div>
              <h1 className="text-base font-bold leading-tight">Davion AI Web Workstation</h1>
              <p className="text-xs text-slate-500">Cranial MRI Triage · Research Prototype</p>
            </div>
          </div>

          <nav className="flex items-center gap-2" aria-label="Primary navigation">
            <button
              type="button"
              onClick={() => setTab("workstation")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 ${
                tab === "workstation" ? "bg-sky-600 text-white" : "hover:bg-slate-200 dark:hover:bg-slate-800"
              }`}
            >
              <Scan size={14} /> Workstation
            </button>
            <button
              type="button"
              onClick={() => setTab("compare")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 ${
                tab === "compare" ? "bg-sky-600 text-white" : "hover:bg-slate-200 dark:hover:bg-slate-800"
              }`}
            >
              <GitCompare size={14} /> Longitudinal
            </button>
            <button
              type="button"
              onClick={() => setTab("benchmarks")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 ${
                tab === "benchmarks" ? "bg-sky-600 text-white" : "hover:bg-slate-200 dark:hover:bg-slate-800"
              }`}
            >
              <BarChart3 size={14} /> Benchmarks
            </button>
            <button
              type="button"
              onClick={() => setDark((d) => !d)}
              className="p-2 rounded-lg border border-slate-300 dark:border-slate-700"
              aria-label="Toggle light or dark theme"
            >
              {dark ? <Sun size={15} /> : <Moon size={15} />}
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 space-y-4">
        {tab === "workstation" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <section className="lg:col-span-7 space-y-4">
              <div className="no-print flex flex-wrap items-center gap-2 p-3 rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900">
                <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-sky-600 text-white text-xs font-medium cursor-pointer">
                  <Upload size={14} />
                  <span>{loading ? "Analyzing..." : "Upload MRI (.dcm, .nii.gz, .png, .jpg)"}</span>
                  <input
                    type="file"
                    accept=".dcm,.nii,.nii.gz,.png,.jpg,.jpeg"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) analyzeFile(f);
                    }}
                  />
                </label>

                {samples.map((s) => (
                  <button
                    key={s.name}
                    type="button"
                    onClick={() => analyzeSample(s.name)}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Sample: {s.label_hint}
                  </button>
                ))}
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}
              <MriViewport result={result} />
            </section>

            <section className="lg:col-span-5 space-y-4">
              {result ? (
                <div className="p-4 rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
                  {result.is_ood ? (
                    <div className="p-3 rounded-lg bg-red-500/15 border border-red-500/40 text-sm">
                      <div className="font-bold text-red-400 flex items-center gap-1.5">
                        <AlertTriangle size={16} /> Out-of-Distribution Rejected
                      </div>
                      <p className="mt-1 text-xs">{result.ood_reason}</p>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="text-xs uppercase text-slate-500">Predicted Class</div>
                          <div className="text-2xl font-bold uppercase">{result.predicted_class}</div>
                          <div className="text-xs font-mono text-slate-500">
                            Engine: {result.engine_mode} · Confidence: {((result.confidence ?? 0) * 100).toFixed(1)}%
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => window.print()}
                          className="no-print inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-medium"
                        >
                          <FileDown size={14} /> Export PDF
                        </button>
                      </div>

                      {result.requires_radiologist_review && (
                        <div className="p-2.5 rounded-lg bg-amber-500/15 border border-amber-500/40 text-xs flex items-center gap-2">
                          <AlertTriangle size={15} className="text-amber-400 shrink-0" />
                          <span>
                            Uncertainty / low-confidence flag triggered (var={result.uncertainty_variance}). Manual
                            radiologist review required.
                          </span>
                        </div>
                      )}

                      <div className="space-y-2">
                        <h2 className="text-xs font-semibold uppercase text-slate-500">Class Probabilities</h2>
                        {Object.entries(result.probabilities ?? {}).map(([cls, prob]) => (
                          <div key={cls} className="space-y-1">
                            <div className="flex justify-between text-xs font-mono">
                              <span className="uppercase">{cls}</span>
                              <span>{(prob * 100).toFixed(1)}%</span>
                            </div>
                            <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                              <div className="h-full bg-sky-500" style={{ width: `${prob * 100}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>

                      {result.morphometry && (
                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 dark:border-slate-800 text-xs font-mono">
                          <div>Area: {result.morphometry.area_cm2} cm²</div>
                          <div>Burden: {result.morphometry.intracranial_burden_pct}%</div>
                          <div>Major Axis: {result.morphometry.major_axis_mm} mm</div>
                          <div>Sphericity: {result.morphometry.sphericity}</div>
                        </div>
                      )}
                    </>
                  )}
                  <p className="text-[11px] text-slate-500 border-t border-slate-200 dark:border-slate-800 pt-2">
                    {result.disclaimer}
                  </p>
                </div>
              ) : (
                <div className="p-6 rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm text-slate-500">
                  Select a sample MRI or upload a scan to view classification probabilities, uncertainty score,
                  Grad-CAM++ explainability, and morphometry.
                </div>
              )}
            </section>
          </div>
        )}

        {tab === "compare" && <CompareView />}
        {tab === "benchmarks" && <BenchmarksView />}
      </main>
    </div>
  );
}
