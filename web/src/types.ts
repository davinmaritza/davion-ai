export interface Morphometry {
  lesion_pixels: number;
  area_cm2: number;
  major_axis_mm: number;
  minor_axis_mm: number;
  sphericity: number;
  intracranial_burden_pct: number;
}

export interface DiagnosisResult {
  status: "OK" | "REJECTED_OOD";
  is_ood: boolean;
  ood_reason: string | null;
  engine_mode?: string;
  format: string;
  metadata: Record<string, string | number | null>;
  predicted_class?: string;
  confidence?: number;
  probabilities?: Record<string, number>;
  uncertainty_variance?: number;
  requires_radiologist_review?: boolean;
  morphometry?: Morphometry;
  preview_data_url: string;
  gradcam_data_url?: string;
  segmentation_data_url?: string;
  disclaimer: string;
}

export interface CompareResult {
  status: "OK" | "REJECTED_OOD";
  baseline: DiagnosisResult;
  followup: DiagnosisResult;
  longitudinal_delta?: {
    area_change_cm2: number;
    area_change_pct: number;
    trend: "PROGRESSION" | "REGRESSION" | "STABLE";
  };
}

export interface BenchmarkData {
  source: string;
  cohort_size: number;
  classes: string[];
  overall_accuracy: number;
  macro_f1?: number;
  macro_roc_auc?: number;
  ece: number | null;
  confusion_matrix: number[][];
  per_dataset: Record<string, { count: number; accuracy: number }>;
}
