# Davion AI — Soft 3D Pastel Claymorphism Design System Specification

> **Dokumentasi Desain Resmi Antarmuka Davion AI (Aesthetic Style: Brightly Soft 3D Pastel)**  
> Mengadopsi visual DNA dari referensi *Brightly* dan *3D Clay UI Kits*: perpaduan estetika *Claymorphism* (plastisin/tanah liat lembut), palet pastel hangat (Lilac, Coral Peach, Mint, Sky Blue), kontur organik (*rounded-3xl*), bayangan timbul berdimensi (*soft ambient drop shadows & inner bevels*), dan tipografi humanis yang ramah namun tetap memiliki presisi komputasi medis neuro-onkologi.

---

## 1. Prinsip Utama Desain (Visual DNA)

1. **Claymorphic Tactility (Sentuhan Timbul Organik)**:
   - Komponen tidak datar (*flat*), melainkan memiliki kedalaman taktil seperti bahan plastisin atau keramik halus bertekstur matte.
   - Setiap kartu memiliki dua lapis pencahayaan: *highlight* putih di tepi atas (*inner bevel*) dan bayangan lembut di bagian bawah (*diffused ambient shadow*).

2. **Warm Pastel Palette (Anti-Dark Slate & Anti-Neon Glow)**:
   - Menghindari background hitam pekat yang dingin untuk navigasi umum, beralih ke warna dasar linen/krem lembut (`#F9F7F5`).
   - Aksen menggunakan warna-warna pastel ramah yang menenangkan bagi klinisi:
     - **Primary Lilac / Periwinkle (`#8B78EA`)**: Tombol aksi utama, brand accent, dan seleksi aktif.
     - **Warm Coral Peach (`#FFA88B`)**: Peringatan medis, status lesi tumor aktif, dan badge penting.
     - **Soft Mint / Sage (`#7BC8BA`)**: Status valid, jaringan normal, dan margin reseksi aman.
     - **Sky Periwinkle (`#93B5F9`)**: Sekuen pemindaian, parameter teknis, dan informasi DICOM.

3. **High-Contrast Medical Viewport Preservation**:
   - Citra pemindaian MRI DICOM 16-bit tetap ditampilkan dalam kanvas hitam murni berbingkai clay gading melengkung halus, memastikan standar radiologi (*GSDF contrast ratio*) tetap 100% presisi dan tidak terdistorsi oleh warna lingkungan sekitar.

---

## 2. Token Warna & Arsitektur Token CSS

```css
:root {
  /* Canvas & Surface Layers */
  --clay-bg-canvas:      #F9F7F5; /* Warm Linen Cream Canvas */
  --clay-bg-surface:     #FFFFFF; /* Pure Cloud White */
  --clay-bg-subtle:      #F3EFEA; /* Soft Sand Neutral */
  --clay-bg-elevated:    #FFFFFF; /* Elevated Card */

  /* Text & Readout Tokens */
  --clay-text-primary:   #2D3142; /* Deep Charcoal Slate */
  --clay-text-secondary: #717791; /* Soft Muted Slate */
  --clay-text-muted:     #9CA3AF; /* Light Gray */

  /* Pastel Clay Brand Accents */
  --clay-lilac:          #8B78EA; /* Primary Lilac */
  --clay-lilac-light:    #F2F0FD; /* Lilac Tint */
  --clay-peach:          #FFA88B; /* Coral Peach */
  --clay-peach-light:    #FFF3EF; /* Peach Tint */
  --clay-mint:           #7BC8BA; /* Mint Green */
  --clay-mint-light:     #EDF9F6; /* Mint Tint */
  --clay-sky:            #93B5F9; /* Sky Blue */
  --clay-sky-light:      #F0F5FE; /* Sky Tint */
  --clay-amber:          #FBBF24; /* Soft Gold */

  /* Claymorphism Shadow & Bevel Tokens */
  --clay-shadow-sm:      0 4px 12px rgba(139, 120, 234, 0.06), 0 2px 4px rgba(0, 0, 0, 0.03);
  --clay-shadow-md:      0 12px 28px -4px rgba(139, 120, 234, 0.08), 0 4px 10px rgba(0, 0, 0, 0.03);
  --clay-shadow-lg:      0 20px 40px -6px rgba(139, 120, 234, 0.12), 0 6px 16px rgba(0, 0, 0, 0.04);
  --clay-bevel:          inset 0 2px 4px rgba(255, 255, 255, 0.9), inset 0 -2px 4px rgba(0, 0, 0, 0.03);
  --clay-border:         1px solid #EAE6E1;
}
```
