# Prompt implementasi untuk Antigravity IDE

Kerjakan redesain menyeluruh website publik dan panel admin ROKABA pada proyek ini berdasarkan
paket ROKABA Approved Complete. Baca RANCANGAN-LENGKAP.md dan seluruh 15 papan PNG terlebih dahulu.

## Acuan dan batas keputusan

Acuan desain tertinggi adalah tiga gambar di folder references yang dipilih pengguna.
Ikuti Soft UI/Neumorphism dengan Liquid Glass lembut, warna alabaster/sage, pine gelap dan aksen brass,
kartu timbul, field cekung, tombol dimensional, ikon garis bersih, dan Plus Jakarta Sans.
Jangan menggunakan versi kaca chrome berlebihan dari putaran desain lain.
Papan bernomor menerapkan gaya tersebut pada tiap halaman; jika ada inkonsistensi kecil,
kembalikan ke tiga gambar pilihan dan aturan dalam dokumen.

Ini pekerjaan perombakan tampilan serta susunan yang diperlukan. Pertahankan data, rute,
auth, pembatasan peran, penyimpanan, dan fungsi yang sudah bekerja.
Jangan mengarang fitur atau mengubah schema hanya karena suatu kontrol muncul di gambar.
Isi contoh/angka/nama/tanggal/kutipan pada mockup bukan sumber kebenaran.

## Mulai dari audit yang terarah

1. Baca AGENTS.md dan instruksi proyek yang berlaku.
2. Catat keadaan git dan perubahan milik pengguna; jangan overwrite pekerjaan yang tidak terkait.
3. Baca public-app/src/App.jsx, admin/src/App.jsx, sumber data bersama, komponen/layout/CSS,
   halaman publik dan manager admin. Pastikan folder pasangan dan file entry aktual.
4. Cocokkan 12 halaman publik, login, 12 menu admin, dan delapan bagian editor beranda dengan dokumen.
   E-Library tetap nonaktif/redirect sesuai aplikasi.
5. Inventaris fungsi/field aktual sebelum mengubah UI. Pisahkan usulan tambahan dari styling wajib.

## Implementasi visual

Bangun token dan komponen bersama yang konsisten: kanvas, surface, typography, space, radius,
shadow, focus, glass, raised button, inset field, table, empty/loading/error states, modal.
Jangan menambahkan lapisan override CSS saling menimpa; rapikan sumber styling yang relevan.
Typography tetap tajam, tanpa text-shadow 3D. Kartu dan teks panjang cukup opak.

Liquid Glass hanya pada nav, selected control, caption foto dan sticky action bar.
Blur tidak sama dengan pembesaran/pembiasan. Pilih pendekatan render yang sesuai browser untuk
efek lensa ringan; teks dan ikon harus berada di lapisan tajam. Jangan menduplikasi DOM berisi
konten sebagai hack kaca yang merusak fokus/aksesibilitas. Jangan mengubah scale seluruh page.
Jika metode efek nyata belum layak, gunakan fallback blur yang konsisten dan jelaskan batasnya,
bukan mengklaim pembiasan fisik sudah berfungsi. Utamakan keterbacaan dan kinerja HP.
Respect reduced-motion dan fallback ketika backdrop-filter tidak tersedia.

## Publik: cakupan wajib

- /: navbar, hero/foto, statistik aktual, sambutan, layanan, tentang singkat, berita/agenda, penutup dan footer.
- /about: profil, visi/misi/sejarah/struktur sesuai konten yang ada.
- /programs: divisi dan program.
- /berita dan /berita/:slug: daftar dan detail berita.
- /articles dan /articles/:slug: daftar dan detail artikel.
- /events: agenda.
- /schools: direktori sekolah.
- /gallery: galeri dan pembuka media.
- /contact dan /consultation: formulir dan konten sesuai kemampuan backend.
- Pertahankan alias URL yang saat ini berfungsi.

Sambutan memiliki tiga peran: Ketua Umum, Ketua Akhwat, Ketua Ikhwan.
Urutan pada desktop maupun HP: salam pembuka → isi → salam penutup → tiga pemilih foto → tombol berikutnya.
Jangan pindahkan foto ke atas teks dan jangan menambah lagi helper text yang pernah diminta dihapus.
Nama/foto harus mengikuti sumber CMS yang sah. File portraits dalam paket merupakan aset proyek,
bukan konfirmasi pejabat saat ini. Bila belum ada, gunakan placeholder netral.
Tinjau ketidaksesuaian teks SMAN 4 vs organisasi kabupaten sebagai catatan editorial terpisah.

Gunakan foto asli dari URL data website dan logo asli. Paket menyertakan dua foto untuk referensi.
Jangan crop foto dari gambar mockup; jangan mengganti orang atau membuat foto baru dengan AI.
Kontak dan konsultasi yang masih hanya localStorage tidak boleh mengklaim kiriman sampai ke admin.
Jangan diam-diam menambah endpoint atau alur sukses palsu.

## Admin: cakupan wajib

- Login sesuai username/password/PIN yang benar-benar digunakan.
- Ringkasan dari data tersedia, tanpa analitik fiktif.
- Kelola Beranda: Hero, Sambutan, Tentang kami, Divisi & program, Linimasa, Statistik,
  Ajakan bergabung, Judul bagian.
- Berita, Artikel, Agenda, Galeri.
- Sekolah, Pengurus, Moderasi Q&A.
- Pengguna, Audit log, Pengaturan dan backup/restore.

Desktop: sidebar 220–236 px, breadcrumb ringkas, judul dan action jelas.
Editor: pemilih bagian vertikal, form dan pratinjau jika memang diimplementasikan.
Pratinjau adalah usulan fitur jika belum tersedia; jangan mengorbankan pekerjaan styling untuk
membangun fitur tambahan tanpa menandainya. Pada layar sempit pratinjau menjadi panel lipat.
Tabel desktop berubah daftar/kartu pada HP. Tombol Edit/Hapus punya label aksesibel.
Hak akses Editor sekolah dan admin harus tetap sama.

Modal desktop lebar sasaran >=700 px, dibatasi lebar layar:
modal-header-responsive sticky,
modal-body-responsive scrollable dengan padding dan field berpasangan,
modal-footer-responsive sticky blur dengan Batal/Simpan.
Pada HP modal dapat setinggi layar, tidak terpotong, keyboard dan safe-area terlayani.
Konfirmasi hapus/restore, status pending/save/error, dan dirty state harus mengikuti operasi sebenarnya.
Audit log baca-saja. Jangan menampilkan atau menanam kredensial/secrets ke UI.

## Sinkronisasi dan pemeriksaan

- Semua perubahan admin yang relevan identik pada admin dan admin-app.
- Semua perubahan publik relevan sinkron pada public-app/src dan src, termasuk data/asset terkait.
- Uji alur utama tiap route, buka-tutup menu/dialog, keyboard focus, submit validasi, CRUD yang aman,
  tampilan kosong/error, media gagal, serta hak akses tanpa mengubah data produksi untuk tes.
- Uji 360, 390, 412, 768, 1024, 1280, 1440 px. Tidak ada horizontal overflow atau action terpotong.
- Jalankan build yang diwajibkan AGENTS.md untuk aplikasi yang berubah; jangan mengklaim lolos tanpa hasil.
- Setelah implementasi, ikuti aturan commit dan push main yang diberikan pengguna dalam AGENTS.md.
  Jangan membawa perubahan pengguna yang tidak terkait ke commit tanpa peninjauan.
- Laporkan apa yang berubah, hasil build/pemeriksaan, status sinkronisasi dan push,
  serta batasan efek kaca atau fitur yang memang belum ada.

Laksanakan per bagian dengan dasar komponen yang sama; hasil seluruh situs harus tampak satu sistem,
bukan 15 template berbeda. Jangan mengubah salinan referensi PNG.

