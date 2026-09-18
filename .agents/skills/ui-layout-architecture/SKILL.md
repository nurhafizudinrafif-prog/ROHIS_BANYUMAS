---
name: ui-layout-architecture
description: Professional web layout architecture and spatial composition guide. Covers responsive grid systems, modern CSS Flexbox/Grid patterns (Bento grids, editorial splits, multi-column magazine layouts, sticky headers), fluid spacing scales, mobile-first responsive breakpoints (360px up to 1440px+), and preventing layout bugs (overflow, z-index clashing, content shifts). Use when designing, restructuring, or fixing page layouts and component positioning.
---

# UI Layout Architecture & Spatial Composition

Skill ini memandu perancangan tata letak (*layout*), komposisi ruang (*spatial composition*), dan sistem grid responsif tingkat lanjut untuk memastikan antarmuka web tersusun proporsional, seimbang, dan adaptif di semua resolusi layar.

---

## 1. Prinsip Tata Letak Utama (Layout Principles)

### A. Whitespace & Breathing Room
- Jangan menjejali setiap ruang kosong. Ruang negatif (*whitespace*) adalah elemen desain aktif yang memandu mata pembaca menuju informasi terpenting.
- Gunakan skala spasi konsisten berbasis variabel (`--space-xs` hingga `--space-4xl`).

### B. Vertical Rhythm & Skala Hirarki
- Terapkan jarak antar section yang konsisten (`margin-bottom` / `padding-block`: `80px`–`120px` di desktop, `48px`–`64px` di mobile).
- Pastikan judul (*heading*), subjudul, dan isi memiliki relasi kedekatan (*proximity principle*): jarak judul ke subjudul harus lebih dekat daripada jarak subjudul ke elemen berikutnya.

---

## 2. Pola Tata Letak Populer & Kapan Menggunakannya

### 1. Asymmetric Editorial Split (Hero & Feature Sections)
- **Struktur**: 60% konten teks utama (kiri) dan 40% kartu media/dokumentasi berbingkai arsitektural (kanan).
- **Kelebihan**: Memberi kesan editorial majalah berkelas dan institusional.
```css
.editorial-split {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: var(--space-3xl);
  align-items: center;
}
@media (max-width: 992px) {
  .editorial-split { grid-template-columns: 1fr; }
}
```

### 2. Modern Bento Grid (Fitur, Pilar, & Galeri Terpadu)
- **Struktur**: Kombinasi kartu dengan bentang kolom bervariasi (`grid-column: span 2`, `grid-row: span 2`) untuk menonjolkan fitur unggulan dibandingkan fitur sekunder.
- **Kelebihan**: Dinamis, modern, dan sangat enak dipindai (*scannable*).

### 3. Balanced Multi-Card Grid (Statistik, Program, & Agenda)
- **Desktop**: 3 atau 4 kolom seimbang (`grid-template-columns: repeat(auto-fit, minmax(280px, 1fr))`).
- **Tablet**: 2 kolom.
- **Mobile**: 1 kolom rapi dengan padding horizontal minimal 16px.

---

## 3. Strategi Breakpoint Responsif (Mobile-First)

Selalu pastikan layout tidak mengalami *horizontal scroll / overflow bug* (`overflow-x: clip / hidden` pada root kontainer).

| Breakpoint | Target Perangkat | Aturan Layout |
| :--- | :--- | :--- |
| **< 480px** | Ponsel Ringkas (360px–412px) | 1 kolom, tombol lebar penuh / fleksibel, padding kontainer `16px–20px`, ukuran font fluid `clamp()`. |
| **481px – 768px** | Ponsel Lebar & Phablet | 1–2 kolom adaptif, navigasi mobile drawer/modal. |
| **769px – 1024px** | Tablet & Laptop Kecil | 2–3 kolom, navigasi horizontal ringkas atau kapsul melayang. |
| **> 1025px** | Desktop & Monitor Lebar | Maksimum lebar kontainer `1280px` terpusat (`margin: 0 auto; padding: 0 32px`). |

---

## 4. Pencegahan Masalah Layout Klasik

1. **Anti-Overflow**:
   - Selalu berikan `max-width: 100%; height: auto;` pada setiap elemen gambar (`<img>`) dan video.
   - Hindari penetapan `width` bernilai piksel kaku (`width: 500px`) tanpa menyertakan `max-width: 100%`.
2. **Z-Index Layering yang Terorganisir**:
   - `--z-base: 1`
   - `--z-card: 5`
   - `--z-floating-element: 10`
   - `--z-sticky-nav: 50`
   - `--z-modal-backdrop: 100`
   - `--z-modal-content: 110`
3. **Sticky Header Stability**:
   - Gunakan `position: sticky; top: 16px;` dengan `backdrop-filter: blur(...)` dan batas margin agar tidak memotong konten saat halaman digulir.
