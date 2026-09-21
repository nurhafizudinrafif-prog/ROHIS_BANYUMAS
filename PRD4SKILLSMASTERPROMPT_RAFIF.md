
---

# 📄 Final Product Requirements Document (PRD): ROKABA Digital Hub

## 1. Product Overview & Vision
*   **Project Name:** Website Resmi & CMS Terpadu ROHIS Kabupaten Banyumas (ROKABA).
*   **Vision:** Platform dakwah digital yang menggabungkan estetika *Modern Islamic Editorial* dengan performa tinggi dan ketahanan data (Resilience).
*   **Dual-App Strategy:** Memisahkan Public Website (User-facing) dan Admin CMS (Management-facing) untuk isolasi keamanan dan optimasi performa.

## 2. Technical Architecture (The "Resilient Stack")
*   **Core:** React 19 (Vite) - Memanfaatkan `useActionState`, `useOptimistic`, dan `Document Metadata`.
*   **Data Layer:** Upstash Redis (Cloud) via REST API + LocalStorage Fallback.
*   **Logic:** Resilient Fallback System (Cloud Sync -> Local Cache -> Static JS).
*   **Styling:** Vanilla Modern CSS with Glassmorphism & Custom Properties.
*   **Utilities:** `lucide-react` (icons), `html2canvas/jsPDF` (E-KTA), `qrcode.react` (QR Engine).

## 3. Advanced Functional Requirements
1.  **React 19 Implementation:** Penggunaan *Actions* untuk form submission di CMS agar handle loading state lebih elegan.
2.  **E-KTA Automation:** Sistem generator kartu anggota digital berbasis canvas/PDF yang dapat diunduh langsung.
3.  **QR Presence:** Generator QR Code untuk setiap agenda dan sistem scanner untuk mencatat kehadiran ke database Upstash.
4.  **Dual-App Workspace:**
    *   **Public:** Render cepat, SEO-friendly (via Metadata API), read-only dari Upstash.
    *   **Admin:** Bento Dashboard, akses RW (Read-Write), sistem audit log, dan backup JSON.

## 4. Data Schema & Models (JSON/Key-Value)
```json
// Key: "rokaba:members" (Example for E-KTA & Presence)
[
  {
    "id": "KTA-2024-001",
    "name": "Ahmad Fauzi",
    "school_id": "sma1-pwt",
    "role": "Kader",
    "qr_token": "unique-uuid-for-scan",
    "verified": true
  }
]

// Key: "rokaba:events"
[
  {
    "id": "evt-001",
    "title": "Latihan Kepemimpinan Islam",
    "date": "2024-10-20",
    "location": "Masjid Agung Purwokerto",
    "attendees": ["KTA-2024-001", "KTA-2024-005"]
  }
]
```

## 5. UI/UX Design System
*   **Palet Warna:** Deep Pine (`#0D2B22`), Warm Alabaster (`#F5F2ED`), Antique Brass (`#B58D4F`), Emerald Glass.
*   **Typography:** Editorial style, high readability for long articles.
*   **Layout:** Mobile-first untuk pelajar, Dark Bento Glass untuk pengurus.

---

## 6. 🚀 Master Prompt PRD (Siap Copy untuk AI Coding)
Salin seluruh instruksi di bawah ini ke **Cursor, Claude Code, atau Windsurf**. Prompt ini telah dioptimalkan dengan seluruh *skill set* yang Anda pilih.

```markdown
# PROMPT: ROKABA HIGH-END DIGITAL HUB (REACT 19 + UPSTASH RESILIENCE)

Role: World-Class Fullstack Architect & React 19 Expert.
Context: Build the ROKABA (ROHIS Kabupaten Banyumas) System using a Dual-App Workspace.

### 1. TECHNICAL STACK & ARCHITECTURE
- Framework: React 19 (Vite) - MUST use React 19 features (Actions, useOptimistic, Metadata).
- Styling: Vanilla Modern CSS (No Tailwind/UI Libs unless for icons), focus on Glassmorphism & Custom Properties.
- Database: Upstash Redis (REST API) with a "Resilient Fallback" logic:
  1. Fetch from Upstash Cloud.
  2. If fails/offline, fetch from LocalStorage.
  3. If empty, fallback to static .js data files.
- Dual-App: 
  - Root (./) -> Public Web (Editorial Style).
  - Admin (./admin) -> CMS (Bento Dashboard, Login: 'rohis banyumas'/'rbk banyumas').

### 2. CORE FEATURES TO IMPLEMENT
1. **React 19 Actions:** Handle all CMS form submissions (Articles, Events, Schools) using React 19 Action states.
2. **E-KTA Generator:** Create a feature to generate Digital Member Cards (PDF/Image) using the user's profile data and a unique ID.
3. **QR Attendance Engine:**
   - Admin generates a QR Code for an event.
   - Users/Admin can scan to record attendance (check-in) saved to Upstash.
4. **Editorial CMS:**
   - Full CRUD for Articles, Agenda, Gallery, and School Directory.
   - Integrated Visual Home Editor (Hero Title, Welcome Message).
   - "Audit Logs" to track admin actions.
   - "Backup/Restore" via JSON export/import.

### 3. DESIGN GUIDELINES (Modern Islamic Luxury)
- Palette: Deep Pine (#0D2B22), Warm Alabaster (#F5F2ED), Antique Brass (#B58D4F).
- Aesthetics: 3D Emerald Glass components, high-quality typography, responsive/mobile-first.

### 4. PROJECT STRUCTURE
- src/context/DataContext.jsx: Centralized State using Context API & CloudSync.js.
- src/services/cloudSync.js: Logic for Upstash REST & Fallback.
- admin/src/pages/AdminDashboard.jsx: The command center.
- Provide .bat scripts for local operations (Windows).

### 5. EXECUTION STEP 1
Initialize the project structure. Set up the Dual-App folders. Create the DataContext that handles the Resilient Fallback logic (Upstash -> LocalStorage -> Static). Build the Login page for Admin and the Base Layout for the Public site using the specified CSS variables.
```

---