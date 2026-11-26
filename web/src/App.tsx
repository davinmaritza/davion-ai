import React, { useEffect, useState } from "react";
import {
  Brain,
  ChartBar,
  GitDiff,
  Sun,
  Moon,
  UploadSimple,
  Warning,
  Printer,
  CheckCircle,
} from "@phosphor-icons/react";
import { Badge, Button, Callout, Theme } from "@radix-ui/themes";
import { MriViewport } from "./components/MriViewport";
import { CompareView } from "./components/CompareView";
import { BenchmarksView } from "./components/BenchmarksView";
import type { DiagnosisResult } from "./types";

type Tab = "workstation" | "compare" | "benchmarks";

export default function App() {
  const [dark, setDark] = useState(true);
  const [tab, setTab] = useState<Tab>("workstation");
  const [samples, setSamples] = useState<{ name: string; label_hint: string }[]>([]);
  const [activeSample, setActiveSample] = useState<string | null>(null);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;
      if (e.key === "1") setTab("workstation");
      if (e.key === "2") setTab("compare");
      if (e.key === "3") setTab("benchmarks");
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    fetch("/api/v1/samples")
      .then((r) => r.json())
      .then((d) => setSamples(d.samples ?? []))
      .catch(() => setSamples([]));
  }, []);

  const analyzeFile = async (file: File) => {
    setLoading(true);
    setError(null);
    setActiveSample(null);
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
    setActiveSample(sampleName);
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
    <Theme appearance={dark ? "dark" : "light"} accentColor="sky" grayColor="slate" radius="medium">
      <div className="min-h-[100dvh] bg-slate-50 text-slate-900 dark:bg-[#090C12] dark:text-slate-100 transition-colors">
        {/* Single-line compact clinical command bar (height <= 72px) */}
        <header className="no-print h-16 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#0D111A]/95 backdrop-blur sticky top-0 z-20">
          <div className="max-w-[1400px] mx-auto h-full px-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={dark ? "/davion-logo-dark.svg" : "/davion-logo-light.svg"}
                alt="Davion AI logo"
                className="w-8 h-8 rounded-lg shrink-0"
              />
              <div className="flex items-baseline gap-2 truncate">
                <span className="text-sm font-semibold tracking-tight">Davion AI</span>
                <span className="hidden sm:inline text-xs text-slate-500 dark:text-slate-400">
                  Cranial MRI Workstation
                </span>
              </div>
            </div>

            <nav className="flex items-center gap-1.5" aria-label="Primary navigation">
              <button
                type="button"
                onClick={() => setTab("workstation")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                  tab === "workstation"
                    ? "bg-sky-600 text-white"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <Brain size={15} weight="regular" />
                Workstation
              </button>
              <button
                type="button"
                onClick={() => setTab("compare")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                  tab === "compare"
                    ? "bg-sky-600 text-white"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <GitDiff size={15} weight="regular" />
                Longitudinal
              </button>
              <button
                type="button"
                onClick={() => setTab("benchmarks")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                  tab === "benchmarks"
                    ? "bg-sky-600 text-white"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <ChartBar size={15} weight="regular" />
                Benchmarks
              </button>

              <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-1" />

              <button
                type="button"
                onClick={() => setDark((d) => !d)}
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Toggle light or dark theme"
              >
                {dark ? <Sun size={15} weight="regular" /> : <Moon size={15} weight="regular" />}
              </button>
            </nav>
          </div>
        </header>

        <main className="max-w-[1400px] mx-auto p-4 sm:p-6 space-y-5">
          {tab === "workstation" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Study Upload + Radiological Viewport */}
              <section className="lg:col-span-7 space-y-4">
                <div className="no-print flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90">
                  <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-medium cursor-pointer transition-colors whitespace-nowrap active:scale-[0.98]">
                    <UploadSimple size={15} weight="regular" />
                    <span>{loading ? "Analyzing..." : "Upload MRI Scan"}</span>
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

                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] text-slate-500 mr-1">Samples:</span>
                    {samples.map((s) => {
                      const isActive = activeSample === s.name;
                      return (
                        <button
                          key={s.name}
                          type="button"
                          onClick={() => analyzeSample(s.name)}
                          className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                            isActive
                              ? "border-sky-500 bg-sky-500/10 text-sky-700 dark:text-sky-300"
                              : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                          }`}
                        >
                          {s.label_hint}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {error && (
                  <Callout.Root color="red" size="1">
                    <Callout.Icon>
                      <Warning size={15} weight="regular" />
                    </Callout.Icon>
                    <Callout.Text>{error}</Callout.Text>
                  </Callout.Root>
                )}

                <MriViewport result={result} loading={loading} />
              </section>

              {/* Right Column: AI Findings, Uncertainty & Morphometry */}
              <section className="lg:col-span-5 space-y-4">
                {loading ? (
                  <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 space-y-4">
                    <div className="h-6 w-36 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
                    <div className="h-12 w-full rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
                    <div className="space-y-2.5 pt-2">
                      {[0, 1, 2, 3].map((i) => (
                        <div key={i} className="h-5 w-full rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
                      ))}
                    </div>
                  </div>
                ) : result ? (
                  <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 space-y-5">
                    {result.is_ood ? (
                      <Callout.Root color="red" size="2">
                        <Callout.Icon>
                          <Warning size={18} weight="regular" />
                        </Callout.Icon>
                        <Callout.Text>
                          <strong>Out-of-Distribution Rejected:</strong> {result.ood_reason}
                        </Callout.Text>
                      </Callout.Root>
                    ) : (
                      <>
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1">
                            <div className="text-[11px] uppercase tracking-wider text-slate-500">
                              Primary Classification
                            </div>
                            <div className="flex items-center gap-2.5">
                              <h2 className="text-2xl font-bold uppercase tracking-tight">
                                {result.predicted_class}
                              </h2>
                              <Badge size="2" variant="soft" color="sky" className="font-mono tabular-nums">
                                {((result.confidence ?? 0) * 100).toFixed(1)}%
                              </Badge>
                            </div>
                            <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
                              Engine: {result.engine_mode}
                            </div>
                          </div>

                          <Button
                            type="button"
                            size="2"
                            variant="outline"
                            color="gray"
                            onClick={() => window.print()}
                            className="no-print shrink-0"
                          >
                            <Printer size={15} weight="regular" />
                            Export PDF
                          </Button>
                        </div>

                        {result.requires_radiologist_review ? (
                          <Callout.Root color="amber" size="1">
                            <Callout.Icon>
                              <Warning size={15} weight="regular" />
                            </Callout.Icon>
                            <Callout.Text>
                              Low-confidence or inter-model variance alert (var={result.uncertainty_variance}). Manual
                              radiologist review required.
                            </Callout.Text>
                          </Callout.Root>
                        ) : (
                          <Callout.Root color="sky" size="1">
                            <Callout.Icon>
                              <CheckCircle size={15} weight="regular" />
                            </Callout.Icon>
                            <Callout.Text>
                              Consistent consensus score (var={result.uncertainty_variance}). Verify margins before
                              reporting.
                            </Callout.Text>
                          </Callout.Root>
                        )}

                        <div className="space-y-2.5">
                          <h3 className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                            Class Probability Distribution
                          </h3>
                          {Object.entries(result.probabilities ?? {}).map(([cls, prob]) => {
                            const isTop = cls === result.predicted_class;
                            return (
                              <div key={cls} className="space-y-1">
                                <div className="flex justify-between text-xs font-mono tabular-nums">
                                  <span className={`uppercase ${isTop ? "font-semibold" : "text-slate-500"}`}>
                                    {cls}
                                  </span>
                                  <span className={isTop ? "font-semibold text-sky-600 dark:text-sky-400" : ""}>
                                    {(prob * 100).toFixed(1)}%
                                  </span>
                                </div>
                                <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                  <div
                                    className={`h-full transition-all duration-300 ${
                                      isTop ? "bg-sky-600 dark:bg-sky-400" : "bg-slate-400 dark:bg-slate-600"
                                    }`}
                                    style={{ width: `${prob * 100}%` }}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {result.morphometry && (
                          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
                            <h3 className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                              Lesion Morphometry
                            </h3>
                            <div className="grid grid-cols-2 divide-y sm:divide-y-0 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden text-xs font-mono tabular-nums">
                              <div className="p-2.5 border-b border-r border-slate-200 dark:border-slate-800">
                                <div className="text-[10px] text-slate-500 uppercase">Area</div>
                                <div className="text-sm font-semibold mt-0.5">{result.morphometry.area_cm2} cm²</div>
                              </div>
                              <div className="p-2.5 border-b border-slate-200 dark:border-slate-800">
                                <div className="text-[10px] text-slate-500 uppercase">Burden</div>
                                <div className="text-sm font-semibold mt-0.5">
                                  {result.morphometry.intracranial_burden_pct}%
                                </div>
                              </div>
                              <div className="p-2.5 border-r border-slate-200 dark:border-slate-800">
                                <div className="text-[10px] text-slate-500 uppercase">Major / Minor Axis</div>
                                <div className="text-sm font-semibold mt-0.5">
                                  {result.morphometry.major_axis_mm} / {result.morphometry.minor_axis_mm} mm
                                </div>
                              </div>
                              <div className="p-2.5">
                                <div className="text-[10px] text-slate-500 uppercase">Sphericity</div>
                                <div className="text-sm font-semibold mt-0.5">{result.morphometry.sphericity}</div>
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                    <p className="text-[11px] text-slate-500 border-t border-slate-200 dark:border-slate-800 pt-3 leading-relaxed">
                      {result.disclaimer}
                    </p>
                  </div>
                ) : (
                  <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 space-y-2">
                    <h2 className="text-sm font-semibold">Diagnostic Readout Ready</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Upload a cranial MRI scan or pick a sample scan to inspect multi-class probabilities, epistemic
                      uncertainty, Grad-CAM++ saliency, segmentation mask overlays, and lesion morphometry.
                    </p>
                    <p className="text-[11px] font-mono text-slate-400 pt-2">
                      Shortcuts: 1/2/3 tabs · +/- zoom · C caliper · R reset
                    </p>
                  </div>
                )}
              </section>
            </div>
          )}

          {tab === "compare" && <CompareView />}
          {tab === "benchmarks" && <BenchmarksView />}
        </main>
      </div>
    </Theme>
  );
}
