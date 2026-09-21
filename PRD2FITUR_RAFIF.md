

---

# PRODUCT REQUIREMENTS DOCUMENT (PRD)
## Project: ROKABA Digital Ecosystem (Public Web & CMS Terpadu)

### 1. Product Overview, Vision & Target Users
*   **Vision**: Menjadikan platform ROKABA sebagai pusat literasi Islam moderat dan pusat administrasi digital ROHIS se-Banyumas yang mandiri, aman, dan responsif.
*   **Target Users**:
    *   **Publik/Pelajar**: Mencari info, bertanya ke asatidz, mengunduh materi.
    *   **Editor Sekolah**: Mengelola data spesifik pangkalan ROHIS masing-masing.
    *   **Super Admin (Pengurus Harian)**: Memegang kendali penuh seluruh konten dan hak akses.

### 2. Core User Stories
*   **Sebagai Pelajar**, saya ingin bertanya secara anonim agar merasa nyaman berkonsultasi mengenai masalah agama/pribadi.
*   **Sebagai Peserta Kegiatan**, saya ingin melakukan presensi via QR Code agar proses pendataan cepat dan paperless.
*   **Sebagai Editor Sekolah**, saya ingin memperbarui info ROHIS sekolah saya tanpa mengganggu data sekolah lain.
*   **Sebagai Super Admin**, saya ingin mempublikasikan materi dakwah (PDF) agar bisa diakses oleh seluruh anggota.

### 3. Technical Architecture & Tech Stack
*   **Frontend**: React 19, Vite (Dual-App: `./` for Public, `./admin` for Back-Office).
*   **Styling**: Vanilla Modern CSS (Islamic Editorial Aesthetic).
*   **State & Database**: Upstash Redis (REST API) + React DataContext.
*   **Authentication**: Multi-role Auth (Super Admin & School Editor) dengan PIN & Session Management.
*   **Storage**: Link integrasi (Google Drive/Cloudinary) untuk file E-Library.

### 4. Functional Requirements
*   **[New] Sistem Q&A**: Form input (Public), List pertanyaan & Editor jawaban (Admin), Display Q&A terpilih (Public).
*   **[New] Presensi QR**: Generator QR Code per-event (Admin), Scanner/Form Input (Public), Laporan kehadiran (Admin).
*   **[New] E-Library**: Upload metadata file (judul, kategori, link) di CMS, Grid download di Public.
*   **[New] Role Access Control**: Login khusus Editor Sekolah yang membatasi akses CRUD hanya pada modul `Schools` milik pangkalan mereka.

### 5. Database Schema & Data Models
Struktur JSON yang akan disimpan di Upstash Redis:

```json
{
  "questions": [
    { "id": "uuid", "sender": "string", "query": "string", "answer": "string", "isPublic": boolean, "status": "pending|answered" }
  ],
  "attendance": [
    { "eventId": "string", "participantName": "string", "school": "string", "timestamp": "ISO-Date" }
  ],
  "library": [
    { "id": "uuid", "title": "string", "category": "string", "fileUrl": "string", "type": "pdf|slide|doc" }
  ],
  "users": [
    { "id": "uuid", "username": "string", "role": "superadmin|editor_sekolah", "schoolId": "string|null" }
  ]
}
```

### 6. API Contracts (Upstash REST Interaction)
*   `GET /get/questions`: Mengambil semua data tanya jawab.
*   `POST /set/questions`: Mengirim pertanyaan baru atau menyimpan jawaban.
*   `GET /get/library`: Mengambil daftar materi dakwah.
*   `POST /set/attendance`: Mencatat data presensi dari scan QR.

### 7. UI/UX Component Hierarchy
*   **Public Site**:
    *   `Home`, `About`, `Programs`, `Articles`, `Gallery`, `Events`, `Schools`.
    *   **New**: `ConsultationPage` (Q&A), `LibraryPage` (E-Library), `ScanPresence` (Route khusus scanner).
*   **Admin CMS**:
    *   `DashboardOverview`, `ContentManager`, `UserManager` (Role setting).
    *   **New**: `QAModeration`, `LibraryManager`, `AttendanceReport`.

### 8. Security & Edge Cases
*   **Role Validation**: Setiap fungsi `save` di CMS wajib mengecek `role` user yang tersimpan di context.
*   **QR Security**: QR Code presensi hanya valid jika di-scan pada rentang waktu jam kegiatan.
*   **Moderation**: Pertanyaan anonim tidak akan tampil di web publik sebelum statusnya diubah menjadi `answered` dan `isPublic: true` oleh Admin.

### 9. Acceptance Criteria
*   User bisa mengunduh file dari E-Library tanpa login.
*   Editor Sekolah tidak bisa menghapus artikel yang dibuat Super Admin.
*   Data presensi tersimpan secara real-time di Upstash Redis.
*   Tampilan konsisten menggunakan palet warna *Deep Pine* dan *Emerald 3D Glass*.

---

### 10. 🚀 Master Prompt PRD (Siap Copy untuk AI Coding)

Silakan salin seluruh teks di dalam blok kode di bawah ini ke **Cursor, Claude, atau v0** untuk mulai membangun aplikasinya.

```markdown
# PROMPT: BUILD ROKABA DIGITAL ECOSYSTEM (REACT 19 + UPSTASH)

Act as a Senior Full-Stack Developer. Build a Dual-App Workspace for "ROHIS Kabupaten Banyumas (ROKABA)" based on the following specifications:

1. ARCHITECTURE:
- Two Vite projects: Main Web (Public) and Admin Panel (Back-Office).
- Shared State: Use React DataContext.
- Database: Upstash Redis via REST API (cloudSync.js).
- Styling: Modern Vanilla CSS with Islamic Editorial Aesthetic (Deep Pine, Warm Alabaster, Antique Brass, Emerald 3D Glass).

2. CORE FEATURES TO IMPLEMENT:
- Website Publik: Home, About, Programs, Articles, Gallery, Events, Schools.
- [NEW] Consultation/Q&A: Public can ask questions (anonymous option).
- [NEW] E-Library: Grid of downloadable PDF/Materials.
- [NEW] QR Presence: Public route to scan/input attendance for events.
- CMS Admin: Dashboard to manage all content above.
- [NEW] Multi-Role Auth: Login for 'Super Admin' (full access) and 'Editor Sekolah' (can only edit their specific school data).

3. DATA FLOW:
- Admin updates data -> Push to Upstash Redis -> LocalStorage Mirroring for fallback.
- Public site fetches from Upstash on load.
- Ensure React 19 best practices (useTransition, optimized rendering).

4. UI REQUIREMENTS:
- Public: Elegant, documentary style, luxury Islamic feel.
- Admin: Productive Dark Bento Glass dashboard.
- Mobile first and responsive.

5. RESTRICTION:
- Do not use heavy UI libraries like Material UI. Use Vanilla CSS or simple Tailwind.
- Ensure all logic for Upstash REST API is centralized in a service file.

Please start by setting up the project structure and the DataContext for synchronization.
```

---