# ROHIS Kabupaten Banyumas — Official Repository

Repositori ini memuat 2 aplikasi web terpisah yang saling terhubung secara real-time:
1. **Website Publik** (`./`) — Website resmi untuk umum & pelajar (Beranda, Profil, Program, Artikel, Galeri, Agenda, ROHIS Sekolah, Kontak).
2. **`admin/`** — Panel CMS khusus Pengurus ROKABA (Manajemen Artikel, Jadwal Agenda, Foto Galeri, Data Sekolah, Struktur Kepengurusan, Akun Admin).

Kedua web saling terhubung secara *real-time* di seluruh dunia melalui **Upstash Redis Cloud Database**.

---

## 💻 Menjalankan Secara Lokal (Windows)

- **Website Publik:** Klik ganda `JALANKAN_WEB.bat` (berjalan di `http://localhost:5173`).
- **Panel Admin:** Klik ganda `JALANKAN_ADMIN.bat` (berjalan di `http://localhost:5174`).
- **Kredensial Login Admin:**
  - Username: `admin`
  - Password: `rohisbanyumas2026`

---

## ☁️ Panduan Deploy ke Vercel (2 Web Terpisah)

### 1. Website Publik (Public Web)
- Buka Vercel Dashboard, pilih project `rohis-banyumas` yang sudah ada (atau Add New Project -> pilih repo ini).
- **Root Directory:** `./` (default)
- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Domain:** misal `https://rohis-banyumas.vercel.app`

### 2. Panel Admin (Admin CMS)
- Di Vercel Dashboard, klik tombol **Add New... > Project**.
- Pilih repositori yang sama: `ROHIS_BANYUMAS`.
- Pada bagian **Root Directory**, klik **Edit** dan pilih folder **`admin`**.
- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- Klik **Deploy**.
- Vercel akan menghasilkan domain terpisah khusus admin (misal: `https://rohis-banyumas-admin.vercel.app`).
