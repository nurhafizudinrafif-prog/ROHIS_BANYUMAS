# Prompt implementasi untuk Antigravity IDE

## Peran dan hasil yang diminta

Bertindak sebagai senior frontend engineer sekaligus product designer untuk ROHIS Kabupaten Banyumas (ROKABA). Implementasikan perombakan seluruh WEBSITE PUBLIK berdasarkan paket desain ini, sampai halaman dan interaksinya bekerja, responsif, lolos build, serta mengikuti instruksi Git/deployment pada AGENTS.md.

Mulai dengan membaca AGENTS.md dan skill proyek yang relevan. Baca RANCANGAN-LENGKAP.md di folder ini. Lihat ketiga gambar acuan secara visual sebelum mengubah kode:

1. `01-beranda-desktop-mobile.png`: acuan utama material, tipografi, proporsi, kedalaman 3D, desktop dan mobile.
2. `02-halaman-konten.png`: rancangan Tentang, Program, Berita, Detail Berita, Artikel, Detail Artikel.
3. `03-halaman-layanan.png`: rancangan Agenda, Sekolah Anggota, Galeri, Kontak, Konsultasi, Perpustakaan.

Ini adalah desain konseptual. Gunakan bentuk dan perilakunya sebagai acuan; isi nyata harus berasal dari data yang sudah tersedia. Jangan menjadikan gambar mockup sebagai background atau satu gambar halaman. Bangun komponen HTML/React yang benar-benar dapat digunakan.

## Karakter desain yang harus tercapai

Portal organisasi pelajar Islam yang resmi, rapi, hangat dan profesional. Paduan Neumorphism / Soft UI dengan Liquid Glass yang terkendali. Kedalaman terasa melalui permukaan, tepi dan bayangan, bukan melalui ornamen. Hindari tampilan generik hasil AI.

Gunakan permukaan dominan alabaster netral-sage, teks hijau pinus, dan sedikit kuningan antik. Website publik menggunakan tema terang sesuai gambar yang disetujui, meskipun panduan awal proyek menyebut kanvas gelap. Pertahankan keluarga warna identitas proyek. Teks utama harus tegas, tidak pucat. Gunakan Plus Jakarta Sans sebagai tipografi utama. Heading hero menggunakan sans yang sama sesuai gambar terbaru, bukan heading serif dari eksperimen awal. Hindari gradient pada teks, huruf kapital pada semua label, dan headline dengan satu kata warna-warni.

Logo resmi: pakai aset logo yang sudah ada di repositori tanpa menggambarnya ulang. Foto: pakai berkas/URL dokumentasi nyata dari CMS dan utilitas media yang sudah tersedia. Jangan menggunakan foto atau logo yang diregenerasi dari gambar mockup karena detailnya dapat berubah. Jangan membuat nama pengurus, nomor telepon, tanggal, klaim, statistik, atau testimoni palsu.

## Batas teknis dan cakupan

- Target 13 komponen halaman publik yang tercantum dalam RANCANGAN-LENGKAP.md, beserta Navbar, Footer, pencarian, filter, modal, form dan keadaan loading/kosong/error.
- Gunakan stack dan router yang ada. Periksa `public-app/src/App.jsx`, `public-app/src/context/DataContext.jsx`, utilitas `shared/services/mediaHelper.js`, dan sumber data yang digunakan halaman.
- Sinkronkan setiap perubahan kode publik ke pasangan `public-app/src` dan `src` sesuai AGENTS.md. Jangan hanya mengedit folder yang tidak digunakan build.
- Panel CMS admin tetap menjadi sumber data. Perubahan ini berfokus pada website publik; jangan merombak autentikasi, role, panel admin, struktur penyimpanan atau API. Jika harus memperbaiki komponen admin yang terkait langsung, ikuti sinkronisasi `admin` dan `admin-app` serta aturan modal di AGENTS.md.
- Pertahankan seluruh URL, alias, slug detail, akses dokumen dan sumber media yang valid.
- Hindari menghapus bagian beranda yang dikelola CMS hanya karena tidak terlihat dalam cuplikan mockup. Terapkan bahasa visual yang sama pada profil, statistik yang valid, sambutan, pengurus, linimasa, berita, agenda, layanan dan ajakan bergabung.
- Audit aturan CSS lama, termasuk `premium.css` dan inline styles, sebelum menambahkan aturan baru. Rapikan aturan konflik pada sumbernya. Jangan menumpuk override `!important` tanpa kendali.
- Gunakan komponen bersama dan token terstruktur. Format kode dengan rapi. Jangan memadatkan seluruh komponen atau stylesheet ke satu baris.

## Eksekusi yang diminta

1. Audit halaman, jalur data, komponen dan aset; catat fungsi yang harus dipertahankan. Periksa perubahan pengguna yang sudah ada sebelum mengedit.
2. Buat token warna, tipografi, jarak, radius, material dan elevation. Buat komponen bersama: Container, PageHeader, GlassNav, SoftCard, InsetField, PrimaryButton, FilterBar, EmptyState, DocumentRow dan dialog yang aksesibel jika memang dibutuhkan.
3. Implementasikan beranda terlebih dahulu agar mendekati acuan utama. Hero dua kolom di desktop, satu kolom pada ponsel. Bentuk foto persegi panjang membulat, bukan lengkung dekoratif besar. Navbar kaca tipis. Kartu layanan memakai teks yang kuat tanpa ikon dekoratif. Footer hijau pinus ringkas.
4. Terapkan sistem yang sama ke SELURUH halaman di tabel rancangan. Sesuaikan komposisi dengan tugas halaman; jangan menyalin layout beranda ke semua halaman.
5. Sambungkan semua elemen ke data dan aksi nyata. Tombol harus punya tujuan yang jelas. Filter, pencarian, galeri, unduhan dan form tetap berfungsi. Jika layanan kirim belum tersedia, jangan tampilkan keberhasilan palsu atau menyimpan pertanyaan ke tempat publik baru.
6. Periksa desktop 1440×900, tablet 768×1024, ponsel 360×740 dan 390×844. Perbaiki elemen terpotong, label lemah, kontras, gambar gagal dan interaksi keyboard. Jangan menyembunyikan overflow untuk menutupi penyebab layout terlalu lebar.
7. Jalankan build yang diwajibkan proyek. Pastikan folder pasangan identik untuk file yang diubah. Setelah implementasi lolos pemeriksaan, ikuti aturan commit dan push ke main dalam AGENTS.md. Jangan menyatakan sudah live hanya berdasarkan push; verifikasi deployment bila dapat diakses.
8. Laporkan halaman yang diubah, hasil pemeriksaan, commit/push, dan batasan yang benar-benar tersisa. Sertakan screenshot aktual desktop dan mobile. Jangan menganggap gambar mockup sebagai bukti hasil implementasi.

## Persyaratan kualitas yang wajib terlihat

- Material Soft UI terlihat cukup dalam tetapi tetap ringan: contact shadow dekat, ambient shadow lebar beropasitas rendah, highlight tepi kiri-atas konsisten.
- Liquid Glass difokuskan pada navigasi dan caption media. Jangan memberi blur pada semua kartu dan teks.
- Kartu informasi sedikit terangkat, form dan panel agenda cekung, foto berbingkai inset. Teks tidak perlu efek bevel atau bayangan.
- Ikon hanya untuk fungsi yang membutuhkannya: menu, cari, tutup, arah, media, dokumen. Ikuti ikon Lucide yang sudah dipakai proyek, ukuran dan ketebalan konsisten.
- Navigasi jelas; menu mobile dapat dibuka, ditutup dengan Escape, tidak menjebak pengguna di luar panel, dan mengembalikan fokus.
- Default focus ring tetap terlihat. State aktif tidak hanya bergantung pada bayangan. Hormati prefers-reduced-motion.
- Fallback browser tanpa backdrop-filter tetap terbaca. Tampilan pada layar sentuh tidak bergantung pada hover.
- Tanggal agenda dibandingkan dengan waktu Asia/Jakarta; agenda lewat masuk arsip, jangan disebut mendatang. Hormati field urutan editorial yang sudah ada.
- Kualitas dinilai dari kedekatan material dan komposisi dengan gambar, keterbacaan, responsivitas, dan semua alur yang berfungsi.

Kerjakan implementasi secara menyeluruh setelah prompt ini dijalankan. Gunakan gambar dan spesifikasi sebagai kontrak desain, dengan data/aset asli sebagai sumber isi.
