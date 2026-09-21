# 📄 Product Requirements Document (PRD)
**Proyek:** ROHIS Banyumas Digital Ecosystem (Website & CMS Terpadu)  
**Versi:** 2.0 (Next.js SSR Edition)  
**Arsitektur:** Monorepo / Shared Architecture with Serverless Proxy  

## 1. Product Overview, Vision & Target Users
Membangun platform digital terintegrasi untuk Forum Komunikasi Rohis Kabupaten Banyumas (ROKABA) sebagai pusat syiar, informasi, dan manajemen organisasi.
*   **Visi:** Menjadi portal dakwah pelajar paling modern dan kredibel di Kabupaten Banyumas.
*   **Target User:** Pelajar SMA/SMK/MA (Pembaca), Pembina Rohis, dan Pengurus ROKABA (Admin Content).

## 2. Core User Stories
*   **Pengunjung:** "Saya ingin membaca artikel dakwah dan melihat jadwal agenda ROHIS dengan cepat dan mudah ditemukan lewat Google (SEO)."
*   **Admin:** "Saya ingin mengelola konten website melalui dashboard yang aman tanpa perlu menyentuh kode, dan perubahan langsung muncul di web publik."
*   **Sistem:** "Mengamankan kredensial database di sisi server dan menyajikan halaman berita secara pre-rendered (SSR) untuk performa maksimal."

## 3. Technical Architecture & Tech Stack
*   **Framework:** Next.js 15+ (App Router) - *Menggantikan Vite untuk mendukung SSR & API Routes.*
*   **Styling:** Tailwind CSS (Modern & Utility-first) dengan **Shared Component Library**.
*   **Database:** Upstash Redis (Cloud) via Serverless Proxy.
*   **Authentication:** NextAuth.js atau Middleware berbasis JWT (PIN & Credential).
*   **Deployment:** Vercel (Automatic SSR & Edge Functions).

## 4. Functional Requirements
*   **Public Portal:** SSR untuk halaman Artikel, Agenda, dan Sekolah (SEO Optimized).
*   **CMS Admin:** Protected Route `/admin`, CRUD Dashboard untuk seluruh data.
*   **Security:** API Keys Upstash HANYA ada di `.env` server, tidak terekspos di browser.
*   **Shared UI:** Folder `src/components/shared` yang berisi Button, Card, dan Typography yang dipakai bersama oleh Public & Admin.

## 5. Database Schema (JSON Structure in Redis)
Data disimpan dalam bentuk Key-Value JSON. Contoh skema:

```json
// Key: "rohis:articles"
[
  {
    "id": "uuid-1",
    "title": "Membangun Karakter Pelajar Muslim",
    "slug": "membangun-karakter-pelajar-muslim",
    "content": "HTML/Markdown content",
    "author": "Humas ROKABA",
    "category": "Edukasi",
    "publishedAt": "2026-09-20T10:00:00Z"
  }
]

// Key: "rohis:events"
[
  {
    "id": "uuid-2",
    "title": "Latihan Kepemimpinan Islam (LKI)",
    "date": "2026-10-15",
    "location": "Masjid Agung Purwokerto",
    "status": "Akan Datang"
  }
]
```

## 6. API Contracts (Serverless Proxy)
Seluruh request dari client akan melalui endpoint Next.js:

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/api/content?type=articles` | Fetch data untuk web publik | No |
| POST | `/api/admin/update` | Update data Redis dari CMS | Yes (Admin) |
| POST | `/api/admin/auth` | Verifikasi Login Admin | No |

## 7. UI/UX Component Hierarchy
*   **Shared:** `Layout`, `Navbar`, `Footer`, `BrandLogo`, `ButtonCustom`.
*   **Public:** `HeroBanner`, `ArticleGrid`, `EventCalendar`, `SchoolDirectory`.
*   **Admin:** `SidebarNav`, `DataTable`, `EditorForm`, `StatCard`.

## 8. Security & Edge Cases
*   **Rate Limiting:** Mencegah spam pada API admin.
*   **Fallback Data:** Jika Upstash limit/down, sistem menggunakan `local-cache.json` agar web tetap nyala.
*   **Input Sanitization:** Membersihkan input HTML pada editor artikel untuk mencegah XSS.

---

## 9. 🚀 Master Prompt PRD (Siap Copy untuk AI Coding)

Salin seluruh teks di dalam blok kode di bawah ini ke **Cursor, Claude, Windsurf, atau v0** untuk mulai membangun:

```markdown
# PROMPT: BUILD ROHIS BANYUMAS ECOSYSTEM (NEXT.JS 15 SSR)

I want to build a comprehensive web application for "ROHIS Kabupaten Banyumas" (ROKABA). 
This project uses Next.js 15 (App Router) to achieve SEO-optimized SSR and a secure Admin CMS.

## ARCHITECTURE DIRECTIVES:
1. Framework: Next.js 15 with TypeScript and Tailwind CSS.
2. Architecture: Single Repository with Route Groups:
   - `(public)/*`: High-performance SSR pages for visitors.
   - `(admin)/*`: Protected CMS dashboard for officials.
3. Shared UI: Create a directory `src/components/shared` for reusable UI components (Buttons, Cards, Modals).
4. Data Layer: 
   - Use Upstash Redis as the database.
   - IMPORTANT: All database calls must happen in "Server Components" or "Next.js API Routes". Never expose the Upstash API Key to the client.
5. Styling: Modern Islamic Editorial. Colors: Deep Pine (#0D3B2E), Warm Alabaster (#F8F5F2), Emerald (#10B981).

## CORE FEATURES TO IMPLEMENT:
1. Public Site (SSR Enabled):
   - Home: Hero section, Org Stats, Latest Articles, Upcoming Events.
   - Articles: List & Detail pages (Slug-based) for SEO.
   - Schools: Directory of ROHIS SMA/SMK/MA in Banyumas.
   - Gallery & Contact.
2. Admin CMS (Protected):
   - Secure Login with Credentials & PIN.
   - Dashboard: Content management for all keys (articles, events, schools, team).
   - Real-time Sync: Update Redis via Serverless API and reflect changes instantly on the public site.
3. SEO & Metadata: Implement dynamic metadata for each article and page.

## TECHNICAL SPECIFICATIONS:
- Use `lucide-react` for icons.
- Implement a `cloudSync` utility in `src/lib/` to handle fetch requests to `/api/` endpoints.
- Ensure responsive design for mobile (students often access via HP).
- Use Framer Motion for subtle "Islamic Luxury" animations.

Please start by setting up the project structure, the shared component system, and the API proxy routes to Upstash Redis.
```

---