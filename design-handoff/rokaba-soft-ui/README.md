# Paket desain untuk Antigravity IDE

## Cara menggunakan

1. Buka proyek ROHIS Banyumas di Antigravity IDE.
2. Buka/sertakan folder `design-handoff/rokaba-soft-ui` pada konteks percakapan agent. Pastikan agent dapat melihat ketiga PNG, bukan hanya nama berkasnya.
3. Salin seluruh isi `PROMPT-ANTIGRAVITY.md` ke chat agent dan jalankan. Berkas ini adalah instruksi implementasi; menjalankannya akan mengubah website dan mengikuti aturan deployment proyek.
4. Jika hanya ingin memeriksa desain, cukup buka `RANCANGAN-LENGKAP.md` dan ketiga PNG; jangan jalankan prompt implementasi.

## Isi

- `PROMPT-ANTIGRAVITY.md`: prompt implementasi siap salin.
- `RANCANGAN-LENGKAP.md`: token, material, layout, 13 halaman, responsivitas, interaksi dan kriteria penerimaan.
- `01-beranda-desktop-mobile.png`: acuan utama konsep 04 yang sudah disetujui.
- `02-halaman-konten.png`: enam halaman profil, program dan publikasi.
- `03-halaman-layanan.png`: enam halaman agenda, direktori, galeri dan layanan.

## Catatan visual

Gambar dibuat menggunakan imagegen bawaan sebagai mockup konseptual. Gambar bukan screenshot website yang sudah diimplementasikan. Logo/foto pada PNG dapat berubah detail karena proses generasi; implementasi harus memakai aset resmi dari sumber aslinya. Contoh isi, kategori dan struktur pada atlas bukan bukti data/fitur tersedia. RANCANGAN-LENGKAP.md dan kode/data nyata menjadi rujukan fungsi; gambar utama menjadi rujukan material dan komposisi.

Prompt visual yang dipakai untuk memperluas konsep: enam panel desktop per lembar, pola 3×2, material Soft UI × Liquid Glass sesuai konsep 04; warna netral-sage/alabaster dan pine; highlight kiri atas, shadow kontak dan ambient terukur; navbar kaca satin, kartu terangkat, field inset, tipografi Plus Jakarta Sans, ikon hanya untuk fungsi. Lembar konten memvisualisasikan Tentang, Program, Berita, Detail Berita, Artikel, Detail Artikel. Lembar layanan memvisualisasikan Agenda, Sekolah Anggota, Galeri, Kontak, Konsultasi, Perpustakaan. Foto dan logo memakai referensi konsep ROKABA sebelumnya. Tidak ada statistik atau tanggal kegiatan baru yang ditetapkan oleh paket ini.

Paket ini hanya menambah berkas rancangan. Kode situs tidak diubah sebagai bagian dari pembuatan paket.
