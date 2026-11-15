# Prompt implementasi ROKABA v3

Terapkan arah visual dari 15 gambar pada folder ini ke website publik ROKABA. Awali dengan membaca README.md, kode saat ini, instruksi proyek, dan data CMS. Jangan mengubah konten, backend, rute, autentikasi, atau sumber data hanya untuk meniru gambar.

Gunakan Liquid Glass untuk navigasi, filter, kontrol dan caption foto; kartu ivory neumorphism untuk konten; pine untuk CTA. Tingkatkan kedalaman lewat highlight dan shadow berlapis. Efek lensa membesarkan dan membiaskan latar dengan blur terkontrol; teks dan ikon selalu tajam. Jangan gunakan seluruh halaman sebagai gambar. Implementasikan komponen responsif nyata.

Pertahankan carousel berita/agenda tiga kartu di PC; kartu tengah utama dan dua sisi mundur. Pada HP tampilkan satu kartu aktif dengan sedikit sisi kartu tetangga, swipe dan kontrol di bawah. Tidak ada perpindahan otomatis yang mengganggu pembaca. Isi dan foto berasal dari CMS. Jaga judul samping tidak tertutup kartu tengah.

Untuk beranda, tetap tampilkan seluruh bagian yang sudah ada: hero/statistik, sambutan, layanan, tentang organisasi, berita, agenda, penutup dan footer. Papan referensi merupakan studi bagian, sehingga footer pada setiap papan bukan perintah untuk memotong halaman asli.

Sambutan: tiga selector Ketua Umum, Ketua Akhwat, Ketua Ikhwan diletakkan setelah seluruh sambutan termasuk salam penutup. Foto/nama sesuai CMS. Tidak mengarang wajah. Direktori pengurus memakai filter divisi dan pencarian nama/jabatan/sekolah, 4 kolom desktop, menyesuaikan hingga1kolom HP.

Pertahankan rute /, /about, /programs, /berita, /berita/:slug, /articles, /articles/:slug, /events, /schools, /gallery, /contact, /consultation dan alias yang sudah ada. Gambar daftar/detail artikel dan kontak/konsultasi menunjukkan halaman terpisah dalam satu papan, bukan wajib digabung sebagai satu halaman.

Selalu gunakan aset foto/logo asli dalam sources atau aset CMS asli. Jangan potong foto/wajah/logo dari gambar generatif. Jika ada perbedaan data pada mockup, CMS dan README.md menjadi acuan. Jangan menambahkan profil anggota, tautan sosial, kategori, ataupun fitur yang belum tersedia tanpa implementasi yang nyata.

Ikuti struktur repositori dan sinkronkan public-app/src dengan src untuk file publik terkait. Uji desktop1440/1024, tablet768, HP390/360; cek overflow, navigasi, filter, carousel, dialog, fokus dan reduced-motion. Build setelah perubahan kode. Cakupan implementasi/deployment harus mengikuti instruksi pengguna paling baru; paket referensi ini sendiri bukan izin deploy.

