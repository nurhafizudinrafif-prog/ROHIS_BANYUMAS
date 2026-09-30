---
name: auto-deploy-git
description: Aturan mutlak untuk selalu melakukan git commit dan git push ke origin main setiap kali selesai membuat perubahan kode apapun di proyek ROHIS Banyumas.
---

# Aturan Mutlak Git Commit & Auto-Push

1. **Auto Push Setelah Perubahan**:
   - Setiap kali asisten menyelesaikan modifikasi kode, penambahan fitur, atau perbaikan tampilan pada repositori ini:
   - Asisten WAJIB secara otomatis menjalankan:
     ```powershell
     git add -A; git commit -m "<deskripsi perubahan>"; git push origin main
     ```
   - Alasan: User selalu menguji dan memverifikasi aplikasi langsung melalui tautan live Vercel (`https://rohis-banyumasadminid.vercel.app/` dan website publik). Jika perubahan tidak di-push ke GitHub, Vercel tidak akan mengupdate build terbaru dan tampilan user akan tetap lama.

2. **Sinkronisasi Ganda**:
   - Jika mengubah file di `admin/`, selalu ubah juga padanannya di `admin-app/`.
   - Jika mengubah file di `public-app/`, selalu cek padanannya di `src/`.

3. **Verifikasi Build**:
   - Selalu jalankan `npm --prefix admin run build` sebelum push untuk memastikan tidak ada error kompilasi.
