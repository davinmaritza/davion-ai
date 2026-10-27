# Spec: Davion AI Desktop Workstation (Tauri 2.0 + React + FastAPI)

## 1. Objective

Membangun aplikasi desktop native **Davion AI** (*Cranial MRI Diagnostic Workstation*) untuk sistem operasi desktop (Windows 10/11 x64) yang mengadopsi struktur navigasi modular ala referensi *Toolifix* (Modality Command Hub) dengan standar desain *Deep Medical Obsidian PACS* ([`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md)), ditenagai oleh mesin inferensi lokal Python FastAPI.

### Target User & Persona:
- **Dokter Spesialis Radiologi (Sp.Rad) & Neuro-Onkologi:** Memerlukan antarmuka instrumen kerja yang cepat, minim latensi, berlayar gelap (GSDF 16-bit compliant), dan menyajikan data kuantitatif presisi (morfometri milimeter, volumetri $cm^2$, kinetik Tofts, perbandingan kembaran historis).
- **Spesialis Bedah Saraf (Sp.BS):** Memerlukan visualisasi 3D kranial, margin jarak ke korteks elokuen (Broca, Wernicke, Motor Strip), serta trajektori kraniotomi yang aman.

### Key Value Proposition:
- **Zero AI Slop:** Tampilan konsol instrumen perangkat keras medis asli, bebas dari kartu bertumpuk (*anti-card overuse*) dan gradien generik.
- **Modality Command Hub:** 8 modalitas diagnostik tertata rapi dalam grid modul interaktif dengan status telemetri PACS live, memudahkan navigasi cepat tanpa distraksi.
- **Native Performance & Ringan:** Dibuat dengan **Tauri 2.0 (Rust) + React 18**, menghasilkan aplikasi desktop dengan ukuran installer sangat ringkas (<25 MB) dan penggunaan memori RAM sangat rendah dibandingkan Electron.
- **Local AI Daemon Security:** Pemrosesan citra medis (Protected Health Information / PHI) berjalan 100% lokal di mesin rumah sakit melalui Python FastAPI background daemon, tanpa kebocoran data ke cloud publik.

---

## 2. Tech Stack

| Layer | Teknologi & Library | Versi | Alasan Pemilihan |
|---|---|---|---|
| **Desktop Shell** | **Tauri 2.0** (Rust core) | `^2.0` | Ukuran binary <25MB, RAM <50MB, security sandbox kuat, native Windows window chrome. |
| **Frontend Framework** | **React 18 + TypeScript + Vite** | `React 18.3`, `Vite 5.x` | Reaktivitas instan, ekosistem visual kaya, tipe data ketat (*strict TypeScript*). |
| **Styling & Design Tokens**| **Tailwind CSS v3 + CSS Variables** | `Tailwind 3.4` | Implementasi langsung token `docs/DESIGN_SYSTEM.md` tanpa overhead runtime. |
| **Component Primitives** | **Radix UI / Shadcn UI + Lucide React** | Latest | Aksesibilitas keyboard (WCAG 2.1 AA), tanpa bloat visual, mudah dikustomisasi ke Obsidian. |
| **Local AI Engine** | **FastAPI + Uvicorn + PyTorch / NumPy** | Python 3.10-3.14 | Mengonsumsi pipeline diagnostik di `models/` dan `evaluation/` via REST/IPC lokal. |
| **Visual DICOM/MRI Canvas**| **HTML5 Canvas / CornerstoneJS / Fabric** | Native Canvas / WebGL | Render citra 16-bit, window-leveling realtime, digital calipers interaktif. |

---

## 3. Commands

Full executable commands:

```powershell
# ==========================================
# 1. Local Python AI Daemon (FastAPI)
# ==========================================
# Start inference server locally (Port 8000)
& "C:\Users\Administrator\AppData\Local\Python\bin\python.exe" -m uvicorn api.main:app --host 127.0.0.1 --port 8000 --reload

# Test Python AI inference test suite
& "C:\Users\Administrator\AppData\Local\Python\bin\python.exe" -m pytest tests/ -v

# ==========================================
# 2. Desktop Frontend (Tauri + React/Vite)
# ==========================================
# Install dependencies
npm --prefix desktop install

# Run Desktop in Development Mode (Live HMR + Tauri Window)
npm --prefix desktop run tauri dev

# Run React Frontend only in Browser for quick styling tests
npm --prefix desktop run dev

# Run Frontend Type-check & Linter
npm --prefix desktop run lint
npm --prefix desktop run typecheck

# Build Windows Production Installer (.msi / .exe)
npm --prefix desktop run tauri build
```

---

## 4. Project Structure

Pemisahan bersih antara engine AI (Python) dan Desktop Shell (Tauri + React):

```
medicine/
├── api/                             # Python Local Inference Engine (FastAPI)
│   ├── main.py                      # FastAPI app entrypoint (CORS 127.0.0.1)
│   ├── routers/
│   │   ├── diagnostics.py           # Tri-Model consensus & Grad-CAM
│   │   ├── segmentation.py          # Attention U-Net & morphometry
│   │   ├── synthesis.py             # Virtual Contrast & Tofts PK
│   │   ├── twins.py                 # CBMIR case matching
│   │   ├── clearance.py             # Neurosurgical corridor planner
│   │   └── report.py                # ACR structured report generator
│   └── schemas.py                   # Pydantic v2 type contracts
│
├── desktop/                         # Tauri Desktop Application
│   ├── src-tauri/                   # Rust Native Shell
│   │   ├── src/main.rs              # Tauri lifecycle, sidecar launcher & window config
│   │   ├── Cargo.toml               # Rust dependencies
│   │   └── tauri.conf.json          # Window styling, permissions, frameless bezel
│   │
│   ├── src/                         # React 18 + TypeScript Application
│   │   ├── assets/                  # Logo SVG (davion_logo.svg), icon fonts
│   │   ├── components/
│   │   │   ├── layout/              # DesktopTitlebar, Sidebar, TelemetryStrip
│   │   │   ├── hub/                 # ModalityCommandHub (Bento Grid alat medis)
│   │   │   │   ├── ModalityCard.tsx # Kartu modalitas alat terinspirasi Toolifix
│   │   │   │   ├── MetricCounter.tsx# Telemetry live counters
│   │   │   │   └── SearchBar.tsx    # Filter pasien & ID rekam medis
│   │   │   ├── viewport/            # PACS DICOM 4-Corner Viewport Canvas
│   │   │   │   ├── DicomCanvas.tsx  # Zoom, Pan, Window-Leveling
│   │   │   │   └── CaliperHUD.tsx   # Digital measurements overlay
│   │   │   └── modalities/          # View detail untuk 8 modul diagnostik
│   │   ├── hooks/                   # useInference, usePacsStream, useCalipers
│   │   ├── styles/                  # globals.css (Tokens dari docs/DESIGN_SYSTEM.md)
│   │   ├── types/                   # TypeScript interfaces (DICOM, Patient, AIResult)
│   │   ├── App.tsx                  # Main router (Hub View <-> Diagnostic Viewport)
│   │   └── main.tsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
│
├── models/                          # Neural network architectures (PyTorch / TorchCompat)
├── evaluation/                      # Clinical analytics, Tofts PK, CBMIR, Report gen
├── preprocessing/                   # DICOM parser, window presets, contour cropper
├── docs/                            # Design & technical specifications
│   ├── DESIGN_SYSTEM.md             # Definisi token resmi & anti-slop rules
│   └── SPEC-desktop-app.md          # Dokumen spesifikasi ini
└── tests/                           # Unit & regression tests (pytest)
```

---

## 5. Code Style & Design Implementation

### Frontend React Component Example (ModalityCard — Medical Instrument):
```tsx
// desktop/src/components/hub/ModalityCard.tsx
import React from "react";
import { LucideIcon } from "lucide-react";

interface ModalityCardProps {
  id: string;
  code: string;           // e.g. "MOD-01"
  title: string;          // e.g. "Tri-Model Consensus Ensemble"
  description: string;    // e.g. "Compound CNN + ViT + DenseNet soft-voting classification"
  icon: LucideIcon;
  badge: string;          // e.g. "113.8M PARAMS"
  status: "READY" | "ONLINE" | "BUSY";
  metrics: string;        // e.g. "98.1% Acc · 70ms"
  onClick: () => void;
}

export const ModalityCard: React.FC<ModalityCardProps> = ({
  code, title, description, icon: Icon, badge, status, metrics, onClick
}) => {
  return (
    <div 
      onClick={onClick}
      className="group relative flex flex-col justify-between p-5 bg-[#0D1322] border border-[#1E293B] 
                 rounded-xl hover:border-[#38BDF8]/60 transition-all duration-150 cursor-pointer 
                 active:scale-[0.98] select-none"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#06090F] border border-[#1E293B] flex items-center justify-center text-[#38BDF8] group-hover:border-[#38BDF8]/40 transition-colors">
            <Icon size={20} />
          </div>
          <div>
            <div className="text-[10px] font-mono tracking-widest text-[#64748B] uppercase">{code}</div>
            <h3 className="text-sm font-bold text-[#F8FAFC] tracking-tight group-hover:text-[#38BDF8] transition-colors">{title}</h3>
          </div>
        </div>
        <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-[#06090F] border border-[#1E293B] text-[#94A3B8]">
          {badge}
        </span>
      </div>

      <p className="text-xs text-[#94A3B8] leading-relaxed mb-4 line-clamp-2">
        {description}
      </p>

      <div className="flex items-center justify-between pt-3 border-t border-[#1E293B] text-[11px] font-mono">
        <span className="text-[#38BDF8] font-medium">{metrics}</span>
        <div className="flex items-center gap-1.5 text-[#10B981]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
          <span className="text-[10px] font-bold tracking-wider">{status}</span>
        </div>
      </div>
    </div>
  );
};
```

---

## 6. Testing Strategy

1. **Backend Integration (PyTest):**
   - Menguji semua router endpoint FastAPI (`/health`, `/api/diagnose`, `/api/segment`, `/api/synthesis`, dll.) dengan multipart form-data DICOM/JPEG sintetik.
   - Guardrail test terhadap data privasi PHI (*Patient Anonymization*).
2. **Frontend Component & Unit Testing (Vitest + React Testing Library):**
   - Verifikasi rendering komponen `ModalityCard`, `DicomCanvas`, dan `CaliperHUD`.
   - Validasi interaksi kalkulasi milimeter/pixel pada caliper.
3. **End-to-End & IPC Contract Testing:**
   - Memastikan response status HTTP `200` dan shape payload JSON konsisten dengan skema TypeScript.
   - Verifikasi startup sidecar daemon Python dari Tauri Rust binary.

---

## 7. Boundaries

- **ALWAYS DO:**
  - Patuhi palet warna dan token tipografi di [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md).
  - Gunakan font monospaced dengan `tnum` (tabular-nums) untuk semua angka metrik dan koordinat.
  - Tangani error inferensi secara defensif dengan pesan kegagalan medis yang jelas.
  - Pertahankan mode headless & zero-cloud untuk melindungi privasi data rekam medis pasien.
- **ASK FIRST:**
  - Mengubah struktur direktori inti backend (`models/`, `evaluation/`, `preprocessing/`).
  - Menambah dependensi pihak ketiga baru berukuran besar (>50MB).
  - Mengubah arsitektur IPC native antara Tauri dan Python.
- **NEVER DO:**
  - Menggunakan komponen chat bubble atau format chatbot di halaman kerja utama.
  - Menggunakan gradien ungu/indigo klise AI.
  - Memotong implementasi dengan komentar malas seperti `// TODO` atau `/* rest of code */`.
  - Mengunggah file PDF proposal (`Proposal_Aplikasi_Davion_AI_Davin_Maritza.pdf`) ke git.

---

## 8. Success Criteria

1. **Standalone Desktop App Executable:** Aplikasi desktop Tauri dapat dijalankan di Windows dengan window chrome gelap custom, titlebar presisi dengan logo Davion AI, dan frameless bezel.
2. **Command Hub Navigation:** Halaman utama menyajikan 8 modalitas diagnostik tertata rapi dalam bento card grid ala referensi, lengkap dengan telemetry strip real-time.
3. **Seamless Medical Viewport:** Mengklik kartu modalitas membuka Viewport PACS kerja penuh dengan overlay DICOM 4-sudut dan digital calipers.
4. **Fast Local Inference:** Permintaan inferensi dari React desktop ke FastAPI selesai dalam waktu <150ms untuk klasifikasi dan <400ms untuk segmentasi U-Net.
5. **Zero AI Slop Compliance:** 100% konsisten dengan prinsip anti-slop pada `docs/DESIGN_SYSTEM.md`.

---

## 9. Open Questions & Approvals Needed

1. **Inisialisasi Proyek Desktop:** Apakah Anda menyetujui struktur direktori `desktop/` untuk Tauri + React ini dibuat sekarang di dalam workspace?
2. **Konektor Python Daemon:** Apakah Anda ingin saat aplikasi desktop dibuka, Tauri otomatis meluncurkan background process `uvicorn api.main:app` (Sidecar mode), atau dijalankan secara terpisah saat tahap pengembangan?
