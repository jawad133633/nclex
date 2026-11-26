# NCLEXLab - Next-Generation NCLEX-RN Preparation Platform

![NCLEXLab Banner](https://img.shields.io/badge/NCLEX--RN-Preparation%20Platform-4f46e5?style=for-the-badge&logo=mediamark)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-nclexlab.vercel.app-success?style=for-the-badge&logo=vercel)](https://nclexlab.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-61dafb?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-4.21-white?style=flat-square&logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Supported%20%2B%20In--Memory%20Fallback-47a248?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![pnpm](https://img.shields.io/badge/pnpm-10.6-orange?style=flat-square&logo=pnpm)](https://pnpm.io/)

**NCLEXLab** is an enterprise-grade, comprehensive web platform engineered for nursing students preparing for the Next Generation NCLEX-RN (NGN) exam. Built on a high-performance modern monorepo architecture, NCLEXLab combines authentic clinical judgment questions, computerized adaptive testing (CAT) simulations, dynamic personalized study schedules, and an intuitive instructor/admin authoring dashboard.

---

## 🌟 Key Features

### 1. 🎓 Student Learning Workspace (`/student`)
- **Interactive Practice Test Builder**: Create custom practice exams with anywhere from 1 to 150 questions. Select custom question pools (*Unused, Learning, Reviewing, Mastered, Bookmarked*) across 8 core NCLEX subject categories:
  - *Adult Health*
  - *Child Health (Pediatrics)*
  - *Maternal & Newborn Health (Obstetrics)*
  - *Mental Health (Psychiatric)*
  - *Pharmacology & Parenteral Therapies*
  - *Fundamentals of Care*
  - *Management of Care & Safety*
  - *Next-Gen Case Studies*
- **Exam Testing Engine**:
  - Full-fidelity NCLEX examination UI replicating Pearson VUE test day experience.
  - **Tutor Mode vs. Timed Mode**: Get immediate clinical rationales upon answering or simulate actual exam pressure with strict timing.
  - Built-in on-screen Clinical Calculator, item bookmarking, strike-through, and question review navigator.
- **Your Study Schedule (Calendar & Task Manager)**:
  - Personalized 128-task study schedule dynamically balanced across your target exam date.
  - **Interactive Assignment Modal**: Click on any assignment to view details, duration, target subject, and completion tracking.
  - **Direct Question Practice**: Launch right into assigned questions with a single click (`▶ Start`).

### 2. 🧠 Next-Gen NCLEX (NGN) Case Studies & CAT Engine
- Multi-part clinical judgment simulation cases (NCSBN Clinical Judgment Measurement Model - NCJMM).
- Computerized Adaptive Testing (CAT) algorithm dynamically calibrating question difficulty to measure student passing competency.
- Performance analytics tracking confidence scores, high-yield subject mastery, and question completion streaks.

### 3. 🛠️ Admin & Faculty Workspace (`/admin`)
- Real-time question management system to draft, edit, publish, or retire standalone clinical questions.
- Instant synchronization with student dashboard via reactive local and API pipelines.
- Granular tagging by clinical subject, question type (*Multiple Choice, Select All That Apply [SATA], Fill-in-the-Blank*), and membership tier.

### 4. 🔐 Authentication & Account Management (`/login`, `/signup`, `/account`)
- Dedicated auth workflows branded for `nclexlab.com`.
- Session state persistence for guest and registered students.
- Student profile view with custom study preferences, test history, and membership status.

---

## 🏗️ Repository Architecture

NCLEXLab is organized as a high-performance **pnpm monorepo**:

```text
nclexlab/
├── apps/
│   └── web/                   # Next.js 16 Web Application
│       ├── app/               # Next.js App Router (Public, App, Student, Admin routes)
│       │   ├── (app)/         # Student, Admin, Account, Upgrade routes
│       │   ├── (public)/      # Landing page, Login, Signup, Auth routes
│       │   └── globals.css    # Unified application theme and layout styling
│       ├── features/          # Modular feature architecture
│       │   ├── auth/          # Authentication store & components
│       │   ├── marketing/     # High-conversion landing page components
│       │   ├── shared/        # Question bank API, local stores, membership state
│       │   └── student/       # Student dashboard, CAT engine, study schedule
│       └── package.json
├── servers/
│   └── api/                   # Express & TypeScript Backend API
│       ├── bootstrap/         # Server configuration, middleware, and logging
│       ├── features/
│       │   ├── question-bank/ # Question CRUD, test generator, and validation
│       │   └── study-schedule/# Schedule CRUD, rebalancing, and task assignment
│       ├── integrations/
│       │   └── mongodb/       # Resilient MongoDB driver with in-memory fallback
│       └── package.json
├── packages/
│   ├── shared-types/          # Universal TypeScript type definitions across web & API
│   ├── shared-ui/             # Shared component library and design tokens
│   └── tsconfig/              # Shared compiler configurations
├── package.json               # Root monorepo workspace scripts
└── pnpm-workspace.yaml        # Monorepo package boundaries
```

---

## ⚡ Quick Start & Local Setup

### Prerequisites
- **Node.js**: `v20.19.0` or higher (Node 22 LTS recommended)
- **pnpm**: `v10.6.0` or higher

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/jawad133633/nclex.git
   cd nclex/nclexlab
   ```

2. **Install all workspace dependencies:**
   ```bash
   pnpm install
   ```

3. **Start the development servers:**
   ```bash
   pnpm run dev
   ```

   This concurrently spins up:
   - **Web Application**: [`http://localhost:3000`](http://localhost:3000)
   - **Backend API**: [`http://127.0.0.1:4000`](http://127.0.0.1:4000)

---

## 🧭 Key Navigation Routes

| Route | Description |
| :--- | :--- |
| [`/`](http://localhost:3000/) | Public Marketing Landing Page explaining NCLEXLab advantages |
| [`/student`](http://localhost:3000/student) | Primary Student Study Dashboard, Custom Test Creator & Exam Interface |
| [`/admin`](http://localhost:3000/admin) | Faculty / Content Authoring Workspace |
| [`/account`](http://localhost:3000/account) | User Profile, Exam Date, and Study Preferences |
| [`/login`](http://localhost:3000/login) | Student Sign-in with `nclexlab.com` credentials |
| [`/signup`](http://localhost:3000/signup) | Student Free Account Registration |
| [`/upgrade`](http://localhost:3000/upgrade) | NCLEXLab Pro & Premium Subscription Plans |

---

## 🛡️ Resilient Data Layer (Zero-Configuration Needed)

NCLEXLab features an **automatic resilient data architecture**:
- **Production Mode**: Connects to MongoDB via standard `MONGODB_URI` environment variable.
- **Zero-Setup Local Mode**: If MongoDB is not configured or offline, the API automatically transitions to an **in-memory data store proxy pre-seeded with 1,300+ questions across 8 subjects**. You can create, edit, save, and practice exams immediately without installing external database software.

---

## 🧪 Verification & Quality Commands

```bash
# Type check all packages and workspaces
pnpm run typecheck

# Run unit and integration tests across the monorepo
pnpm run test

# Build production assets for deployment
pnpm run build
```

---

## 📄 License & Attribution

Developed with ❤️ by the **NCLEXLab Team**. All clinical question items, rationales, and Next-Gen case studies are aligned with the NCSBN NCLEX-RN Test Plan.
