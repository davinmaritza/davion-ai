import React, { useEffect, useRef, useState } from "react";
import {
  MagnifyingGlassPlus,
  MagnifyingGlassMinus,
  Ruler,
  ArrowCounterClockwise,
  Sliders,
  ShieldCheck,
  Brain,
} from "@phosphor-icons/react";
import { Badge, Button, Slider } from "@radix-ui/themes";
import type { DiagnosisResult } from "../types";

interface Props {
  result: DiagnosisResult | null;
  loading?: boolean;
}

interface Point {
  x: number;
  y: number;
}

const WINDOW_PRESETS = [
  { label: "Default", brightness: 100, contrast: 100 },
  { label: "Brain", brightness: 105, contrast: 115 },
  { label: "Subdural", brightness: 115, contrast: 145 },
  { label: "Dural Bone", brightness: 95, contrast: 175 },
] as const;

export const MriViewport: React.FC<Props> = ({ result, loading = false }) => {
  const [zoom, setZoom] = useState(1);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [gradcamOpacity, setGradcamOpacity] = useState(0.55);
  const [maskOpacity, setMaskOpacity] = useState(0.5);
  const [caliperMode, setCaliperMode] = useState(false);
  const [caliperPoints, setCaliperPoints] = useState<Point[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const spacingMm = Number(result?.metadata?.pixel_spacing_mm ?? 0.47);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;

      if (e.key === "=" || e.key === "+") {
        setZoom((z) => Math.min(3, +(z + 0.25).toFixed(2)));
      } else if (e.key === "-") {
        setZoom((z) => Math.max(0.5, +(z - 0.25).toFixed(2)));
      } else if (e.key.toLowerCase() === "c") {
        setCaliperMode((m) => !m);
      } else if (e.key.toLowerCase() === "r") {
        setZoom(1);
        setBrightness(100);
        setContrast(100);
        setCaliperPoints([]);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!caliperMode || !containerRef.current || !result) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 256;
    const y = ((e.clientY - rect.top) / rect.height) * 256;
    setCaliperPoints((prev) => (prev.length >= 2 ? [{ x, y }] : [...prev, { x, y }]));
  };

  const caliperDistanceMm =
    caliperPoints.length === 2
      ? (
          Math.hypot(caliperPoints[1].x - caliperPoints[0].x, caliperPoints[1].y - caliperPoints[0].y) *
          spacingMm
        ).toFixed(1)
      : null;

  return (
    <div className="flex flex-col gap-3">
      {/* Precision dark radiological canvas (preserved in both Light and Dark mode) */}
      <div
        ref={containerRef}
        onClick={handleCanvasClick}
        className={`relative aspect-square w-full max-w-[540px] mx-auto overflow-hidden rounded-xl border border-slate-300 dark:border-slate-800 bg-[#06090F] flex items-center justify-center select-none shadow-sm ${
          caliperMode && result ? "cursor-crosshair" : "cursor-default"
        }`}
      >
        {loading ? (
          <div className="flex flex-col items-center gap-3 w-full h-full justify-center p-8">
            <div className="w-56 h-56 rounded-full bg-slate-800/50 animate-pulse border border-slate-700/60" />
            <div className="h-3 w-40 rounded bg-slate-800 animate-pulse" />
          </div>
        ) : result ? (
          <div
            className="relative w-full h-full flex items-center justify-center transition-transform duration-150 ease-out"
            style={{ transform: `scale(${zoom})` }}
          >
            <img
              src={result.preview_data_url}
              alt="Cranial MRI slice"
              className="w-full h-full object-contain"
              style={{ filter: `brightness(${brightness}%) contrast(${contrast}%)` }}
            />
            {result.gradcam_data_url && gradcamOpacity > 0 && (
              <img
                src={result.gradcam_data_url}
                alt="Grad-CAM++ heatmap overlay"
                className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                style={{ opacity: gradcamOpacity }}
              />
            )}
            {result.segmentation_data_url && maskOpacity > 0 && (
              <img
                src={result.segmentation_data_url}
                alt="Lesion segmentation mask overlay"
                className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                style={{ opacity: maskOpacity }}
              />
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2.5 text-center px-8">
            <div className="w-12 h-12 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-sky-400">
              <Brain size={24} weight="regular" />
            </div>
            <p className="text-sm font-medium text-slate-200">No cranial MRI loaded</p>
            <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
              Upload a DICOM (.dcm), NIfTI (.nii.gz), PNG, or JPG scan above, or choose a reference sample.
            </p>
          </div>
        )}

        {/* Caliper SVG overlay */}
        {caliperPoints.length > 0 && (
          <svg viewBox="0 0 256 256" className="absolute inset-0 w-full h-full pointer-events-none">
            {caliperPoints.map((pt, i) => (
              <circle key={i} cx={pt.x} cy={pt.y} r={3.5} fill="#38BDF8" stroke="#06090F" strokeWidth={1} />
            ))}
            {caliperPoints.length === 2 && (
              <line
                x1={caliperPoints[0].x}
                y1={caliperPoints[0].y}
                x2={caliperPoints[1].x}
                y2={caliperPoints[1].y}
                stroke="#38BDF8"
                strokeWidth={1.5}
                strokeDasharray="4 2"
              />
            )}
          </svg>
        )}

        {/* Corner HUD */}
        {result && !loading && (
          <>
            <div className="absolute top-3 left-3 flex items-center gap-1.5">
              <span className="text-[11px] font-mono tabular-nums text-slate-200 bg-black/70 border border-slate-800 px-2 py-0.5 rounded-md">
                {result.format} · {String(result.metadata?.rows ?? "")}x{String(result.metadata?.cols ?? "")}
              </span>
              <span className="text-[11px] font-mono tabular-nums text-slate-300 bg-black/70 border border-slate-800 px-2 py-0.5 rounded-md">
                {zoom.toFixed(2)}x
              </span>
            </div>
            <div className="absolute top-3 right-3">
              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-300 bg-black/70 border border-emerald-900/60 px-2 py-0.5 rounded-md">
                <ShieldCheck size={12} weight="regular" />
                PHI Stripped: {String(result.metadata?.phi_anonymized ?? "YES")}
              </span>
            </div>
            <div className="absolute bottom-3 left-3 flex items-center gap-2">
              {caliperDistanceMm && (
                <span className="text-xs font-mono tabular-nums text-sky-300 bg-black/80 border border-sky-900/70 px-2.5 py-1 rounded-md">
                  Caliper: {caliperDistanceMm} mm
                </span>
              )}
              {caliperMode && !caliperDistanceMm && (
                <span className="text-[11px] font-mono text-sky-300 bg-black/80 border border-sky-900/70 px-2 py-0.5 rounded-md">
                  Click 2 points to measure ({caliperPoints.length}/2)
                </span>
              )}
            </div>
          </>
        )}
      </div>

      {/* Instrument Controls Bar */}
      <div className="no-print rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-3.5 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Button
              type="button"
              size="1"
              variant="soft"
              color="gray"
              onClick={() => setZoom((z) => Math.min(3, +(z + 0.25).toFixed(2)))}
              aria-label="Zoom in"
            >
              <MagnifyingGlassPlus size={14} weight="regular" />
              Zoom +
            </Button>
            <Button
              type="button"
              size="1"
              variant="soft"
              color="gray"
              onClick={() => setZoom((z) => Math.max(0.5, +(z - 0.25).toFixed(2)))}
              aria-label="Zoom out"
            >
              <MagnifyingGlassMinus size={14} weight="regular" />
              Zoom -
            </Button>
            <Button
              type="button"
              size="1"
              variant={caliperMode ? "solid" : "soft"}
              color={caliperMode ? "sky" : "gray"}
              onClick={() => {
                setCaliperMode((m) => !m);
                if (caliperMode) setCaliperPoints([]);
              }}
            >
              <Ruler size={14} weight="regular" />
              Caliper (C)
            </Button>
            <Button
              type="button"
              size="1"
              variant="ghost"
              color="gray"
              onClick={() => {
                setZoom(1);
                setBrightness(100);
                setContrast(100);
                setCaliperPoints([]);
              }}
            >
              <ArrowCounterClockwise size={14} weight="regular" />
              Reset (R)
            </Button>
          </div>

          <div className="flex items-center gap-1 flex-wrap">
            <Sliders size={13} className="text-slate-400 mr-1" />
            {WINDOW_PRESETS.map((preset) => {
              const active = brightness === preset.brightness && contrast === preset.contrast;
              return (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => {
                    setBrightness(preset.brightness);
                    setContrast(preset.contrast);
                  }}
                  className={`px-2 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                    active
                      ? "bg-sky-600 text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-200 dark:border-slate-800 text-xs">
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] text-slate-600 dark:text-slate-400">
              <span>Grad-CAM++</span>
              <Badge size="1" variant="soft" color="sky" className="font-mono tabular-nums">
                {Math.round(gradcamOpacity * 100)}%
              </Badge>
            </div>
            <Slider
              size="1"
              min={0}
              max={1}
              step={0.05}
              value={[gradcamOpacity]}
              onValueChange={([v]) => setGradcamOpacity(v)}
              aria-label="Grad-CAM++ opacity"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] text-slate-600 dark:text-slate-400">
              <span>Seg Mask</span>
              <Badge size="1" variant="soft" color="sky" className="font-mono tabular-nums">
                {Math.round(maskOpacity * 100)}%
              </Badge>
            </div>
            <Slider
              size="1"
              min={0}
              max={1}
              step={0.05}
              value={[maskOpacity]}
              onValueChange={([v]) => setMaskOpacity(v)}
              aria-label="Segmentation mask opacity"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] text-slate-600 dark:text-slate-400">
              <span>Level</span>
              <span className="font-mono tabular-nums text-slate-700 dark:text-slate-300">{brightness}%</span>
            </div>
            <Slider
              size="1"
              min={40}
              max={180}
              step={1}
              value={[brightness]}
              onValueChange={([v]) => setBrightness(v)}
              aria-label="Brightness level"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] text-slate-600 dark:text-slate-400">
              <span>Window</span>
              <span className="font-mono tabular-nums text-slate-700 dark:text-slate-300">{contrast}%</span>
            </div>
            <Slider
              size="1"
              min={50}
              max={200}
              step={1}
              value={[contrast]}
              onValueChange={([v]) => setContrast(v)}
              aria-label="Window contrast"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
