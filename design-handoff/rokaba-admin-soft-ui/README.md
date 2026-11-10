# Paket rancangan admin untuk Antigravity IDE

## Pemakaian

1. Buka proyek ROKABA di Antigravity.
2. Sertakan folder `design-handoff/rokaba-admin-soft-ui` sebagai konteks agent, termasuk gambar PNG yang dapat dilihat.
3. Untuk meninjau konsep, baca RANCANGAN-ADMIN.md dan lihat tujuh gambar. Langkah ini belum mengubah source.
4. Untuk MENERAPKAN desain, salin seluruh isi PROMPT-ANTIGRAVITY-ADMIN.md ke chat agent. Menjalankannya adalah instruksi implementasi yang akan mengubah kode dan mengikuti AGENTS.md.

## Isi

- PROMPT-ANTIGRAVITY-ADMIN.md: prompt implementasi siap pakai.
- RANCANGAN-ADMIN.md: spesifikasi menu, delapan bagian CMS beranda, tokens, state dan pemeriksaan.
- 01-ringkasan.png: dashboard dan shell utama.
- 02-publikasi.png: berita, artikel, agenda, galeri.
- 03-direktori.png: sekolah, pengurus, perpustakaan, Q&A.
- 04-sistem.png: login, pengguna, audit, pengaturan/backup.
- 05-beranda-a.png: hero, sambutan tiga ketua, profil, program.
- 06-beranda-b.png: linimasa, statistik, ajakan, judul bagian.
- 07-mobile-modal.png: editor, konfirmasi hapus dan versi ponsel.

## Batas konsep

Gambar dibuat dengan imagegen bawaan. Gambar menunjukkan arah UI; teks contoh, logo dan foto di dalam hasil generasi dapat berubah detail. Implementasi harus memakai aset asli, data CMS nyata dan hak akses yang sudah tersedia. Jangan menggunakan satu PNG sebagai keseluruhan UI. Filter/status/preview tambahan pada gambar perlu disesuaikan dengan kontrak fungsi dalam kode; jangan menjanjikan fitur atau keberhasilan simpan yang tidak ada.

Paket ini hanya menambah gambar dan panduan. Source website publik dan admin tidak diubah oleh pembuatan paket ini.
