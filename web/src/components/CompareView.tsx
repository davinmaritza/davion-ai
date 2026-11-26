import React, { useState } from "react";
import { GitDiff, Warning, ArrowRight } from "@phosphor-icons/react";
import { Badge, Button, Callout } from "@radix-ui/themes";
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
    <div className="space-y-5">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold tracking-tight">Longitudinal Scan Comparison</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[65ch]">
          Compare baseline (T0) and follow-up (T1) cranial scans to quantify lesion area delta and progression trend.
        </p>
      </div>

      <form
        onSubmit={handleCompare}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90"
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="baseline-file" className="text-xs font-medium text-slate-700 dark:text-slate-300">
            Baseline Scan (T0)
          </label>
          <input
            id="baseline-file"
            type="file"
            accept=".dcm,.nii,.nii.gz,.png,.jpg,.jpeg"
            onChange={(e) => setBaseline(e.target.files?.[0] ?? null)}
            className="text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-slate-100 dark:file:bg-slate-800 file:text-slate-700 dark:file:text-slate-200 hover:file:bg-slate-200 dark:hover:file:bg-slate-700 cursor-pointer"
          />
          <span className="text-[11px] text-slate-500">DICOM, NIfTI, PNG, or JPG</span>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="followup-file" className="text-xs font-medium text-slate-700 dark:text-slate-300">
            Follow-up Scan (T1)
          </label>
          <input
            id="followup-file"
            type="file"
            accept=".dcm,.nii,.nii.gz,.png,.jpg,.jpeg"
            onChange={(e) => setFollowup(e.target.files?.[0] ?? null)}
            className="text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-slate-100 dark:file:bg-slate-800 file:text-slate-700 dark:file:text-slate-200 hover:file:bg-slate-200 dark:hover:file:bg-slate-700 cursor-pointer"
          />
          <span className="text-[11px] text-slate-500">DICOM, NIfTI, PNG, or JPG</span>
        </div>

        <div className="flex items-center md:justify-end">
          <Button
            type="submit"
            size="2"
            color="sky"
            disabled={!baseline || !followup || loading}
            className="w-full md:w-auto"
          >
            <GitDiff size={15} weight="regular" />
            {loading ? "Comparing..." : "Run Comparison"}
          </Button>
        </div>
      </form>

      {error && (
        <Callout.Root color="red" size="1">
          <Callout.Icon>
            <Warning size={15} weight="regular" />
          </Callout.Icon>
          <Callout.Text>{error}</Callout.Text>
        </Callout.Root>
      )}

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-72 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-200/40 dark:bg-slate-900 animate-pulse" />
          <div className="h-72 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-200/40 dark:bg-slate-900 animate-pulse" />
        </div>
      )}

      {!loading && result && result.status === "REJECTED_OOD" && (
        <Callout.Root color="red" size="2">
          <Callout.Icon>
            <Warning size={16} weight="regular" />
          </Callout.Icon>
          <Callout.Text>
            Out-of-distribution image rejected. Both baseline and follow-up scans must be valid monochrome cranial MRIs.
          </Callout.Text>
        </Callout.Root>
      )}

      {!loading && result && result.status === "OK" && result.longitudinal_delta && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 flex flex-wrap gap-6 items-center justify-between">
            <div className="space-y-1">
              <div className="text-[11px] uppercase tracking-wider text-slate-500">Longitudinal Trend</div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight">{result.longitudinal_delta.trend}</span>
                <Badge
                  size="1"
                  color={
                    result.longitudinal_delta.trend === "PROGRESSION"
                      ? "red"
                      : result.longitudinal_delta.trend === "REGRESSION"
                        ? "green"
                        : "sky"
                  }
                >
                  {result.longitudinal_delta.area_change_pct > 0 ? "+" : ""}
                  {result.longitudinal_delta.area_change_pct}%
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-slate-500">T0 Area</div>
                <div className="text-base font-mono tabular-nums font-semibold">
                  {result.baseline.morphometry?.area_cm2} cm²
                </div>
              </div>
              <ArrowRight size={16} className="text-slate-400" />
              <div>
                <div className="text-[11px] uppercase tracking-wider text-slate-500">T1 Area</div>
                <div className="text-base font-mono tabular-nums font-semibold">
                  {result.followup.morphometry?.area_cm2} cm²
                </div>
              </div>
              <div className="pl-4 border-l border-slate-200 dark:border-slate-800">
                <div className="text-[11px] uppercase tracking-wider text-slate-500">Area Delta</div>
                <div className="text-lg font-mono tabular-nums font-bold">
                  {result.longitudinal_delta.area_change_cm2 > 0 ? "+" : ""}
                  {result.longitudinal_delta.area_change_cm2} cm²
                </div>
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
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">{title}</span>
                  <Badge variant="soft" color="sky" className="uppercase font-mono">
                    {item.predicted_class}
                  </Badge>
                </div>
                <div className="relative aspect-square bg-[#06090F] rounded-lg overflow-hidden border border-slate-800">
                  <img src={item.preview_data_url} alt={title} className="w-full h-full object-contain" />
                  {item.segmentation_data_url && (
                    <img
                      src={item.segmentation_data_url}
                      alt={`${title} segmentation mask`}
                      className="absolute inset-0 w-full h-full object-contain opacity-60"
                    />
                  )}
                </div>
                <div className="flex justify-between text-xs font-mono tabular-nums text-slate-500 dark:text-slate-400">
                  <span>Area: {item.morphometry?.area_cm2} cm²</span>
                  <span>Major Axis: {item.morphometry?.major_axis_mm} mm</span>
                  <span>Sphericity: {item.morphometry?.sphericity}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
