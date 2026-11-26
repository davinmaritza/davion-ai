import React, { useState } from "react";
import type { CompareResult } from "../types";

export const CompareView: React.FC = () => {
  const [baseline, setBaseline] = useState<File | null>(null);
  const [followup, setFollowup] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CompareResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCompare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!baseline || !followup) return;
    setLoading(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("baseline", baseline);
      form.append("followup", followup);
      const res = await fetch("/api/v1/compare", { method: "POST", body: form });
      if (!res.ok) throw new Error(await res.text());
      setResult(await res.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Comparison failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <form
        onSubmit={handleCompare}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900"
      >
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Baseline Scan (T0)</span>
          <input
            type="file"
            accept=".dcm,.nii,.nii.gz,.png,.jpg,.jpeg"
            onChange={(e) => setBaseline(e.target.files?.[0] ?? null)}
            className="text-xs"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Follow-up Scan (T1)</span>
          <input
            type="file"
            accept=".dcm,.nii,.nii.gz,.png,.jpg,.jpeg"
            onChange={(e) => setFollowup(e.target.files?.[0] ?? null)}
            className="text-xs"
          />
        </label>
        <div className="flex items-end">
          <button
            type="submit"
            disabled={!baseline || !followup || loading}
            className="w-full px-4 py-2 rounded-lg bg-sky-600 text-white text-sm font-medium disabled:opacity-50"
          >
            {loading ? "Comparing..." : "Compare Longitudinal Scans"}
          </button>
        </div>
      </form>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {result && result.status === "OK" && result.longitudinal_delta && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-wrap gap-6 items-center justify-between">
            <div>
              <div className="text-xs uppercase text-slate-500">Longitudinal Trend</div>
              <div className="text-xl font-bold">{result.longitudinal_delta.trend}</div>
            </div>
            <div>
              <div className="text-xs uppercase text-slate-500">Area Delta</div>
              <div className="text-xl font-mono font-bold">
                {result.longitudinal_delta.area_change_cm2 > 0 ? "+" : ""}
                {result.longitudinal_delta.area_change_cm2} cm² ({result.longitudinal_delta.area_change_pct}%)
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: "Baseline (T0)", item: result.baseline },
              { title: "Follow-up (T1)", item: result.followup },
            ].map(({ title, item }) => (
              <div
                key={title}
                className="p-4 rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2"
              >
                <div className="flex justify-between text-sm font-semibold">
                  <span>{title}</span>
                  <span className="uppercase">{item.predicted_class}</span>
                </div>
                <div className="relative aspect-square bg-[#06090F] rounded-lg overflow-hidden">
                  <img src={item.preview_data_url} alt={title} className="w-full h-full object-contain" />
                  {item.segmentation_data_url && (
                    <img
                      src={item.segmentation_data_url}
                      alt={`${title} mask`}
                      className="absolute inset-0 w-full h-full object-contain opacity-60"
                    />
                  )}
                </div>
                <div className="text-xs font-mono text-slate-500">
                  Area: {item.morphometry?.area_cm2} cm² · Major Axis: {item.morphometry?.major_axis_mm} mm
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
