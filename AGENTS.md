# Antigravity Rules & Workflow Memory - ROHIS Banyumas

## 1. ATURAN MUTLAK DEPLOYMENT & GIT PUSH (WAJIB DIINGAT SELALU)
- **Setiap kali selesai melakukan perubahan kode (fitur baru, perbaikan bug, penyesuaian UI/styling, atau teks)**:
  - WAJIB **langsung lakukan build test** (`npm --prefix admin run build` atau `npm run build`) untuk memastikan tidak ada error syntax.
  - WAJIB **langsung lakukan git commit dan git push ke branch `main`**:
    ```powershell
    git add -A; git commit -m "<deskripsi perubahan>"; git push origin main
    ```
  - **DILARANG** mengakhiri jawaban dan memberi tahu user "sudah selesai" jika perubahan belum di-push ke GitHub, karena user selalu memeriksa hasil langsung pada live URL Vercel (`https://rohis-banyumasadminid.vercel.app/` dan website publik).

## 2. ATURAN SINKRONISASI FOLDER (DUAL-FOLDER SYNC)
- **Panel Admin CMS**: Terdapat folder `admin` dan `admin-app`. Setiap perubahan file halaman, komponen, atau CSS admin HARUS selalu diaplikasikan ke KEDUA folder tersebut secara identik.
- **Website Publik**: Terdapat folder `public-app` dan `src`. Pastikan komponen dan data sinkron.
- **Port Dev Lokal**: Panel admin menggunakan port `5174` (`host: true`), website publik menggunakan port `5173`.

## 3. STANDAR DESAIN MODAL & CMS (ANTI-POTONG & LEGA)
- Modal dialog CMS harus luas dan lega (`maxWidth: 700px` ke atas).
- Wajib memiliki struktur lengkap:
  1. `modal-header-responsive` (sticky header dengan ikon badge dan close button).
  2. `modal-body-responsive` (scrollable body dengan padding lega dan layout 2 kolom responsif untuk field berpasangan).
  3. `modal-footer-responsive` (sticky footer dengan backdrop blur untuk tombol Batal & Simpan agar tidak pernah terpotong di resolusi layar berapa pun).
- Terapkan palet warna resmi Modern Islamic: kanvas Deep Pine (`#07140E`, `#0D2319`), aksen Antique Brass (`#C8A85B`, `#DFBF73`), dan teks Warm Alabaster (`#F7F5F0`).

## 4. PRINSIP KOMUNIKASI & EKSPLORASI IDE KREATIF (MINDSET UTAMA)
- **Tanya Dulu Jika Belum Paham**: Jangan pernah sok tahu atau berasumsi sendiri jika ada maksud user atau spesifikasi yang belum jelas/ambigu. Langsung tanyakan ke user untuk menyamakan persepsi.
- **Proaktif & Eksplorasi Ide Liar**: Bebas kembangkan dan ajukan ide-ide kreatif seliar mungkin yang dapat mengangkat kualitas website ROHIS Banyumas (baik dari segi estetika visual kelas dunia, animasi interaktif, fitur dakwah modern, gamifikasi pelajar, audio/suasana islami yang tenang, dsb.). Ide yang berani dan visioner sangat diapresiasi!
