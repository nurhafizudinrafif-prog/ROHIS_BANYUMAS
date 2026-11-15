# ROKABA — Referensi lengkap v3

15 papan desain website publik menggunakan arah Liquid Glass × Neumorphism × 3D yang dipilih pengguna. Dibuat dengan pembuat gambar bawaan pada 15 November 2026. Tidak ada perubahan kode, build, commit, push, atau deployment dalam pekerjaan referensi ini.

## Cara melihat
Buka index.html; setiap gambar dapat dibuka ukuran penuh. File 01–12 adalah PC; 13–15 masing-masing menampilkan empat studi layar HP.

- [Beranda · PC](01-beranda-pc.png)
- [Sambutan pengurus · PC](02-sambutan-pc.png)
- [Profil dan linimasa · PC](03-profil-pc.png)
- [Direktori pengurus · PC](04-pengurus-pc.png)
- [Program dan divisi · PC](05-program-pc.png)
- [Berita dan carousel · PC](06-berita-pc.png)
- [Detail berita · PC](07-detail-berita-pc.png)
- [Artikel dan tampilan baca · PC](08-artikel-pc.png)
- [Agenda dan detail kegiatan · PC](09-agenda-pc.png)
- [Sekolah anggota · PC](10-sekolah-pc.png)
- [Galeri dan pembuka foto · PC](11-galeri-pc.png)
- [Kontak dan konsultasi · PC](12-kontak-konsultasi-pc.png)
- [HP · Beranda, sambutan, profil, program](13-hp-beranda-profil.png)
- [HP · Berita, detail, agenda, artikel](14-hp-berita-agenda-artikel.png)
- [HP · Pengurus, sekolah, galeri, layanan](15-hp-direktori-layanan.png)

## Peninjauan dan sumber
- Sepuluh halaman utama ditinjau dari website lokal http://127.0.0.1:5173, termasuk heading, konten publik, dan gambar yang dimuat. Halaman detail juga diperiksa melalui struktur halaman dan data publik. Tangkapan layar awal dan inventaris tersimpan di sources/current-*.png dan sources/page-audit.json.
- Situs produksi yang tercatat di sitemap adalah https://www.rohis-banyumas.web.id/; alat penelusuran tidak berhasil membukanya. Karena itu paket tidak mengklaim audit kondisi produksi terkini.
- sources/public-content.json berisi salinan konten publik yang dipakai website lokal saat pemeriksaan, bukan konfigurasi akun admin.
- Logo diambil dari public-app/src/assets/logo.png.
- Foto 01-kebersamaan.jpg dan 02-muskerda.jpg disalin dari aset /documentation website.
- Foto 03-kajian.jpg, 04-kegiatan.jpg, 05-workshop.jpg, dan 06-ketua-akhwat.jpg diambil dari alamat Google Drive/Googleusercontent yang tercantum pada konten website.

| File foto | ID Drive sumber |
|---|---|
| 01-kebersamaan.jpg | 1PUOOkf_OLutx7LItdz6_7U7cNRtd1XrB |
| 02-muskerda.jpg | 1FSPbsFV9dStzLQsxXRi3VdOj_FfE-BKJ |
| 03-kajian.jpg | 1D26IYfzW_4GuBuTxbiELEyPbE8z6CGoV |
| 04-kegiatan.jpg | 12Hg2mUTC7wH-Tse3oAjONPAyRljJ87CJ |
| 05-workshop.jpg | 1HdH8cv2QHiUo8UByGHFFm3ASIDh5-2JU |
| 06-ketua-akhwat.jpg | 1RBwhz_vc2aPWPjAIdGpKR8YnMXOVBDCA |

## Acuan penerapan
- Gambar adalah referensi komposisi dan material, bukan screenshot hasil implementasi. Proses generatif dapat menggambar ulang detail foto/wajah/logo dan merangkum teks. Saat coding gunakan file sumber asli dan konten CMS, jangan mengekstrak foto/logo dari mockup.
- Pertahankan carousel tiga kartu: pusat dominan, sisi mundur; tombol panah di luar area teks. HP satu kartu utama, kontrol di bawah.
- Foto tiga ketua tetap setelah seluruh teks sambutan dan salam penutup. Nama/foto yang belum tersedia tetap placeholder netral.
- Direktori pengurus menggunakan 45 data, periode 2025/2026. Filter yang benar: BPH9, SDM10, Dakwah7, Humas8, Jurnalistik6, Danus5. Jika konsep HP menunjukkan filter lain, gunakan filter divisi dari CMS sebagai acuan.
- Direktori sekolah: 17 sekolah (10 SMA, 5 SMK, 2 MA). Jangan mengarang foto gedung maupun logo sekolah.
- Semua judul, isi, kategori, nama, tanggal, dan tautan bersumber dari CMS; teks singkat/tautan pada mockup adalah contoh tata letak. Teks layanan HP tetap mengikuti layanan yang ada, bukan mengubah struktur konten.
- Dokumen agenda tanpa foto khusus memakai label Dokumentasi ROKABA. Jangan menganggap foto dokumentasi umum sebagai dokumentasi acara tertentu.
- RBC adalah Rohis Banyumas Competition. Salin uraian program resmi dari CMS, bukan perluasan nama yang muncul pada mockup HP.
- Formulir kontak dan konsultasi: paket ini hanya desain; tidak menambahkan janji pengiriman server atau perlindungan privasi yang belum diimplementasikan.
- Kondisi kosong, fokus keyboard, validasi formulir dan dialog harus ditangani saat implementasi. Gambar konsep tidak memvalidasi fungsi atau aksesibilitas.

## Material
Alabaster #F7F5F0, pine #103C2E, sage, brass kecil. Porcelain untuk kartu konten; kaca transparan untuk navigasi/filter/tombol/caption. Highlight kiri-atas, contact shadow pendek plus bayangan lembut kanan-bawah. Pembesaran/pembiasan hanya latar di bawah kaca, tidak pada teks. Hindari efek di semua permukaan sekaligus. Pertahankan kontras dan prefers-reduced-motion.

PROMPTS.json berisi prompt generasi awal. REVISIONS.json memuat koreksi terarah. Paket ini mencakup seluruh website publik; admin di luar ruang lingkup paket ini.

