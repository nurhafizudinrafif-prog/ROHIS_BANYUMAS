# Rancangan Admin ROKABA — Soft UI × Liquid Glass

## Status dan cara membaca

Paket ini hanya berisi mockup dan instruksi untuk Antigravity IDE. Pembuatan paket tidak merombak source website. Gambar memakai imagegen bawaan; isi contoh bukan data yang sudah diverifikasi. Skema dan perilaku kode menjadi sumber kebenaran fungsional. Logo/foto implementasi memakai aset asli, bukan potongan logo/foto hasil generasi.

Acuan publik yang disetujui: Soft UI, canvas alabaster, teks pine, liquid glass selektif dan kedalaman 3D terukur. Admin menerapkannya pada pekerjaan mengelola data: field, tabel dan dialog lebih tenang dan lebih rapat daripada halaman publik.

## Daftar gambar

| Berkas | Menu dan bagian |
| --- | --- |
| 01-ringkasan.png | Dashboard utama; acuan shell, navigasi, panel dan kedalaman |
| 02-publikasi.png | Berita Terkini, Artikel Dakwah, Agenda & Kajian, Galeri |
| 03-direktori.png | ROHIS Sekolah, Pengurus ROKABA, E-Library, Moderasi Q&A |
| 04-sistem.png | Login, Manajemen User, Audit Log, Pengaturan & Backup |
| 05-beranda-a.png | Hero, Sambutan & tiga ketua, Tentang kami, Divisi & program |
| 06-beranda-b.png | Linimasa, Statistik, Ajakan bergabung, Judul bagian |
| 07-mobile-modal.png | Editor desktop, konfirmasi hapus, daftar mobile dan editor mobile |

## Sistem visual dan layout

Palet: canvas #F1F2ED, surface #F7F5F0, pine #10291F, deep #07140E, secondary #52635A, brass #A99157. Teks aksen kecil harus diuji kontras; brass bukan default seluruh teks. Error memakai merah tua yang terbaca, sukses hijau dengan label teks, pending amber gelap dengan label. Jangan hanya mengandalkan warna.

Tipografi: Plus Jakarta Sans 400/500/600/700. Judul halaman 26–32px desktop, 24–28px mobile; judul panel 18–20px; body/label 14–16px; metadata 12–13px. Label tidak seluruhnya kapital. Table header sentence case, angka sejajar kanan bila relevan.

Ritme: 4/8/12/16/24/32/48px. Margin main desktop 28–40px, mobile 16–20px. Panel padding desktop 24–32px; baris tabel sekitar 48–60px; tombol/target sentuh minimal44px. Container boleh lebar untuk tabel/editor, jangan memaksakan lebar baca artikel pada data table.

Sidebar desktop220–240px; main min-width:0; topbar kira-kira64–76px. Lapisan: konten dasar, sticky actions, sidebar/topbar, backdrop, dialog, toast. Drawer mobile menggantikan sidebar; menu memiliki fokus dan akses keyboard yang benar.

## Elevation dan material

1. Canvas matte tanpa pola bergerak.
2. Panel terangkat sedikit: satu arah cahaya kiri atas, highlight putih tipis, contact shadow dekat dan ambient shadow rendah. Contoh awal: `5px 5px 14px rgba(25,43,32,.10), -3px -3px 10px rgba(255,255,255,.85)`. Uji render; jangan menambah shadow pada setiap table cell.
3. Input inset: inner shadow tipis + border yang jelas, warna teks dark pine. Focus ring kontras tetap terlihat.
4. Tombol pine bertepi halus, pressed turun1px dan shadow mengecil. Disabled tetap terbaca dan nonaktif secara perilaku.
5. Glass: topbar/sidebar header/caption tertentu saja, permukaan 80–90% opak, blur14–20px, highlight tepi halus. Sediakan fallback opak dan jangan membuat teks/field transparan.
6. Modal header/footer sticky dengan surface cukup opak; body bebas digulir. Konten tabel/form tetap matte.

Tidak memakai neon, bintang dekoratif, polygon wallpaper, glow, kartu marketing besar, chart tanpa data, ikon timbul dekoratif, border putih tebal atau tombol seperti bantal plastik.

## Peta menu dan kontrak interaksi

| Menu | Route/komponen yang perlu diaudit | Susunan yang dirancang | Fungsi yang harus dipertahankan |
| --- | --- | --- | --- |
| Login | /login, Login.jsx | Panel form terpusat dengan logo dan field berlabel | Login/password/PIN yang didukung, error dan state proses; jangan ubah auth |
| Ringkasan | /, Dashboard.jsx | Ringkasan berbasis data nyata, akses cepat, konten/aktivitas relevan | Data role sesuai akun, link ke manager; metrik hanya jika benar-benar tersedia |
| Kelola Beranda | /content/home, ContentManager + AdminHomeCMS | Navigasi subbagian ringkas, editor berkelompok, action simpan terlihat | State isDirty, refresh tidak menimpa input, onSave yang benar, semua field lama |
| Berita Terkini | /content/news | Search/filter, tabel urutan–judul–kategori–aksi | CRUD, slug, order, tanggal, author, lokasi, excerpt, content, foto |
| Artikel Dakwah | /content/articles | Daftar teks, filter bila tersedia, editor luas | CRUD, kategori, author, slug, konten HTML/format lama dan foto |
| Agenda & Kajian | /content/events | Daftar tanggal/judul/lokasi/status, editor | CRUD date/time/location/description/status; jangan menambah status tanpa skema |
| Galeri Foto | /content/gallery, GalleryManager | Grid/list media, thumbnail, kategori, aksi jelas | Foto/video, URL/platform yang didukung, metadata, preview dan error |
| ROHIS Sekolah | /content/schools | Search, jenjang, tabel/daftar dan editor | Nama/jenis/pembina/kontak/alamat/jumlah/editorId sesuai schema; scope sekolah |
| Pengurus ROKABA | /content/team, TeamManager | Filter BPH/divisi, foto/nama/jabatan/sekolah | Struktur team yang dipakai data, foto/IG/periode; jangan ubah key position/role sembarang |
| E-Library | /library, LibraryManager | Daftar dokumen, kategori, lihat/edit | Metadata, link file, preview/unduh yang ada dan CRUD |
| Moderasi Q&A | /qa, QAModeration | Inbox/status dan detail pertanyaan–jawaban | Moderasi dan penyimpanan status asli, hak akses, jangan menampilkan data privat baru |
| Manajemen User | /users, UserManager | Username/peran/sekolah/aksi, editor role | Role superadmin/editor_sekolah, assignment sekolah dan perlindungan akun yang ada |
| Audit Log | /audit, AuditLogs | Filter bila didukung dan riwayat yang mudah dibaca | Catatan asli, waktu dan pengguna asli; tanpa menambah aksi menghapus jejak |
| Pengaturan & Backup | /settings, Settings | Organisasi/kontak/akun/backup terpisah | Save setting, password/PIN tidak bocor, export/restore berformat sama dan validasi |

Route sebagian bersifat dinamis. Cocokkan kembali App.jsx saat implementasi karena kode dapat berubah setelah paket dibuat. Tidak semua tab/filter contoh dalam atlas berarti fitur itu sudah ada; adaptasikan ke fungsi yang didukung atau implementasikan perilakunya secara lengkap tanpa mengubah kontrak data.

## Delapan bagian Kelola Beranda

| Bagian | Isi editor | Catatan penting |
| --- | --- | --- |
| Hero | Tagline, dua baris judul, lead, narasi, dua CTA, URL foto, caption/lokasi/meta | Semua field yang ada tetap tersedia; kelompok konten, tombol dan media |
| Sambutan & tiga ketua | Judul, salam, paragraf, penutup, CTA, periode, foto tiga peran | Ketua Umum, Ketua Akhwat, Ketua Ikhwan; teks saat ini dapat dibagi bersama, foto per peran; jangan mengarang penyimpanan tiga teks terpisah |
| Tentang kami | Judul/lead/paragraf, dua nilai, foto/caption/quote bila ada | Field panjang textarea, berpasangan hanya jika cukup ruang |
| Divisi & program | Daftar program, editor accordion dan media/field sesuai struktur | Simpan program mungkin terpisah dari home; aksi harus menyatakan jangkauannya |
| Linimasa | Item tahun/judul/tag/lokasi/deskripsi, tambah/urut/hapus | Identitas item stabil, data tidak hilang saat pindah bagian |
| Statistik | Nilai/suffix/label dan field tambahan yang sudah ada | Nilai tidak diisi palsu; field numerik valid, jangan mengubah angka saat formatting |
| Ajakan bergabung | Tagline/headline/lead, label dan link dua tombol | Jangan hilangkan CTA kedua atau field kosong opsional |
| Judul bagian | Berita/artikel/agenda/layanan: tag/judul/deskripsi/link label yang tersedia | Accordion bertajuk jelas, tidak berupa tab horizontal panjang terpotong |

Navigasi bagian tidak membuang edit. Lebar judul tab tidak bergantung pada urutan angka dekoratif. Desktop bisa daftar vertikal lokal; mobile dropdown di atas editor. Prioritaskan data/fungsi yang sama dibanding meniru atlas secara literal.

## Pola editor dan modal

Lebar desktop minimal700px sesuai AGENTS.md, editor panjang800–960px. Header berisi judul dan close; body scrollable; footer berisi Batal dan Simpan selalu terlihat. Tetap gunakan kelas `modal-header-responsive`, `modal-body-responsive`, `modal-footer-responsive`. Responsive card menggunakan flex column dan min-height:0 di rantai body/form; max-height mengikuti100dvh dengan fallback100vh. Jangan menyamakan tinggi dialog dengan tinggi seluruh dokumen.

Tampilan mobile390×844 dan360×740: dialog hampir memenuhi layar dengan margin aman, field satu kolom dan footer safe-area. Uji viewport pendek dan keyboard; jangan mengandalkan body scroll halaman di belakang modal. Fokus masuk ke dialog, terperangkap secara wajar, Escape menutup sesuai state, kembali ke pemicu. Jika ada edit yang belum disimpan, gunakan konfirmasi kehilangan perubahan yang benar.

Daftar mobile berubah menjadi kartu metadata dan aksi yang jelas, bukan tabel kecil yang tidak dapat dibaca. Tabel yang memang butuh perbandingan kolom boleh horizontal-scroll lokal dengan petunjuk, tidak mendorong seluruh halaman.

Konfirmasi hapus menyebut item dan konsekuensi sebenarnya. Jangan memakai kalimat 'dapat dipulihkan' tanpa fitur recovery. Restore backup adalah aksi terpisah dari simpan setting, perlu tinjauan dampak sebelum penggantian data. Rancangan tidak memberikan izin untuk melakukan aksi tersebut terhadap data produksi.

## State yang wajib dirancang

Loading awal, kosong, pencarian tanpa hasil, error muat/retry, sinkronisasi offline/berjalan/gagal, form dirty, saving, sukses berdasarkan hasil API, validasi inline, tidak berhak akses, media gagal, submit ganda dicegah. State sukses tidak menghapus input jika operasi lain gagal. Refresh data tidak boleh mengganti input yang sedang diedit.

Hak akses harus bekerja pada aksi/handler, bukan sekadar tampilan. Jangan mengubah token, kredensial, role, API atau backup dalam tugas desain UI. Grafik atau badge jumlah hanya muncul bila berasal dari data aktual.

## Pemeriksaan penerimaan

- Desktop1440×900: semua menu terbaca; main tidak melebar keluar; tabel dan label sejajar.
- Tablet768×1024: navigasi ringkas/drawer, editor tidak sempit, media preview tidak mendorong form.
- Mobile360×740 dan390×844: drawer, list-card, search/filter, form satu kolom dan target44px bekerja.
- Viewport pendek1024×600: tombol modal Batal/Simpan dan close tetap dapat dijangkau; body modal yang digulir.
- Beranda: edit tiap8bagian, berpindah bagian, simpan home/program sesuai scope, error simpan tidak kehilangan input.
- CRUD berita/artikel/agenda/sekolah/dokumen/pengurus/galeri: tambah/edit/batal, media gagal, field panjang, validasi dan empty state.
- Role: superadmin dan editor_sekolah sesuai assignment dan aturan yang ada. Jangan mencoba bypass akses.
- Q&A: jawab/moderasi sesuai status nyata; users: assignment sekolah; settings: save, backup format kompatibel dan restore hanya dengan data uji aman.
- Keyboard/focus/reduced-motion/kontras: teks normal4.5:1, besar3:1, batas kontrol dan focus indicator terlihat.
- Tidak ada error render baru; build admin sukses; file pasangan sinkron; ikuti aturan Git/push pada AGENTS.md ketika implementasi dilakukan.

Dokumentasikan hasil nyata. Jangan menyebut panel sudah terhubung atau data sudah tersimpan berdasarkan mockup. Screenshot hasil implementasi harus dibuat dari kode yang berjalan.
