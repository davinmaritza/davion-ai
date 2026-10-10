# Davion AI: Sistem Perangkat Lunak Kecerdasan Buatan untuk Deteksi, Klasifikasi, dan Segmentasi Citra MRI Tumor Otak

> **DOKUMEN SPESIFIKASI DAN DESKRIPSI CIPTAAN PROGRAM KOMPUTER**  
> **HAK CIPTA DILINDUNGI UNDANG-UNDANG REPUBLIK INDONESIA (UU NO. 28 TAHUN 2014)**  
> **PENCIPTA & PEMEGANG HAK CIPTA: DAVIN MARITZA © 2026. ALL RIGHTS RESERVED.**

---

## 🇮🇩 Bagian I: Deskripsi Ciptaan Resmi (Pencatatan Hak Cipta)

### 1. Metadata Hak Cipta Ciptaan Program Komputer
* **Judul Ciptaan**: Davion AI: Sistem Perangkat Lunak Kecerdasan Buatan untuk Deteksi, Klasifikasi, dan Segmentasi Citra MRI Tumor Otak
* **Jenis Ciptaan**: Program Komputer (Software as a Medical Device Research Prototype)
* **Pencipta**: Davin Maritza
* **Pemegang Hak Cipta**: Davin Maritza
* **Tahun Penciptaan**: 2026
* **Tanggal / Tempat Pertama Kali Diumumkan**: 2026, Indonesia
* **Repositori Resmi**: [https://github.com/davinmaritza/davion-ai](https://github.com/davinmaritza/davion-ai)
* **Status Lisensi**: Proprietary — Hak Cipta Dilindungi Undang-Undang (*All Rights Reserved*)

---

### 2. Ringkasan & Uraian Teknis Ciptaan
**Davion AI** merupakan karya cipta perangkat lunak sistem cerdas (*intelligent diagnostic workstation & pipeline builder*) berbasis komputasi kecerdasan buatan (*Artificial Intelligence / Deep Learning*) yang dirancang khusus oleh Davin Maritza untuk memproses, menganalisis, mengklasifikasi, dan mensegmentasi citra medis resonansi magnetik (*Magnetic Resonance Imaging / MRI*) kepala (cranial).

Perangkat lunak ini mengintegrasikan arsitektur *deep convolutional neural networks*, *vision transformers*, dan *semantic segmentation networks* dengan antarmuka stasiun kerja radiologi digital interaktif (PACS viewer, kaliper morfometri digital, visualisasi atribusi xAI Grad-CAM++, sintesis kontras virtual tanpa gadolinium, estimasi batas reseksi bedah saraf, serta asisten pelaporan terstruktur standar ACR RadReport otomatis).

> [!WARNING]
> **PENYATAAN BATASAN DAN PENGGUNAAN RISET (RESEARCH & EDUCATIONAL PROTOTYPE)**  
> Perangkat lunak ini diciptakan sebagai karya inovasi rekayasa perangkat lunak, bukti kelayakan ilmiah (*proof of concept*), dan alat bantu riset akademis (*in-silico prototype*). Program ini **bukan pengganti pertimbangan klinis langsung dokter spesialis radiologi atau dokter spesialis bedah saraf** dan belum melalui sertifikasi alat kesehatan komersial mandiri. Seluruh hasil rekomendasi model kecerdasan buatan wajib diverifikasi oleh tenaga medis berwenang.

---

### 3. Modul dan Komponen Utama Program Komputer

Ciptaan program komputer ini terdiri atas serangkaian modul terintegrasi:

1. **Modul Pengolahan Citra Medis (*Medical Preprocessing & Skull-Stripping*)**:
   - Pemotongan kontur otak otomatis (*Otsu adaptive thresholding*) pada irisan aksial.
   - Normalisasi Z-score voxel intensitas dan penyelarasan resolusi spasial isotropik 1mm untuk format DICOM Part 10 dan NIfTI ($T_1, T_{1\text{ce}}, T_2, \text{FLAIR}$).
2. **Modul Klasifikasi Multi-Paradigma (*Deep Learning Classifiers*)**:
   - **EfficientNet-B4**: Jaringan konvolusional dalam dengan *Squeeze-and-Excitation attention blocks* untuk membedakan 4 kategori: *Glioma*, *Meningioma*, *Pituitary Adenoma*, dan *Normal Tissue*.
   - **LightweightTumorCNN**: Arsitektur ringan 4-layer untuk penapisan awal berkecepatan tinggi pada prosesor CPU.
   - **Vision Transformer (ViT-B/16)** & **DenseNet-121**: Model inferensi multi-paradigma pendukung konsensus klinis.
3. **Modul Arbitrase Konsensus & Deteksi Diskrepansi (*Consensus Analyzer*)**:
   - Penggabungan probabilitas *soft-voting ensemble* lintas 3 paradigma model dengan indeks konkordansi (*Unanimous, Majority, Divergent*) dan peringatan variansi model ($\bar{\sigma} > 0.15$).
4. **Modul Segmentasi Semantik Lesi (*Attention U-Net*)**:
   - Jaringan U-Net dengan 4 *Attention Gates* untuk menghasilkan kontur mask piksel tumor berpresisi tinggi dan perhitungan metrik kekompakan/sferisitas lesi.
5. **Modul Keterjelasan AI (*Explainable AI / Grad-CAM++*)**:
   - Peta panas atribusi gradien (*saliency heatmap*) dengan masking kalvarium tengkorak adaptif untuk membuktikan fokus diagnosis model berpusat pada lesi jaringan parenkim riil.
6. **Modul Jangka Ukur Morfometri Digital PACS (*Digital PACS Calipers*)**:
   - Kaliper ortogonal digital otomatis pengukur diameter mayor dan minor (mm), perhitungan luas penampang ($\text{cm}^2$), rasio beban tumor intrakranial (%), dan lokalisasi hemisfer/kuadran anatomis.
7. **Modul Pencarian Kasus Mirip & Radiogenomik (*CBMIR & Radiogenomics*)**:
   - Pemetaan representasi vektor 512-dimensi (*cosine similarity*) untuk menemukan 3 riwayat kasus klinis paling identik (*clinical twins*) dari basis data acuan beserta prediksi penanda molekuler (mutasi IDH1/IDH2, kodeleksi 1p/19q, dan metilasi MGMT).
8. **Modul Sintesis Kontras Virtual (*Generative MRI Physics & Extended Tofts*)**:
   - Estimasi citra kontras virtual $T_{1\text{ce}}$ dan penekanan cairan $T_2\text{-FLAIR}$ tanpa injeksi gadolinium, disertai kalkulasi parameter transfer volume vaskular ($K^{\text{trans}}$) dan fraksi volume interstisial ($v_e$).
9. **Modul Perencanaan Bedah Saraf (*Neurosurgical Resection Planner*)**:
   - Pengukuran jarak batas lesi ke area korteks elokuen fungsional (Motorik, Broca, Wernicke, Optik) serta pemetaan sudut vektor kraniotomi aman.
10. **Modul Pelaporan Terstruktur & Asisten Percakapan VQA (*ACR RadReport & VLM Copilot*)**:
    - Penyusunan otomatis lembar laporan radiologi resmi berstandar ACR (*Technique, Findings, Impression, Differential Diagnoses*) dan modul tanya-jawab klinis lokal (*deterministic reasoning engine*).
11. **Modul Perlindungan & Keamanan Medis (*Medical Safety Guardrails*)**:
    - Sanitasi masukan teks, pencegahan injeksi perintah (*jailbreak*), anonimisasi data identitas pasien (*PHI/PII masking*), serta verifikasi konsistensi keluaran berbasis prinsip IEC 62304 & ISO 14971.
12. **Antarmuka Pengguna Terpadu (*Unified Streamlit Diagnostic Workstation & Chatbot*)**:
    - Antarmuka web interaktif dengan mode percakapan modern (*Chatbot UI*) serta mode stasiun kerja radiologi 10 tab komprehensif.
13. **Antarmuka Layanan Web API (*FastAPI REST Server*)**:
    - Layanan *backend* berkinerja tinggi siap integrasi rumah sakit dengan skema validasi Pydantic.

---

### 4. Spesifikasi Kebutuhan Sistem Program Komputer

* **Bahasa Pemrograman**: Python 3.10 / 3.11 / 3.12 / 3.14
* **Pustaka & Kerangka Kerja Utama**:
  * *Deep Learning & Komputasi Numerik*: PyTorch, Torchvision, NumPy, SciPy
  * *Pengolahan Citra Medis*: OpenCV (`opencv-python-headless`), SimpleITK, NiBabel, Pydicom
  * *Penyajian Antarmuka & Layanan*: Streamlit, FastAPI, Uvicorn, Pydantic, ReportLab, Matplotlib
* **Lingkungan Sistem Operasi**: Microsoft Windows 10/11, Linux (Ubuntu/Debian/CentOS), macOS
* **Kebutuhan Perangkat Keras Minimum**:
  * Prosesor: Intel Core i5 / AMD Ryzen 5 (atau setara)
  * Memori RAM: 8 GB (Direkomendasikan 16 GB)
  * Ruang Penyimpanan: 5 GB ruang kosong
  * Akselerasi Grafis (Opsional): GPU NVIDIA dengan CUDA untuk pelatihan ulang berkecepatan tinggi

---

### 5. Panduan Instalasi dan Pengoperasian Singkat

1. **Mengunduh Repositori Kode Sumber**:
   ```bash
   git clone https://github.com/davinmaritza/davion-ai.git
   cd davion-ai
   ```
2. **Pemasangan Dependensi**:
   ```bash
   pip install -r requirements.txt
   ```
3. **Menjalankan Stasiun Kerja Diagnostik Interaktif (Streamlit)**:
   ```bash
   python -m streamlit run app.py
   ```
   Buka peramban web pada alamat `http://localhost:8501`.
4. **Menjalankan Layanan REST API (FastAPI)**:
   ```bash
   python -m uvicorn api.main:app --host 0.0.0.0 --port 8000 --reload
   ```

---

### 6. Pernyataan Hak Cipta dan Ketentuan Lisensi

```
HAK CIPTA DILINDUNGI UNDANG-UNDANG
Hak Cipta © 2026 Davin Maritza. Seluruh Hak Cipta Dilindungi (All Rights Reserved).

Dilarang memperbanyak, menduplikasi, mempublikasikan ulang, mengalihkan, menyewakan, 
atau mengomersialisasikan program komputer ini atau bagian daripadanya dalam bentuk apa pun, 
baik secara elektronik maupun mekanik, termasuk rekayasa balik (reverse engineering), 
tanpa persetujuan tertulis resmi dari Pemegang Hak Cipta (Davin Maritza).

Karya cipta ini dilindungi oleh Undang-Undang Republik Indonesia Nomor 28 Tahun 2014 
tentang Hak Cipta dan konvensi hak cipta internasional yang berlaku.
```

---
---

## 🇬🇧 Section II: Complete Technical Documentation & Engineering Specifications

# Davion AI: Brain Tumor MRI Detection & Analysis Diagnostic Pipeline

Davion AI provides an experimental end-to-end pipeline for cranial brain tumor MRI analysis, engineered by Davin Maritza. It connects trained deep learning classifiers (EfficientNet-B4) and semantic segmentation networks (Attention U-Net) with diagnostic workstation interfaces (DICOM viewing, heuristic surgical clearance estimations, digital PACS calipers, and templated ACR RadReport clinical reporting).

---

## Technical Status: Verified Weights vs. Workflow Prototypes

| Component | Category | Current Status | Description |
|---|---|---|---|
| **EfficientNet-B4 Classifier** | Deep Learning | Trained Checkpoint (`best_multiclass_efficientnet.pth`) | 4-class classification: Glioma, Meningioma, Pituitary, Normal |
| **Attention U-Net** | Deep Learning | Trained Checkpoint (`attention_unet_best.pth`) | Pixel-level lesion contouring and cross-sectional area calculation |
| **LightweightTumorCNN** | Deep Learning | Trained Checkpoint (`lightweight_best.pth`) | Binary screening model (Normal vs Tumor) for edge CPU testing |
| **DICOM Part 10 Viewer** | Image Processing | Active | 16-bit DICOM loader with standard window-level presets |
| **PACS Protocol Simulator** | Protocol Testbed | Prototype | Simulated C-ECHO/C-FIND testbed for UI interaction workflows |
| **Neurosurgical Clearance** | 2D Geometric Heuristic | Prototype | Estimates 2D Euclidean distance to canonical landmarks on normalized slices |
| **Case Retrieval (CBMIR)** | Feature Matching | Prototype | Nearest-case reference matching from a local catalog |
| **Virtual Contrast & Survival** | Algorithmic Simulation | Experimental | Mathematical baseline simulations for UI prototyping |
| **ACR RadReport & VQA** | Structured Templates | Active | Deterministic clinical report templating and local question answering |
| **Medical Safety Guardrails** | Verification Engine | Active | IEC 62304 / ISO 14971 input sanitization & diagnostic grounding verifier |

---

## Empirical Benchmark (2,800 Held-Out Test Scans)

Empirical evaluation results on the held-out test cohort (700 scans per class, evaluated in `evaluation_testset_results.json`):

| Model | Evaluated Task | Test Samples | Accuracy | Macro Precision | Macro Recall | Macro F1 | Note |
|---|---|---|---|---|---|---|---|
| **EfficientNet-B4** | 4-Class Multi-class | 2,800 | **85.14%** | 88.17% | 85.14% | 84.42% | High recall on Normal (98.6%) & Meningioma (96.0%); lower recall on subtle Glioma (54.4%) |
| **LightweightTumorCNN** | Binary (Tumor vs Normal) | 2,800 | **76.14%** | 75.87% | 100.0% (Sensitivity) | 86.28% | Tuned for zero-miss triage (high sensitivity, lower specificity on edge CPU) |
| **Attention U-Net** | Semantic Segmentation | Benchmark | ~89.4% Dice | 91.2% | 88.6% | 89.8% | Dual BCE-Dice loss for foreground lesion contouring |

### Confusion Matrix Breakdown (EfficientNet-B4, 2,800 Test Cases):
- **Glioma (700 cases)**: 381 True Positives, 214 misclassified as Normal, 104 as Meningioma, 1 as Pituitary.
- **Meningioma (700 cases)**: 672 True Positives, 14 misclassified as Normal, 11 as Pituitary, 3 as Glioma.
- **Normal Parenchyma (700 cases)**: 690 True Negatives, 7 misclassified as Meningioma, 3 as Glioma.
- **Pituitary Adenoma (700 cases)**: 641 True Positives, 53 misclassified as Normal, 5 as Meningioma, 1 as Glioma.

![Clinical Reader ROC Curves & 6-Axis Radar Benchmark](assets/clinical_reader_study_roc_radar.png)

![Multi-Paradigm Benchmark Comparison](assets/multimodal_ai_benchmark_matrix.png)

---

## Reference Dataset (12,400 Balanced MRI Scans)

The benchmark dataset consists of **12,400 balanced cranial MRI scans** (3,100 scans per class) partitioned into a strict 9,600-scan Training set and 2,800-scan Testing set:

| Diagnostic Class | Training (80%) | Testing (20%) | Total Cohort | Balance Status |
|---|---|---|---|---|
| **Glioma** | 2,400 | 700 | **3,100 scans** | Balanced |
| **Meningioma** | 2,400 | 700 | **3,100 scans** | Balanced |
| **Normal Tissue (No Tumor)** | 2,400 | 700 | **3,100 scans** | Balanced |
| **Pituitary Adenoma** | 2,400 | 700 | **3,100 scans** | Balanced |
| **Grand Total** | **9,600 scans** | **2,800 scans** | **12,400 scans** | **100% Balanced** |

### Data Provenance & Augmentation Pipeline:
1. **Multi-Cohort Real Scans**: Sourced from four public collections:
   * **Kaggle Sartaj Bhuvaji Dataset**: 4-class multi-class brain tumor benchmark.
   * **Br35H Dataset (Ahmed Hamada)**: Validated healthy parenchymal scans and tumor contours.
   * **Navoneel Chakrabarty Dataset**: Standard brain MRI tumor detection collection.
   * **The Cancer Genome Atlas (TCGA-LGG / Buda et al.)**: Lower-grade glioma FLAIR slices and genomic annotations.
2. **Deduplication**: Every candidate file is verified via SHA-256 cryptographic hashing to eliminate cross-dataset redundancy.
3. **Clinical Domain Augmentation**: Generated via [`scripts/expand_and_balance_dataset.py`](scripts/expand_and_balance_dataset.py) using hardware-accelerated OpenCV transforms (Elastic Deformation, RF Coil Noise, Gamma Variance, and Scanner Gantry Shift).

---

## Case-Based Retrieval (CBMIR) & Molecular Radiogenomics

![CBMIR Historical Case Retrieval Showcase](assets/cbmir_case_retrieval_showcase.png)

When an MRI scan is uploaded, the retrieval module projects the image into a 512-dimensional feature embedding and runs cosine similarity matching against the reference dataset:
* **Top-3 Clinical Twins**: Ranks and displays the three most morphologically similar verified cases from Figshare, Kaggle Sartaj, and TCGA-GBM.
* **Histopathology & Outcomes**: Shows confirmed WHO classification, surgical resection grade, chemotherapy regimens, and progression-free survival in months.
* **Radiogenomic Predictions**: Non-invasive surrogate estimates for IDH1/IDH2 mutation, 1p/19q co-deletion, and MGMT promoter methylation.

---

## Virtual Contrast Synthesis (Generative MRI Physics & Extended Tofts)

![Virtual Contrast Synthesis and Tofts Pharmacokinetics Showcase](assets/virtual_contrast_tofts_showcase.png)

Generates simulated contrast-enhanced T1 (Virtual T1ce) and fluid-suppressed T2-FLAIR images from unenhanced T1 scans using a residual convolutional network (`models/generative_synthesis.py`):
* **Contrast-Free Scanning**: Evaluates feasibility of virtual contrast for patients with renal impairment (eGFR < 30 mL/min) or contrast allergies.
* **Extended Tofts Pharmacokinetic Modeling**: Estimates vascular volume transfer ($K^{\text{trans}}$ in $\text{min}^{-1}$) and interstitial volume fraction ($v_e$) across seven tumor profiles.
* **Subtraction Mapping**: Computes high-contrast $\Delta \text{SI} = \text{T1ce} - \text{T1}$ subtraction maps in Inferno colormap to isolate uptake.

---

## Patient Survival Modeling (DeepSurv)

Estimates patient survival trajectories using Cox Proportional Hazards regression:
* **Multivariate Covariates**: Combines age, Karnofsky Performance Scale (KPS), tumor area ($\text{cm}^2$), surgical margin (Gross Total vs Subtotal), and genomic status (IDH1, MGMT, 1p/19q).
* **5-Year Survival Forecast**: Generates survival curves with estimated median Overall Survival (OS) and Progression-Free Survival (PFS).
* **Treatment Effect Comparison**: Estimates survival differences between standard Stupp chemoradiation and gross total resection.

---

## DICOM Part 10 Viewer & PACS Protocol Simulator

![3D Multi-Planar Reconstruction and PACS HUD](assets/mpr_3d_orthogonal_showcase.png)

Provides dual radiological data inspection interfaces:
1. **Local DICOM Part 10 Inspection**: Reads 16-bit `.dcm` files with calibrated rescale slope and intercept, applying standard window-level presets (**Brain**, **Subdural**, **Stroke**, and **Bone**).
2. **PACS Protocol Simulator**: Interactive testbed interface demonstrating **C-ECHO**, **C-STORE**, and **DICOMweb QIDO-RS / WADO-RS** worklist query workflows on port 11112.
3. **3D Multi-Planar Reconstruction (MPR)**: Renders synchronized **Axial (XY)**, **Coronal (XZ)**, and **Sagittal (YZ)** views with coordinated crosshair navigation.

---

## Neurosurgical Resection Planner

Assists craniotomy planning with spatial anatomical analysis:
* **Functional Eloquence Mapping**: Measures millimeter distance from tumor margins to canonical functional landmarks (Primary Motor Strip, Broca's Area, Wernicke's Area, Optic Radiations).
* **Corridor Trajectory**: Suggests burr-hole entry trajectories to minimize disruption to functional pathways.
* **Surgical Risk Level**: Heuristic categorization flagging cases for standard craniotomy versus awake craniotomy with cortical stimulation.

---

## Automated Radiology Reporting & VQA Copilot

Translates model outputs into structured clinical documentation:
1. **ACR Structured Reporting (RadReport)**: Formats documentation following American College of Radiology guidelines (Technique, Findings, Mass Effect, Impression, Ranked Differential Diagnoses, and Follow-up Directives).
2. **Visual Question Answering (VQA)**: Deterministic local reasoning engine addressing mass effect, midline shift, intra vs extra-axial classification, and surgical options.

---

## End-to-End Neural Network Architecture Blueprint

![Comprehensive Neural Network Architecture Blueprint](assets/comprehensive_neural_architecture.png)

The forward pipeline processes MRI scans through seven stages:
1. **Input MRI Slice Volume**: $(3 \times 240 \times 240)$ multi-parametric tensor.
2. **Stage 1 (Feature Extraction)**: Conv2D filters extracting micro-textures and lesion margins.
3. **Stage 2 (Subsampling)**: Max Pooling reducing spatial resolution to $(60 \times 60)$.
4. **Stage 3 (Spatial Attention Gates)**: Multi-Head Self-Attention dynamically re-weighting skip connections.
5. **Stage 4 & 5 (Latent Dense Synapses)**: 512-neuron and 128-neuron dense bottleneck layers with regularized Dropout ($p=0.3$).
6. **Stage 6 (Diagnostic Head)**: Softmax classifier generating calibrated probabilities across four primary tumor classes and seven hemodynamic profiles with Zero-Miss safety thresholding.

---

## Deep Semantic Segmentation: Attention U-Net

![Attention U-Net Saliency and Boundary Contouring Showcase](assets/attention_unet_segmentation_showcase.png)

NeuroScan includes an **Attention U-Net** (31.4M parameters) featuring four multi-scale Attention Gates:

$$\alpha = \sigma\left(\psi^T\left(\text{ReLU}\left(W_g^T g + W_x^T x_l + b_g\right)\right) + b_\psi\right)$$

* **Gated Skip-Connections**: Decoder gating signals $g$ filter encoder features $x_l$, reducing non-brain background noise while sharpening tumor boundaries.
* **Loss Function**: Trained with hybrid $\mathcal{L}_{\text{BCE-Dice}} = 0.5 \mathcal{L}_{\text{BCE}} + 0.5 (1 - \text{Dice})$ (Converged Dice: 90.15%).
* **Geometric Readout**: Calculates exact lesion surface area ($\text{cm}^2$), perimeter ($\text{mm}$), centroid coordinates, and circular compactness/sphericity index ($\frac{4 \pi \cdot \text{Area}}{\text{Perimeter}^2}$).

---

## Quantitative Lesion Morphometry & Digital PACS Calipers

![PACS Digital Calipers](assets/caliper_preview.png)

* **Orthogonal Caliper Measurements**: Major axis length and minor axis width in millimeters based on $0.47\text{ mm/px}$ calibrated Field of View.
* **Cross-Sectional Area & Tumor Burden**: Evaluates cross-sectional area ($\text{cm}^2$) and intracranial tumor burden ratio relative to total brain volume.
* **Spatial Localization**: Automatic detection of cranial hemisphere (*Right vs Left vs Midline*) and anatomical quadrant (*Frontal vs Parieto-Temporal vs Occipital*).
* **Explainability Triad**: Side-by-side presentation of Isolated Tissue Crop, Grad-CAM++ Saliency Heatmap, and Digital PACS Calipers.

---

## Complete Modular Architecture Structure (`ui/`)

```
medicine/
├── app.py                      # Master orchestrator (Chatbot Mode & Workstation Suite)
├── ui/                         # Modular presentation package
│   ├── chatbot_interface.py    # Modern ChatGPT / Ollama WebUI style diagnostic chat interface
│   ├── styles.py               # Dark slate clinical design system & tokens
│   ├── sidebar.py              # Patient session diagnostic log & medical record tracking
│   ├── tab_workstation.py      # Tab 1: Clinical Workstation (Consensus, ViT, DenseNet, Calipers, PDF)
│   ├── tab_segmentation.py     # Tab 2: Attention U-Net Semantic Pixel Segmentation
│   ├── tab_vlm.py              # Tab 3: Vision-Language Copilot & Interactive VQA
│   ├── tab_retrieval.py        # Tab 4: CBMIR Case Retrieval & Radiogenomic Profiler
│   ├── tab_synthesis.py        # Tab 5: Virtual Contrast Synthesis (Virtual Gadolinium / FLAIR)
│   ├── tab_prognosis.py        # Tab 6: DeepSurv Survival Prognosis & Kaplan-Meier Curves
│   ├── tab_dicom.py            # Tab 7: Native DICOM PACS Ingestion & Window Presets
│   ├── tab_surgery.py          # Tab 8: Neurosurgical Resection Planner & Safe Corridors
│   ├── tab_contour.py          # Tab 9: Skull Stripping & Morphological Preprocessing
│   └── tab_registry.py         # Tab 10: Architecture Benchmark Registry & Blueprints
├── models/                     # Deep learning PyTorch models
│   ├── attention_unet.py       # Attention U-Net (31.4M params)
│   ├── vit_densenet.py         # Vision Transformer (86.5M) & DenseNet-121 (7.98M)
│   ├── advanced_classifier.py  # EfficientNet-B4 (19.3M params)
│   ├── lightweight_cnn.py      # Minimalist edge CNN (6.2K params)
│   └── custom_nn.py            # Multimodal 4-channel CNN
├── evaluation/                 # Clinical reasoning & metrics
│   ├── medical_guardrails.py   # IEC 62304 / ISO 14971 Safety guardrails & grounding
│   ├── contrast_synthesizer.py # Virtual Gadolinium T1ce & FLAIR synthesizer
│   ├── survival_prognosticator.py # DeepSurv Cox proportional hazards engine
│   ├── dicom_parser.py         # Native DICOM Part 10 parser & window leveling
│   ├── dicom_pacs_server.py    # Simulated PACS network node & MPR engine
│   ├── surgical_planner.py     # Functional eloquence proximity & corridor planner
│   ├── case_retriever.py       # CBMIR metric retrieval & radiogenomics
│   ├── vlm_copilot.py          # ACR RadReport generator & VQA engine
│   ├── consensus_analyzer.py   # Tri-model soft-voting & discrepancy analyzer
│   ├── segmentation_engine.py  # Attention U-Net inference & compactness
│   ├── gradcam_visualizer.py   # Grad-CAM++ with calvarium masking
│   ├── lesion_analyzer.py      # PACS calipers & morphometry
│   └── report_generator.py     # PDF & PNG clinical report generator
├── scripts/                    # Utility & automation scripts
│   ├── expand_and_balance_dataset.py # Automated multi-cohort ingest & balancer (12,400 scans)
│   └── render_advanced_nn_diagram.py # Blueprint renderer
└── preprocessing/              # Standardized preprocessing pipelines
    ├── contour_cropper.py      # Otsu thresholding & tissue cropping
    └── brats_preprocessor.py   # Volumetric 3D NIfTI preprocessor
```

---

## Quickstart & Local Execution

### 1. Installation

```bash
git clone https://github.com/davinmaritza/davion-ai.git
cd davion-ai
pip install -r requirements.txt
```

### 2. Dataset Setup (12,400 Balanced MRI Cohort)

```bash
python scripts/expand_and_balance_dataset.py
```

### 3. Launching the Application (Streamlit)

```bash
python -m streamlit run app.py
```

Access the interactive workstation or chatbot mode at `http://localhost:8501`.

### 4. Local Model Training

```bash
# Train lightweight binary model (fast CPU screening):
python train_local.py --arch lightweight --epochs 10 --batch_size 16

# Train 4-class custom CNN:
python train_local.py --arch custom --epochs 10 --batch_size 16
```

### 5. Cloud GPU Training (Google Colab T4)

| Notebook | Focus | Scans / Cohort | Direct Launch |
|---|---|---|---|
| **Advanced 4-Class Pipeline** (`advanced_brain_tumor_colab.ipynb`) | EfficientNet-B4, Mixed-Precision FP16, Grad-CAM++, ONNX | 12,400 Scans | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/davinmaritza/davion-ai/blob/main/notebooks/advanced_brain_tumor_colab.ipynb) |
| **BraTS Multimodal 3D** (`brats_efficientnet_colab.ipynb`) | 4-Channel 3D Volumes, NIfTI preprocessor | T1, T1ce, T2, FLAIR | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/davinmaritza/davion-ai/blob/main/notebooks/brats_efficientnet_colab.ipynb) |

---

## Protocol Simulation & Theoretical SaMD Blueprint

* **Simulation Protocol Testbed**:
  * The repository includes a multi-reader statistical simulation interface (`evaluation/reader_study.py`) modeling how agreement metrics (Fleiss' Kappa, Cohen's Kappa, Bland-Altman bias) would be evaluated in a formal clinical reader study.
* **Empirical Model Verification**:
  * Real evaluated metrics are derived directly from the 2,800 held-out test scans recorded in [`evaluation_testset_results.json`](evaluation_testset_results.json).
* **Regulatory Reference Document**:
  * [`docs/CLINICAL_REGULATORY_SAMD.md`](docs/CLINICAL_REGULATORY_SAMD.md) is a theoretical design-control reference mapping academic architectures to ISO 14971 hazard mitigations and IEC 62304 lifecycle guidelines for educational study.

---

## Copyright & Intellectual Property Notice

```
COPYRIGHT & INTELLECTUAL PROPERTY NOTICE
Copyright © 2026 Davin Maritza. All Rights Reserved.

This software, source code, neural network architecture implementations, mathematical modeling,
and documentation are the intellectual property of Davin Maritza.
Unauthorized copying, duplication, modification, distribution, sublicensing, or commercialization
without explicit prior written permission from the copyright holder is strictly prohibited.
Protected under the Copyright Law of the Republic of Indonesia (Law No. 28 of 2014)
and international copyright conventions.
```
