
---

# 📄 Product Requirements Document (PRD): ROKABA Integrated Digital System

## 1. Product Overview, Vision & Target Users
*   **Entity:** Rohis Kabupaten Banyumas (ROKABA).
*   **Vision:** Platform sentralisasi informasi, literasi dakwah moderat, dan manajemen administrasi kader ROHIS se-Banyumas.
*   **Identity:** Modern Islamic Editorial (Deep Pine, Warm Alabaster, Antique Brass, Emerald 3D Glass).
*   **Target Users:** Publik (Pelajar/Umum), Pengurus Harian ROKABA (Super Admin), dan Pengurus ROHIS Sekolah (Editor Sekolah).

## 2. Core User Stories & Personas
*   **Sebagai Admin Media ROKABA,** saya ingin mengelola artikel, agenda, dan struktur organisasi melalui satu dashboard (CMS) tanpa menyentuh kode.
*   **Sebagai Kader ROHIS Sekolah,** saya ingin mendaftar ke pangkalan data pusat dan mendapatkan E-KTA otomatis untuk validasi keanggotaan.
*   **Sebagai Pelajar Umum,** saya ingin mengakses jadwal kegiatan (Agenda) dan membaca artikel literasi Islam rahmatan lil alamin secara instan.

## 3. Technical Architecture & Recommended Tech Stack
*   **Architecture:** Dual-App Workspace (Isolasi total antara Public Front-end dan Admin Back-office).
*   **Frontend:** React 19 + Vite (Modern, Lightweight).
*   **Styling:** Vanilla Modern CSS (Custom properties/Variables) sesuai dokumen arsitektur.
*   **Database/Backend:** Upstash Redis Cloud (REST API) untuk sinkronisasi real-time.
*   **State Management:** React DataContext (untuk sinkronisasi Cloud & LocalStorage).
*   **Deployment:** Vercel (Public App di Root, Admin App di Sub-directory/domain).

## 4. Functional Requirements
1.  **Dual-App Sync:** Admin CMS menyunting data di Upstash, Public App mengonsumsi data tersebut secara real-time.
2.  **Modular Content:** Manajemen Artikel, Agenda (dengan status registrasi), Galeri (Google Drive ID support), dan Direktori Sekolah.
3.  **Kaderisasi Digital:** Pendaftaran kader dan otomatisasi E-KTA (mengintegrasikan fitur dari diskusi sebelumnya).
4.  **Interaction Module:** Sistem Q&A (Anonim/Publik) dan Forum Diskusi Sekolah.
5.  **Resilient Fallback:** Mekanisme data dari LocalStorage atau file `.js` statis jika koneksi Upstash terganggu.

## 5. Database Schema (JSON Data Model for Upstash)
Karena menggunakan Upstash (Redis), data disimpan dalam format Key-Value (JSON String).

```json
{
  "rokaba:home": { "hero_title": "...", "welcome_msg": "...", "stats": { "kader": 1200, "schools": 45 } },
  "rokaba:articles": [
    { "id": "uuid", "title": "...", "content": "...", "category": "Dakwah", "image": "url" }
  ],
  "rokaba:events": [
    { "id": "uuid", "title": "...", "date": "...", "location": "...", "status": "active" }
  ],
  "rokaba:schools": [
    { "id": "uuid", "name": "SMA N 1 Purwokerto", "pembina": "...", "contact": "..." }
  ],
  "rokaba:audit_logs": [
    { "timestamp": "...", "admin": "...", "action": "Update Article" }
  ]
}
```

## 6. API Contracts (CloudSync Logic)
*   `GET /get/rokaba:key`: Mengambil data dari Upstash via REST API.
*   `SET /set/rokaba:key`: Menyimpan payload JSON yang telah divalidasi dari CMS.
*   `Fallback Logic`: `if (fetch_fail) use (localStorage.getItem(key)) else use (static_data_fallback)`.

## 7. UI/UX Component Hierarchy
*   **Public App:**
    *   `HeroSection`: Visual Islamic Luxury.
    *   `SchoolDirectory`: Grid pangkalan ROHIS se-Banyumas.
    *   `ArticleReader`: Typography-focused editorial layout.
*   **Admin App (Bento Glass Dashboard):**
    *   `ContentTabs`: Navigasi antar modul (Articles, Events, Schools, etc).
    *   `LivePreview`: Editor sisi kiri, preview sisi kanan.

## 8. Security & Edge Cases
*   **Admin Auth:** Proteksi PIN dan Kredensial (Username: `rohis banyumas`, Pass: `rbk banyumas`).
*   **Data Integrity:** Validasi tipe data sebelum `set` ke Upstash untuk mencegah *breaking changes* di sisi publik.

## 9. Acceptance Criteria
*   Perubahan di CMS muncul di Website Publik dalam < 2 detik (Real-time).
*   Website tetap menampilkan konten meskipun dalam kondisi offline (Fallback system works).
*   Desain responsif di mobile (pelajar) dan desktop (admin).

---

## 10. 🚀 Master Prompt PRD (Siap Copy untuk AI Coding)
Salin seluruh blok di bawah ini ke dalam **Cursor, Claude, atau v0**:

```markdown
# PROMPT: ROKABA INTEGRATED SYSTEM (REACT 19 + UPSTASH REDIS)

Role: Lead System Architect & Senior React Developer.
Project: Website Resmi & CMS Terpadu ROHIS Kabupaten Banyumas (ROKABA).

### 1. ARCHITECTURE: DUAL-APP WORKSPACE
- App 1: Website Publik (Root directory `./`) - Read-only access to data.
- App 2: Admin CMS (Directory `./admin`) - Read/Write access, protected by login.
- Communication: Both apps sync via Upstash Redis Cloud REST API.
- Fallback: Implement a "Resilient Fallback" system (Cloud -> LocalStorage -> Static .js files).

### 2. TECH STACK
- Framework: React 19 (Vite)
- Database: Upstash Redis (REST API)
- Styling: Vanilla Modern CSS (CSS Variables for "Modern Islamic Editorial" palette: Deep Pine #0D2B22, Warm Alabaster #F5F2ED, Antique Brass #B58D4F, Emerald Glass).
- Icons: Lucide React.

### 3. CORE MODULES TO BUILD
1. **CMS Dashboard (Admin):** Single-pane management with tabs for:
   - Home Editor (Hero text, stats, leader profile).
   - Article Management (Full CRUD).
   - Event/Agenda Calendar (Add/Edit dates, locations).
   - School Directory (Database of SMA/SMK/MA in Banyumas).
   - Gallery & Media (Google Drive ID integration).
   - Audit Logs & Backup/Restore (.json export).
2. **Public Website:**
   - Editorial Homepage with Islamic Luxury aesthetic.
   - Dynamic pages: About, Programs, Articles, Gallery, Events, Schools, Contact.
   - Integration with Upstash to display real-time updates from CMS.

### 4. TECHNICAL SPECIFICATIONS
- Use `DataContext.jsx` to manage global state and cloud synchronization.
- Implement `cloudSync.js` for Upstash REST API calls.
- Admin Authentication: Credentials ('rohis banyumas' / 'rbk banyumas') with PIN protection.
- Visual Style: Productive Dark Bento Glass for Admin, Editorial Documentary for Public.

### 5. INITIAL TASK
1. Set up the dual-app folder structure (React 19 + Vite).
2. Create the `DataContext` and `cloudSync` logic to connect with Upstash.
3. Build the basic layout for the Public Website (Navbar, Hero, Footer) using the provided color palette.
4. Build the Login page for the Admin CMS.

Follow the sistematika provided in the PRD to ensure data consistency across both apps.
```

---