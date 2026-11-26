import React, { useRef, useState } from "react";
import { RotateCcw, Ruler, ZoomIn, ZoomOut } from "lucide-react";
import type { DiagnosisResult } from "../types";

interface Props {
  result: DiagnosisResult | null;
}

interface Point {
  x: number;
  y: number;
}

export const MriViewport: React.FC<Props> = ({ result }) => {
  const [zoom, setZoom] = useState(1);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [gradcamOpacity, setGradcamOpacity] = useState(0.55);
  const [maskOpacity, setMaskOpacity] = useState(0.5);
  const [caliperMode, setCaliperMode] = useState(false);
  const [caliperPoints, setCaliperPoints] = useState<Point[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const spacingMm = Number(result?.metadata?.pixel_spacing_mm ?? 0.47);

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!caliperMode || !containerRef.current) return;
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
      {/* Always-dark radiological viewport */}
      <div
        ref={containerRef}
        onClick={handleCanvasClick}
        className={`relative aspect-square w-full max-w-[520px] mx-auto overflow-hidden rounded-xl border border-slate-800 bg-[#06090F] flex items-center justify-center select-none ${
          caliperMode ? "cursor-crosshair" : "cursor-default"
        }`}
      >
        {result ? (
          <div
            className="relative w-full h-full flex items-center justify-center transition-transform duration-150"
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
          <p className="text-sm text-slate-400 px-6 text-center">
            Upload a `.dcm`, `.nii.gz`, `.jpg`, `.png` scan or select a sample MRI to inspect.
          </p>
        )}

        {/* Caliper SVG overlay */}
        {caliperPoints.length > 0 && (
          <svg viewBox="0 0 256 256" className="absolute inset-0 w-full h-full pointer-events-none">
            {caliperPoints.map((pt, i) => (
              <circle key={i} cx={pt.x} cy={pt.y} r={3} fill="#38BDF8" />
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
        {result && (
          <>
            <div className="absolute top-2 left-2 text-[11px] font-mono text-slate-300 bg-black/60 px-2 py-0.5 rounded">
              {result.format} · {String(result.metadata?.rows ?? "")}x{String(result.metadata?.cols ?? "")}
            </div>
            <div className="absolute top-2 right-2 text-[11px] font-mono text-emerald-400 bg-black/60 px-2 py-0.5 rounded">
              PHI Stripped: {String(result.metadata?.phi_anonymized ?? "YES")}
            </div>
            {caliperDistanceMm && (
              <div className="absolute bottom-2 left-2 text-xs font-mono text-sky-300 bg-black/75 px-2 py-1 rounded">
                Caliper: {caliperDistanceMm} mm
              </div>
            )}
          </>
        )}
      </div>

      {/* Viewport Controls */}
      <div className="no-print grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(3, +(z + 0.25).toFixed(2)))}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Zoom in"
          >
            <ZoomIn size={14} /> +
          </button>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(0.5, +(z - 0.25).toFixed(2)))}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Zoom out"
          >
            <ZoomOut size={14} /> -
          </button>
          <button
            type="button"
            onClick={() => {
              setCaliperMode((m) => !m);
              if (caliperMode) setCaliperPoints([]);
            }}
            className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border ${
              caliperMode
                ? "bg-sky-600 text-white border-sky-600"
                : "border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Ruler size={14} /> Caliper
          </button>
          <button
            type="button"
            onClick={() => {
              setZoom(1);
              setBrightness(100);
              setContrast(100);
              setCaliperPoints([]);
            }}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <RotateCcw size={14} /> Reset
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <label className="flex flex-col gap-1">
            <span>Grad-CAM++ ({Math.round(gradcamOpacity * 100)}%)</span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={gradcamOpacity}
              onChange={(e) => setGradcamOpacity(Number(e.target.value))}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span>Seg Mask ({Math.round(maskOpacity * 100)}%)</span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={maskOpacity}
              onChange={(e) => setMaskOpacity(Number(e.target.value))}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span>Level ({brightness}%)</span>
            <input
              type="range"
              min={40}
              max={180}
              value={brightness}
              onChange={(e) => setBrightness(Number(e.target.value))}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span>Window ({contrast}%)</span>
            <input
              type="range"
              min={50}
              max={200}
              value={contrast}
              onChange={(e) => setContrast(Number(e.target.value))}
            />
          </label>
        </div>
      </div>
    </div>
  );
};
