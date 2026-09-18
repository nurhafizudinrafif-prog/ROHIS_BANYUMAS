---
name: webapp-testing
description: Toolkit for inspecting, verifying, and testing web applications and layout responsiveness using browser automation (Puppeteer/Playwright/Edge). Use to check visual correctness, take screenshots of components, test responsiveness down to 360px mobile viewports, and detect rendering or layout bugs.
license: Anthropic Skills License
---

# Web Application & Layout Testing

Panduan dan instruksi pengujian visual dan fungsional aplikasi web:

## 1. Verifikasi Visual Antarmuka
- Jalankan pemeriksaan tangkapan layar (*screenshot*) pada berbagai ukuran resolusi:
  - **Desktop**: 1440 × 900 px
  - **Tablet**: 768 × 1024 px
  - **Mobile**: 375 × 812 px atau 360 × 740 px
- Periksa konsistensi teks, kontras warna terhadap background, dan tidak adanya elemen yang bertumpuk (*overlapping*).

## 2. Pemeriksaan Responsivitas & Overflow
- Pastikan tidak terjadi *horizontal scrollbar* yang tidak diinginkan pada tampilan mobile.
- Verifikasi bahwa menu navigasi, tombol call-to-action (CTA), dan kartu interaktif dapat dijangkau dan diklik dengan nyaman (*thumb-friendly zone*).

## 3. Validasi Konsol & Performa
- Periksa log konsol browser (`console.error`, `console.warn`) untuk memastikan tidak ada kesalahan skrip JavaScript atau file gambar/aset yang hilang (*404 Not Found*).
- Pastikan animasi berjalan mulus pada 60fps dengan memanfaatkan akselerasi GPU (`transform` dan `opacity`).
