# ROKABA — Rancangan lengkap pilihan pengguna

Tanggal: 14 November 2026. Status: konsep visual, bukan implementasi.
Acuan utama: tiga gambar pilihan terakhir pengguna (admin, publik, dan HP).
Paket ini menggantikan arah efek kaca ekstrem dari putaran sebelumnya.

## 1. Keputusan desain

Gunakan Soft UI / Neumorphism dengan Liquid Glass yang lembut seperti acuan pilihan.
Kedalaman datang dari pencahayaan, lapisan permukaan, dan bayangan kontak; tulisan tetap tajam.
Website terasa sebagai portal organisasi pelajar Islam Banyumas: resmi, ramah, tenang, dan mudah dikelola.

- Kanvas alabaster #F7F5F0; permukaan sage sangat muda #EEF1EA.
- Teks dan tombol utama pine #10291F; pine gelap #07140E.
- Teks sekunder #536258; garis pemisah #D9DED5.
- Brass #A99157 hanya aksen kecil, bukan warna seluruh tombol.
- Plus Jakarta Sans: judul 650–750, isi 400–500, tombol 600.
- Judul desktop 44–56 px, judul halaman 32–40 px; HP 30–36 px.
- Isi 16–18 px dengan line-height 1.55–1.7. Metadata minimum 13–14 px.
- Skala jarak 4, 8, 12, 16, 24, 32, 48, 64, 96 px.
- Radius tombol 12 px, kartu 16–20 px, panel besar maksimal 24 px.
- Radius nav boleh kapsul sesuai acuan, tetapi tidak semua komponen berbentuk kapsul.

## 2. Empat bahan antarmuka

| Bahan | Penggunaan | Perlakuan |
| --- | --- | --- |
| Kanvas matte | Latar utama | Alabaster tenang, tidak ada foto wallpaper |
| Permukaan timbul | Kartu konten, formulir, panel | Highlight kiri atas, bayangan kontak tipis dan ambient lembut |
| Permukaan cekung | Input, pencarian, wadah filter | Inset shadow tipis; batas field tetap terbaca |
| Kaca | Navbar, tab aktif, caption foto, bar tindakan | Transparansi, blur latar, highlight tepi dan pembiasan ringan |

Rujukan awal shadow kartu: highlight -4 -4 12 rgba(255,255,255,.75),
ambient 8 12 24 rgba(35,48,36,.12), contact 0 2 3 rgba(35,48,36,.10).
Nilai ini titik awal untuk diuji, bukan hasil ukur dari gambar.

Kaca: mulai dari fill putih 45–65%, blur latar 16–22 px, saturasi 1.05–1.15,
border putih transparan 1 px. Pembesaran lokal latar target sekitar 1.08–1.15,
pembiasan hanya di perimeter. Jangan membesarkan teks, ikon, atau seluruh halaman.
CSS backdrop-filter sendiri hanya memberi blur/saturasi dan tidak menghasilkan lensa pembesar.
Efek pembiasan sebenarnya memerlukan lapisan render khusus; implementer wajib memilih pendekatan
yang cocok dengan browser dan kinerja proyek. Bila tidak didukung, gunakan kaca blur yang rapi.
Gambar statis ini merupakan arah artistik, bukan bukti efek browser sudah tersedia.

Jangan gunakan chrome tebal, pinggir pelangi, glow neon, bola mengambang, pola ramai,
bayangan teks, atau karakter 3D dekoratif. Area baca harus hampir opak.

## 3. Aturan tata letak

Desktop publik: konten maksimum 1200–1280 px terpusat, gutter 32–48 px.
Hero menggunakan dua kolom sekitar 45:55; teks dan foto punya ruang bernapas.
Jarak antarbagian desktop 72–96 px, HP 40–56 px.
Isi panjang maksimum 65–75 karakter per baris.

Admin: sidebar 220–236 px; area kerja fleksibel min-width:0.
Editor beranda: pemilih bagian 170–190 px, formulir fleksibel, pratinjau 320–420 px jika muat.
Pada laptop sempit, pratinjau dipindah menjadi panel lipat atau tab; jangan memaksa empat kolom.
Tidak semua kartu memiliki bayangan atau ukuran sama: bedakan tindakan utama dan konten tambahan.

HP: lebar uji 360, 390, 412 px; satu kolom, gutter 16–20 px.
Tablet: uji 768 dan 1024 px. Desktop: uji 1280 dan 1440 px.
Target sentuh minimum 44 px. Sidebar berubah drawer, tabel manajemen menjadi kartu atau daftar.
Bar simpan tetap terlihat, beri ruang bawah konten dan safe-area. Saat keyboard terbuka field aktif
dan tombol tindakan tetap dapat dijangkau. Jangan menyembunyikan overflow untuk menutupi layout rusak.

## 4. Halaman publik dan bagian-bagiannya

| Halaman/rute | Susunan yang dirancang | Papan |
| --- | --- | --- |
| Beranda / | Navbar, hero + dokumentasi, statistik dari data, sambutan, layanan, tentang, berita & agenda, CTA bila didukung, footer | 01, 11 |
| Tentang /about | Pengantar + dokumentasi, visi/misi, sejarah/linimasa, struktur/pengurus dan divisi | 02, 11 |
| Program /programs | Pengantar, lima divisi, daftar program masing-masing, RBC, tautan agenda | 02, 11 |
| Berita /berita | Judul, pencarian/filter, berita utama, daftar, halaman berikutnya | 03, 12 |
| Detail berita /berita/:slug | Breadcrumb, judul, metadata, foto asli, isi, berita terkait | 03, 12 |
| Artikel /articles | Pencarian, topik, daftar bacaan dengan ringkasan | 03, 12 |
| Detail artikel /articles/:slug | Judul, metadata, teks nyaman, bagian isi, bacaan terkait | 03, 12 |
| Agenda /events | Filter mendatang/selesai, daftar acara, rincian waktu/lokasi sesuai data | 04, 13 |
| Sekolah /schools | Pencarian, kategori, daftar sekolah, detail berdasarkan data | 04, 13 |
| Galeri /gallery | Album/kategori, grid dokumentasi, pembuka foto atau video | 04, 13 |
| Kontak /contact | Informasi organisasi, formulir nama/email/pesan, status yang jujur | 04, 13 |
| Tanya jawab /consultation | Pertanyaan terjawab, formulir pertanyaan, status yang jujur | 04, 13 |

Papan adalah studi halaman/bagian, bukan screenshot seluruh scroll secara pixel-perfect.
Bagian pendek digabung dalam satu papan agar hubungan tata letaknya terlihat.

### Beranda secara rinci

1. Navbar kaca dengan identitas organisasi dan navigasi, logo memakai aset asli.
2. Hero: satu judul dominan, narasi singkat, satu CTA utama, satu CTA sekunder, foto dokumentasi asli.
3. Statistik hanya menggunakan angka dari sumber data; jangan menyalin angka contoh gambar.
4. Sambutan: role aktif, salam pembuka, paragraf, salam penutup; kemudian tiga pemilih potret.
5. Tiga peran: Ketua Umum, Ketua Akhwat, Ketua Ikhwan. Foto SELALU sesudah teks sambutan.
6. Tombol menuju sambutan berikutnya berada setelah tiga pemilih.
7. Layanan: lima tautan yang benar-benar aktif. Pada HP gunakan satu daftar rapi.
8. Tentang singkat dan dokumentasi, tautan halaman profil.
9. Berita utama dan agenda tampil seimbang, teks dan metadata mudah dipindai.
10. Footer memuat tautan dan kontak yang benar-benar tersedia.

Jangan menambahkan kembali teks bantuan yang sebelumnya diminta dihapus di antara sambutan dan foto.
Konten SMAN 4 yang masih ada dalam sumber perlu ditinjau editorial; jangan menganggapnya otomatis
identitas organisasi kabupaten atau menggantinya diam-diam sebagai bagian styling.

## 5. Admin: semua menu

| Menu | Bagian utama | Papan |
| --- | --- | --- |
| Masuk | Username, password, PIN sesuai auth saat ini; tampil/sembunyikan password; error | 05 |
| Ringkasan | Ringkasan data yang tersedia, aktivitas/perubahan, tindakan cepat, status koneksi | 05, 14 |
| Kelola beranda | Delapan editor di bawah, perubahan belum tersimpan, simpan dan pratinjau | 06, 07, 14 |
| Berita | Cari/filter, daftar, tambah, edit, hapus dengan konfirmasi | 08, 14, 15 |
| Artikel | Daftar teks, kategori/topik, editor isi, status sesuai schema | 08, 15 |
| Agenda | Judul, tanggal/waktu, lokasi, status, foto bila tersedia | 08 |
| Galeri | Foto/video, album, sumber media, unggah/tautan sesuai kemampuan asli | 08 |
| Sekolah | Direktori sekolah, kategori, profil, logo asli jika tersedia | 09 |
| Pengurus | Peran/divisi, nama, foto, urutan sesuai data | 09 |
| Moderasi Q&A | Menunggu/dijawab, detail pertanyaan, jawaban, status | 09, 14 |
| Pengguna | Pengguna, peran aktual, status dan hak akses sesuai implementasi | 10 |
| Audit log | Filter dan daftar aktivitas; selalu baca-saja | 10 |
| Pengaturan | Profil organisasi, kontak, logo, pengaturan yang ada, backup/restore | 10 |

Tidak ada grafik pengunjung fiktif. Tombol, filter, dan bidang di mockup adalah arahan visual:
gunakan hanya bidang dan kemampuan yang ada, atau tandai usulan sebagai pekerjaan terpisah.
Tidak ada perubahan sistem login, model izin, atau penyimpanan karena desain ini.

### Delapan bagian editor beranda

| Bagian | Kelompok isian | Pratinjau |
| --- | --- | --- |
| Hero | Tag, judul, narasi, CTA teks+tautan, foto, caption | Hero desktop/HP |
| Sambutan | Peran, nama, foto, paragraf sambutan, salam | Teks lalu tiga foto |
| Tentang kami | Judul, intro, paragraf, poin, foto, kutipan yang memang ada | Editorial teks+foto |
| Divisi & program | Lima divisi, deskripsi, daftar program, gambar/tautan yang tersedia | Daftar divisi |
| Linimasa | Tahun, judul, lokasi, deskripsi, urutan | Linimasa |
| Statistik | Nilai, akhiran, label | Ringkasan angka |
| Ajakan bergabung | Judul, isi, tombol dan tujuan sesuai schema | CTA penutup |
| Judul bagian | Kelompok Berita, Artikel, Agenda, Layanan | Judul dan pengantar bagian |

Editor menggunakan daftar bagian vertikal pada desktop dan pilihan bagian ringkas pada HP.
Jika pratinjau belum ada, itu merupakan usulan tambahan; pisahkan dari perombakan tampilan minimum.
Jangan mengklaim isi sudah tampil di publik sebelum penyimpanan yang sebenarnya berhasil.

## 6. Dialog, formulir, dan keadaan sistem

Modal desktop minimum lebar sasaran 700–760 px, tetapi maksimal calc(100vw - 32px).
Struktur: modal-header-responsive sticky, modal-body-responsive scroll, modal-footer-responsive sticky.
Bidang berpasangan boleh dua kolom; teks panjang dan foto satu baris penuh.
Pada HP modal menjadi lembar setinggi layar yang tetap punya close, judul, dan footer.
Konfirmasi hapus harus menyebut item; Batal aman dan fokus jelas.
Restore backup wajib menjelaskan penggantian data dan meminta konfirmasi sesuai alur yang berlaku.

Wajib desain: loading, kosong, tidak ada hasil, validasi salah, menyimpan, gagal simpan,
berhasil simpan, perubahan belum disimpan, media gagal dimuat, koneksi terputus.
Label status disertai kata, bukan hanya warna. Jangan menampilkan semua status sekaligus.

Focus keyboard jelas, dialog trap focus dan kembali ke pemicu, ESC sesuai konteks,
label input nyata, kontras teks minimal WCAG AA sebagai target implementasi.
Gerak hover maksimum 2–3 px dengan durasi 160–220 ms, respect prefers-reduced-motion.
Glass dan bayangan tidak boleh membuat input sulit dikenali.

## 7. Aset dan kebenaran konten

Foto utama: sumber Google Drive ID 1PUOOkf_OLutx7LItdz6_7U7cNRtd1XrB,
dipakai dalam source hero/fallback website.
Foto kegiatan kedua: ID 1FSPbsFV9dStzLQsxXRi3VdOj_FfE-BKJ,
dipakai dalam source tentang/fallback website.
Salinan aset disertakan pada folder assets. Logo berasal dari public-app/src/assets/logo.png.

Tiga potret berasal dari file public-app/public/leaders. Ini aset yang sudah ada di proyek,
BUKAN verifikasi siapa pejabatnya saat ini. Kode Home yang dibaca masih menyimpan photo:null
dan nama placeholder. Gunakan mapping foto/nama CMS yang valid saat implementasi;
jangan menganggap orang pada studi otomatis menjabat peran tersebut. Bila kosong, tampilkan
placeholder netral "Foto belum tersedia". Jangan membuat wajah pengganti dengan AI.

Gambar dihasilkan dengan image generation memakai aset asli sebagai referensi; hasil bitmap
dapat mengubah detail kecil foto, logo, atau tulisan. Saat implementasi gunakan file asli,
bukan memotong ulang foto dari mockup. Data sumber mengalahkan isi contoh pada gambar.

Form Kontak dan Tanya jawab yang dibaca saat penyusunan masih menyimpan kiriman di localStorage.
Desain tidak boleh memberi janji "sudah dikirim ke admin" tanpa pengiriman server yang nyata.
Penyambungan layanan merupakan pekerjaan fungsi terpisah jika diinginkan.

## 8. Serah terima

- 15 PNG bernomor: studi per halaman/bagian dan keadaan penting.
- folder references: tiga gambar pilihan asli pengguna.
- folder assets: foto dan logo yang bersumber dari proyek/website, serta aset potret proyek.
- PROMPT-ANTIGRAVITY.md: instruksi implementasi dengan batasan.
- PROMPTS-GAMBAR.json: prompt final setiap papan, dibuat melalui alat image generation bawaan.
- index.html: galeri lokal untuk membuka seluruh papan.
- Paket ZIP untuk dipindah ke Antigravity.

Tidak ada source aplikasi, database, akun, build deployment, atau git push yang diubah oleh paket ini.

