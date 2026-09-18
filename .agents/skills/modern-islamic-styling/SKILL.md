---
name: modern-islamic-styling
description: Panduan dan spesifikasi desain visual Modern Islamic Editorial untuk website ROHIS Banyumas. Mengatur kurasi palet warna (Deep Pine, Antique Brass, Warm Alabaster), tipografi editorial, tekstur background geometris Islami, dan arsitektur kartu yang tenang serta berwibawa. Gunakan skill ini setiap kali membuat atau memodifikasi komponen visual, styling warna, dan latar belakang.
---

# Modern Islamic Editorial Styling Guide

Skill ini menyediakan aturan paten desain visual untuk proyek **ROHIS Kabupaten Banyumas**, memastikan estetika tetap berwibawa, elegan, dan terhindar dari kesan template generik ("AI look" / "crypto-neon").

---

## 1. Palet Warna Resmi (Color Palette)

Jangan gunakan warna neon silau (`#00ffcc`, `#39ff14`, `#9400d3`). Gunakan kurasi warna organik dan bernilai budaya tinggi:

### A. Background Canvas (Deep Banyumas Pine)
* `--color-bg-base`: `#07140E` (Kanvas utama malam yang damai)
* `--color-bg-surface`: `#0D2319` (Permukaan kartu dan kontainer)
* `--color-bg-elevated`: `#132D21` (Kartu yang melayang / popover)
* `--color-bg-subtle`: `#1A3B2B` (Hover state dan aksen halus)

### B. Aksen Emas & Kuningan Antik (Antique Brass / Burnished Gold)
* `--color-gold`: `#C8A85B` (Aksen utama, garis batas, badge resmi)
* `--color-gold-light`: `#DFBF73` (Teks sorotan, ikon menyala lembut)
* `--color-gold-dark`: `#997D38` (Bayangan aksen dan garis tersembunyi)
* `--color-gold-hairline`: `rgba(200, 168, 91, 0.20)` (Garis batas kartu presisi)

### C. Tipografi & Kontras Teks (Warm Alabaster)
* `--color-text-primary`: `#F7F5F0` (Alabaster hangat, kontras tinggi, tidak membuat mata lelah)
* `--color-text-secondary`: `#BACEC3` (Sage lembut untuk deskripsi dan metadata)
* `--color-text-muted`: `#7E9E8D` (Keterangan waktu, label non-aktif)

---

## 2. Tipografi Editorial (Typography Pairing)

Gunakan kombinasi dua jenis tipografi untuk menciptakan kesan institusi berbobot:

1. **Sans-Serif Otoritatif**: `Plus Jakarta Sans`, sans-serif modern, bersih, dengan `letter-spacing: -0.015em` pada judul.
2. **Editorial Italic Serif Highlight**: Tambahkan kelas `.text-serif-italic` atau tag `<em>` dengan `font-family: 'Newsreader', 'Playfair Display', serif; font-style: italic;` berwarna emas untuk frasa inspiratif atau kutipan dakwah.

---

## 3. Background Treatment & Tekstur Geometris

Hindari:
* ❌ Jaring partikel bergaris-garis sci-fi (*constellations*).
* ❌ Sinar laser horizontal (*anamorphic glare*).
* ❌ Efek kilau neon cyan / ungu.

Gunakan:
* ✅ **Watermark Geometris Islam Serene**: Pola bintang 8 (*eight-pointed star rosette tessellation*) dalam format SVG berulang halus dengan opacity 3%–6%.
* ✅ **Ambient Depth Glow**: Gradien radial lembut berbasis Deep Forest (`#0D2319`) dan Emerald Shade (`#122E22`) yang tidak menyilaukan.
* ✅ **Noise Texture Halus**: Menambah kedalaman material organik (*matte canvas*).

---

## 4. Bentuk & Desain Komponen (Component Tokens)

1. **Hairline Card Borders**:
   Gunakan border `1px solid rgba(200, 168, 91, 0.18)` hingga `0.25` daripada border tebal atau bayangan neon.
2. **Sudut Lengkung Terukur (Border Radius)**:
   * Tombol & Badge: Kapsul penuh `9999px` atau `10px`–`12px`.
   * Kartu: `16px`–`20px` (`var(--radius-xl)`). Hindari radius ekstrem >28px yang membuatnya tampak seperti bantal kartun/mainan.
3. **Badge Resmi**:
   * Huruf *Sentence-case* (bukan ALL-CAPS menjerit).
   * Aksen titik intan emas di awal (`•`).
   * Background transparan dengan list emas antik tipis.
