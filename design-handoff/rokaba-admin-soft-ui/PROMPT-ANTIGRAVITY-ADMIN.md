# Prompt Antigravity — Redesign Admin ROKABA CMS

## Tugas implementasi

Bertindak sebagai senior product designer dan frontend engineer. Rombak tampilan SELURUH panel admin ROKABA CMS dengan tema Soft UI / Neumorphism × Liquid Glass profesional yang konsisten dengan website publik yang disetujui. Kerjakan setelah prompt ini dijalankan di Antigravity IDE. Paket ini sendiri hanya rancangan, bukan kode yang sudah diterapkan.

Baca AGENTS.md dan skill proyek yang relevan, lalu baca RANCANGAN-ADMIN.md dan lihat SEMUA gambar dalam folder `design-handoff/rokaba-admin-soft-ui`. Gunakan gambar 01 sebagai acuan utama shell, tipografi, palet, kedalaman dan kepadatan. Atlas lainnya menunjukkan susunan konten tiap menu. Gambar adalah mockup AI, bukan sumber kebenaran fungsi maupun data.

## Sumber dan ruang lingkup

Target utama `admin/src` dan pasangan `admin-app/src`. Periksa kesetaraan folder sebelum mengedit dan sinkronkan semua perubahan halaman, komponen dan CSS admin sesuai AGENTS.md. Pertahankan website publik dan data yang sedang digunakan. Periksa perubahan pengguna yang belum tersimpan di Git sebelum bekerja; jangan menimpa pekerjaan lain.

Audit `admin/src/App.jsx`, `components/AdminLayout.jsx`, `components/AdminHomeCMS.jsx`, `pages/ContentManager.jsx`, halaman manager terkait, `context/AuthContext`, `context/DataContext`, utilitas media dan layanan shared yang dipanggil. Jangan mencetak rahasia environment, token, URL remote berkredensial atau isi backup sensitif ke log. Gunakan skema dan alur yang benar-benar ada sebagai kontrak perilaku.

Cakupan: Ringkasan; Kelola Beranda beserta 8 subbagian; Berita; Artikel; Agenda; Galeri; Sekolah; Pengurus; E-Library; Moderasi Q&A; Pengguna; Audit Log; Pengaturan & Backup; Login; seluruh dialog, form, menu mobile dan notifikasi yang terkait.

## Arah visual

Tema terang sesuai gambar yang disetujui pengguna: canvas #F1F2ED, surface #F7F5F0, deep pine #10291F / #07140E, teks sekunder #52635A, aksen brass #A99157. Warna identitas tetap keluarga hijau dan emas proyek, tetapi kanvas admin berubah terang mengikuti website publik. Sans utama Plus Jakarta Sans, bukan judul serif besar. Teks body 14–16px, judul halaman 26–32px, line-height 1.5–1.7. Metadata sekitar 12–13px dan tetap terbaca.

Hilangkan wallpaper geometris padat, animasi partikel, glow cyan, border neon, label berkilau dan gradient teks. Logo resmi pakai aset asli. Ikon gunakan Lucide yang sudah tersedia dengan gaya/ukuran konsisten, untuk fungsi navigasi dan aksi saja. Jangan menambahkan ikon 3D dekoratif atau foto buatan.

Material:
- Shell: sidebar tenang dan topbar kaca satin tipis. Glass secukupnya, transparansi cukup opak supaya tulisan jelas. Fallback browser tanpa backdrop-filter wajib terbaca.
- Panel: matte dengan highlight kiri atas, shadow kontak dan ambient rendah di kanan bawah; jangan menambah bayangan di setiap baris tabel.
- Input dan panel utilitas: cekung halus dengan batas yang jelas. Bayangan bukan satu-satunya penanda field.
- Tombol: pine, radius 10–12px, bevel tipis, state hover/focus/pressed/disabled yang berbeda dan mudah dipahami.
- Kartu/dialog: radius 14–18px, padding 24–32px desktop dan 16–20px mobile.

Utamakan produktivitas: ruang untuk label/form, tabel sejajar, status terbaca, dan satu aksi utama yang jelas. Jangan menyalin hero marketing ke dashboard.

## Arsitektur layout

Sidebar desktop sekitar 220–240px, dapat digulir terpisah. Main content flex/grid harus min-width:0. Topbar ringkas dengan identitas, status sinkronisasi NYATA, tombol Sinkronkan dan Lihat web, akun/keluar sesuai implementasi. Sidebar menampilkan menu sesuai role yang sudah ada, jangan tampilkan akses yang dilarang.

Tablet memakai sidebar drawer atau mode ringkas; ponsel satu kolom dengan drawer yang punya label, fokus terkelola, Escape, close button dan pemulihan fokus. Jangan mengecilkan sidebar desktop ke layar mobile. Konten tidak boleh keluar viewport atau disembunyikan untuk menutupi penyebab overflow.

Editor Beranda memakai navigasi subbagian lokal yang terpisah dari sidebar global: desktop dapat memakai daftar bagian yang kompak; mobile dropdown/accordion. Hindari tab panjang dengan scrollbar horizontal permanen seperti screenshot lama. Pertahankan seluruh bagian dan field yang tersedia. Tombol simpan selalu jelas jangkauannya: simpan beranda berbeda dari simpan program jika API/alurnya terpisah.

## Perilaku yang wajib dipertahankan

- Login, username/password/PIN yang sudah didukung, logout dan protected routes tetap bekerja.
- Hak akses superadmin/editor_sekolah, scope sekolah, pembatasan edit/hapus dan perlindungan yang sudah ada tetap berlaku di handler, bukan hanya tombol disembunyikan.
- CRUD setiap jenis konten, pencarian, filter, pengurutan editorial, upload/URL media, foto pengurus, preview dokumen dan hubungan sekolah-editor dipertahankan.
- Status cloud/sinkronisasi, isDirty dan error harus nyata. Data refresh tidak boleh menimpa edit yang belum disimpan. Tidak ada toast sukses sebelum operasi penyimpanan benar-benar berhasil.
- Jangan menambahkan autosave jika sistem sekarang memakai simpan eksplisit. Loading/saving/disabled/error dan retry harus jelas.
- Konfirmasi meninggalkan edit yang belum disimpan berdasarkan navigasi yang ada. Jangan menutup modal dan kehilangan form ketika simpan gagal.
- Pertahankan struktur data dan key penyimpanan. Jangan menciptakan field published/draft, status baru, tanggal, grafik atau statistik yang tidak didukung hanya karena terlihat umum di CMS lain.
- Foto dan nama pengurus asli berasal dari data. Tiga peran utama: Ketua Umum, Ketua Akhwat dan Ketua Ikhwan. Pada schema beranda yang teks sambutannya masih bersama, pertahankan teks bersama dan field foto per peran; jangan menjanjikan sambutan berbeda per ketua tanpa kontrak data yang mendukung.
- Backup/export dan restore mengikuti implementasi saat ini. Jangan mengubah format data atau membuat impor menimpa data tanpa validasi dan konfirmasi yang sudah sesuai.
- Jangan mengubah Auth/API/secrets atau membuat admin publik. Perubahan yang diminta adalah visual dan layout.

## Dialog dan form

Semua modal CMS memakai struktur responsive yang diwajibkan AGENTS.md: `modal-header-responsive`, `modal-body-responsive`, `modal-footer-responsive`. Lebar desktop minimal sesuai aturan proyek (700px ke atas; editor panjang ideal 800–960px). Header/footer tidak ikut hilang ketika body digulir. Footer menampilkan Batal dan Simpan, dengan backdrop blur tipis jika membantu.

Modal max-height berbasis 100dvh dan viewport pendek. Body overflow-y:auto dan min-height:0. Di mobile field satu kolom, footer aman terhadap safe-area dan keyboard; tidak ada tombol terpotong. Foto/media field punya label, petunjuk tipe link dan preview/fallback yang jujur.

Label selalu terlihat, required dan error inline jelas, textarea cukup tinggi, field berpasangan dua kolom hanya bila ruang cukup. Jangan mengganti textarea dengan rich-text editor berat tanpa kebutuhan atau dependensi yang telah ada. Simpan format konten yang digunakan publik.

Hapus menggunakan target yang jelas, tombol Batal serta Hapus yang dibedakan. Jangan menjanjikan undo jika tidak ada. Audit bukan antarmuka menghapus jejak aktivitas. Pengelolaan akun tidak boleh menampilkan password atau PIN tersimpan.

## Langkah kerja

1. Audit semua route, komponen, CSS lama/inline styles dan perilaku manager. Susun daftar field dan interaksi yang harus tetap ada.
2. Implementasikan token dan komponen reusable: AdminShell, PageHeader, SoftPanel, InsetField, FilterBar, DataTable/MobileCard, MediaField, StatusNotice, ResponsiveDialog, ConfirmDialog dan StickyFormActions jika sesuai arsitektur yang sudah ada.
3. Refaktor styling pada sumbernya; hindari tumpukan `!important` atau CSS global yang membocor ke publik. Format kode rapi, komponen tidak ditulis menjadi satu baris panjang.
4. Terapkan shell dan Ringkasan; lanjut semua menu dan 8 bagian editor beranda sesuai tabel rancangan. Jangan berhenti setelah dashboard bagus.
5. Sambungkan semua tombol/status ke aksi nyata. Hapus kontrol konsep yang tidak dapat dijalankan dengan data/API tersedia, atau adaptasikan ke aksi yang sudah didukung.
6. Uji alur yang tercantum di RANCANGAN-ADMIN.md pada desktop, tablet, ponsel dan viewport pendek. Gunakan data uji aman dalam lingkungan lokal, hindari mengubah konten produksi untuk screenshot.
7. Jalankan build sesuai AGENTS.md: setidaknya `npm --prefix admin run build`; build pasangan jika konfigurasi memerlukannya. Periksa kesamaan file perubahan antara admin dan admin-app. Ikuti aturan commit/push branch main proyek setelah implementasi lolos pemeriksaan. Verifikasi deployment bila dapat diakses; jangan menyamakan push dengan deployment sukses.
8. Laporkan hasil tiap kelompok menu, pemeriksaan yang dilakukan, commit/push dan batasan nyata. Sertakan screenshot AKTUAL hasil implementasi desktop/mobile dan modal viewport pendek. Gambar konsep bukan bukti render kode.

## Kriteria selesai

Seluruh menu dan subbagian visualnya konsisten dengan acuan; form/tabel terbaca; tidak ada tombol atau modal terpotong; seluruh fungsi dan scope akses tetap bekerja; loading/error/empty/unsaved/saving tersedia; reduced-motion dan keyboard dapat digunakan; build sukses; file pasangan sinkron; aturan deployment proyek dipenuhi.
