# Rancangan lengkap — ROKABA Soft UI × Liquid Glass

Status: paket konsep dan panduan implementasi. Pembuatan paket ini tidak menerapkan perubahan ke file website. Gambar adalah visual konseptual; foto dan logo pada implementasi harus memakai aset asli.

## 1. Arah desain

Identitas: portal resmi komunitas pelajar Islam Banyumas. Karakter: berwibawa, ramah, lokal, rapi. Fokus utama: mengenal organisasi, menemukan kegiatan, membaca informasi, mengakses jaringan sekolah dan materi pembinaan.

Acuan tertinggi adalah gambar `01-beranda-desktop-mobile.png`, yaitu konsep keempat yang disetujui pengguna. Gambar atlas memperluas bahasa visual itu ke halaman lain. Jika detail atlas berbeda, pertahankan karakter acuan utama dan sesuaikan dengan fungsi/data yang tersedia.

## 2. Token visual awal

Nilai berikut titik awal implementasi, bukan angka yang harus diikuti ketika menghasilkan kontras atau komposisi buruk.

| Token | Nilai | Penggunaan |
| --- | --- | --- |
| Canvas | #F1F2ED | Latar utama netral sage |
| Surface | #F7F5F0 | Permukaan terang |
| Pine | #10291F | Teks utama, tombol dan footer |
| Pine deep | #07140E | Teks sangat tegas, kedalaman gelap |
| Secondary | #52635A | Deskripsi dan metadata yang tetap terbaca |
| Brass | #A99157 | Garis penanda dan aksen kecil; bukan teks kecil kontras rendah |
| Border | rgba(16,41,31,.12) | Garis pemisah |
| Font | Plus Jakarta Sans | Seluruh UI; fallback sans-serif |
| Radius control | 10–12px | Tombol dan input |
| Radius card | 14–18px | Kartu dan panel |
| Radius media | 16–20px | Foto utama |
| Spacing | 4, 8, 12, 16, 24, 32, 48, 64, 96px | Ritme konsisten |

Ukuran: body 15–16px desktop, 14–16px mobile. Label dan metadata minimal 12px bila ruang memungkinkan. Hero sekitar 56–64px desktop, 36–44px mobile dengan clamp dan line-height 1.08–1.15. Judul halaman 40–52px desktop, 30–36px mobile. Baris isi sekitar 60–75 karakter. Font weight 400, 500, 600 dan 700; jangan membuat semua teks bold.

## 3. Material dan kedalaman

Pencahayaan imajiner selalu dari kiri atas. Kedalaman fungsional:

| Tingkat | Elemen | Perlakuan |
| --- | --- | --- |
| Dasar | Canvas, teks, link | Matte, tanpa bayangan teks |
| Cekung | Input, agenda, bingkai foto | Inner shadow halus, border pembeda yang jelas |
| Terangkat | Kartu layanan, kartu direktori | Highlight putih di kiri atas, shadow kontak dan ambient di kanan bawah |
| Aksi | Tombol utama | Pine dengan bevel tipis, shadow kecil; saat ditekan sedikit masuk |
| Kaca | Navbar dan caption foto | Transparansi sedang, blur secukupnya, rim tipis dan fallback opak |
| Overlay | Menu dan dialog | Backdrop lembut; panel tetap memiliki batas dan teks berkontras |

Contoh awal shadow kartu: `6px 6px 16px rgba(29,47,35,.12), -4px -4px 12px rgba(255,255,255,.88), inset 0 1px 0 rgba(255,255,255,.85)`. Sesuaikan setelah melihat render. Hindari shadow sangat kabur di setiap elemen. Bevel bukan border putih tebal.

Glass: warna permukaan sekitar 80–88% opak, blur 14–20px, saturasi kecil, batas putih transparan dan shadow lembut. Gunakan @supports dan fallback surface opak. Jangan menggandakan teks atau memakai distorsi optik yang mengganggu. Refleksi cukup dengan gradient lokal yang hampir tidak terlihat.

## 4. Struktur global

- Container sekitar 1200–1280px, padding desktop 32–48px, mobile 20px.
- Header kaca tipis dengan logo resmi, identitas ROKABA, tautan utama dan kontak. Tautan sekunder melalui Jelajahi jika diperlukan.
- Header sticky boleh digunakan dengan offset dan lapisan yang benar; konten/fokus/anchor tidak boleh tertutup.
- Breadcrumb ringkas pada halaman dalam dan detail; satu h1 per halaman.
- Footer pine berisi identitas, kelompok navigasi dan kontak yang terverifikasi. Jangan menampilkan nomor dummy dari contoh lama.
- Setiap halaman punya loading, kosong, error dan sukses yang sesuai fungsi. Jangan tampilkan layout kosong total selama sinkronisasi data.

## 5. Peta seluruh halaman publik

| Route / komponen | Susunan dan konten | Interaksi yang harus terjaga |
| --- | --- | --- |
| `/` Home | Hero 45/55; foto dokumentasi dan caption kaca; pengantar organisasi; layanan; berita; agenda; sambutan/pengurus; linimasa; ajakan bergabung | CTA ke profil/program/sekolah/kontak; kartu berita ke slug; konten tetap dari CMS |
| `/about` About | Breadcrumb, intro profil dan foto; visi/misi; nilai; sejarah; struktur/pengurus/divisi | Detail divisi/pengurus yang sudah ada; struktur tetap mudah dipindai |
| `/programs` Programs | Intro, program/divisi dalam grid tenang; detail terstruktur dengan kegiatan dan sasaran | Pemilihan/detail program dan penutupan dialog |
| `/berita` News | Header, pencarian, kategori, berita unggulan lalu daftar editorial | Search/filter, urutan editorial, tautan detail dan gambar |
| `/berita/:slug` NewsDetail | Breadcrumb, judul, metadata asli, foto, artikel 680–760px, berita terkait | Slug langsung, share jika sudah ada, kembali ke berita, konten tidak ditemukan |
| `/articles` Articles | Pencarian dan kategori, kartu teks/daftar bacaan dengan thumbnail bila relevan | Filter/search, akses detail, data kosong |
| `/articles/:slug` ArticleDetail | Kolom baca nyaman; heading isi jelas, metadata, media bila ada, artikel terkait | Daftar isi hanya jika ada heading nyata; slug/not-found; share yang tersedia |
| `/events` Events | Mendatang/arsip, filter jika didukung, baris tanggal–judul–lokasi–status, detail kegiatan | Tanggal valid, status jelas, info pendaftaran hanya jika ada URL nyata |
| `/schools` Schools | Pencarian, filter jenjang bila ada, grid/daftar sekolah dengan identitas asli | Filter/search, profil/alamat/media hanya bila tersedia |
| `/gallery` Gallery | Tab/filter foto/video, grid foto dengan caption, detail lightbox | Buka/tutup/Escape, navigasi media, poster dan error media |
| `/contact` Contact | Kontak terverifikasi, tujuan menghubungi, form atau tautan kontak sesuai implementasi | Validasi, status proses/sukses/error yang nyata; tidak ada submit palsu |
| `/consultation` Consultation | Pengantar, form pertanyaan dan kategori yang tersedia, jawaban terpilih | Alur pengiriman dan moderasi tetap; jangan menjanjikan anonim/privat bila sistem belum menjamin |
| `/library` Library | Search, kategori, daftar dokumen, metadata asli, aksi lihat/unduh | Cari/filter, URL dokumen aman, preview atau unduh sesuai jenis media |

Alias bahasa Indonesia dan alias `/news` yang ada di App.jsx harus dipertahankan. Elemen baru pada atlas adalah usulan visual; tambahkan fitur hanya jika ada data dan perilaku yang bisa diimplementasikan dengan benar. Atlas bukan sumber data publik.

## 6. Pola desktop, tablet dan mobile

Desktop: hero dua kolom; layanan tiga kolom; berita utama lebih besar daripada berita pendamping. Halaman detail memakai kolom baca sempit; direktori memakai grid sesuai kepadatan.

Tablet: kurangi jarak dan kolom secara terukur, gunakan menu ringkas, pastikan caption foto tidak bertabrakan dengan judul. Jangan memaksa hero dua kolom jika nama organisasi atau copy terlalu panjang.

Mobile: satu kolom; header ringkas dan menu yang dapat di-scroll; tombol utama minimal 44px; filter bisa membungkus atau bergulir secara sengaja; kartu dan form tidak keluar layar. Tabel publik berubah menjadi daftar bila perlu. Foto memiliki aspect-ratio yang stabil; crop tidak memotong subjek utama tanpa alasan.

State hover: perubahan posisi maksimal 1–2px, durasi 160–220ms. Pressed: turun 1px dan shadow mengecil. Focus: ring jelas. Animasi masuk cukup satu pengantar singkat jika diperlukan; seluruh isi tidak boleh bergantung pada animasi scroll untuk terlihat. Matikan gerakan tidak esensial melalui prefers-reduced-motion.

## 7. Aksesibilitas dan fungsi

Kontras target minimal WCAG AA: teks normal 4.5:1, teks besar 3:1; kontrol dan focus indicator harus bisa dikenali. Bayangan saja bukan penanda batas field atau status. Label form selalu terlihat, placeholder bukan pengganti label. Error ditautkan ke field. Dialog memiliki nama, fokus terkelola, Escape, dan kembali ke pemicu. Menu desktop dapat dipakai keyboard. Link eksternal dan unduhan diberi nama yang menjelaskan tujuan.

Foto menggunakan alt relevan dan dimensi/aspect ratio stabil. Pakai lazy loading di bawah fold, hero dimuat lebih awal. Efek backdrop-filter dibatasi agar tidak membebani layar kecil. Jangan menambah library animasi atau dependensi berat untuk efek yang dapat dicapai dengan CSS.

## 8. Pemeriksaan penerimaan

- Seluruh 13 halaman memakai sistem visual yang sama; fungsi asli dan konten CMS tetap ada.
- Cek 1440×900, 768×1024, 360×740, 390×844: tidak ada judul, tombol, dialog atau caption terpotong.
- Cek perjalanan: beranda → berita → detail → kembali; cari sekolah; filter artikel; buka/tutup galeri; lihat/unduh dokumen; validasi kontak dan konsultasi.
- Cek data kosong/error, foto rusak, judul sangat panjang, agenda lewat dan tidak ada agenda mendatang.
- Cek keyboard dan reduced motion; gunakan browser fallback untuk blur bila tersedia.
- Cek pasangan folder publik; build proyek sukses; ikuti AGENTS.md untuk implementasi dan deployment.
- Simpan screenshot aktual beranda desktop/mobile dan halaman representatif. Jangan menggunakan gambar konsep sebagai screenshot hasil.

## 9. Batas paket

Paket ini merancang seluruh website publik. Panel admin, autentikasi, API dan penyimpanan tidak masuk rombakan visual ini. Koneksi CMS harus tetap terjaga. Jika kelak panel admin ingin mengikuti gaya yang sama, rancang sebagai pekerjaan tersendiri dengan mempertimbangkan kepadatan tabel/form dan aturan modal proyek.
