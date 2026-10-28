# 💼 StaffSync — Modern Human Resource Management Solution

> **Experiential Learning Program — Full Stack Development (MERN Stack)**  
> **Industry Partner**: MongoDB | In partnership with **NASSCOM FutureSkills Prime** & **SmartBridge**  
> **Target Evaluation Score**: 70 / 70 Marks (Project Track)

---

## 📌 1. Project Overview
**StaffSync** is an enterprise-ready Human Resource Management System (HRMS) built using the MERN stack (**M**ongoDB, **E**xpress.js, **R**eact.js, **N**ode.js). It digitizes paper-based processes and centralizes:
- **Workforce Directory & Onboarding**: Complete staff lifecycle tracking with department assignments and contact directories.
- **Attendance Terminal**: Automated daily punch-in/out logging with total working hours computation and punctuality status (`Present`, `Late`, `Half-Day`).
- **Self-Service Leave Portal**: Real-time leave applications (Casual, Sick, Paid, Unpaid) with an approval/rejection queue for managers.
- **Payroll & Compensation Engine**: Automated monthly payroll computation integrating basic salary, allowances, tax/unpaid deductions, and printable digital payslips.
- **Role-Based Access Control (RBAC)**: Strict role barriers for `Admin`, `Manager`, and `Employee`.

---

## 🛠️ 2. Technology Stack & Prerequisites

| Layer | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Frontend** | React.js (Vite) | 18.x | Dynamic Single Page Application (SPA), React Router v6, Tailwind CSS |
| **Backend** | Node.js & Express.js | 18+ / 4.x | RESTful API Gateway, route middleware, JWT authentication |
| **Database** | MongoDB & Mongoose | 6+ / 8.x | Document storage with schema validations, indexing, and virtuals |
| **Icons & UI** | Lucide React | 0.368+ | Accessible SVG icon library |
| **Security** | JSON Web Tokens & BCrypt | — | Stateless authentication & salted password hashing (10 rounds) |

---

## 📂 3. Project Directory Architecture

```
staffsync/
├── docs/                                # Phase Documentation (70 Marks Evaluation)
│   ├── 01_IDEATION_AND_BRAINSTORMING.md # Phase 1: Problem, Personas & Value Proposition (10 Marks)
│   ├── 02_REQUIREMENT_ANALYSIS.md       # Phase 2: Functional & Non-Functional Specs (10 Marks)
│   ├── 03_PROJECT_DESIGN_AND_ARCHITECTURE.md # Phase 3: ER Schemas & REST APIs (15 Marks)
│   ├── 04_AGILE_KANBAN_PLAN.md          # Phase 4: Sprints & Kanban Board (5 Marks)
│   └── 05_TESTING_AND_EVALUATION_PLAN.md # Phase 6 & 7: Test Cases & Demo Script (15 Marks)
│
├── server/                              # Node.js & Express REST Backend
│   ├── config/
│   │   └── db.js                        # MongoDB Connection Manager
│   ├── models/                          # Mongoose ODM Schemas
│   │   ├── User.js                      # System Auth & RBAC
│   │   ├── Employee.js                  # Staff Master Profile
│   │   ├── Department.js                # Business Units & Leads
│   │   ├── Attendance.js                # Clock-In / Clock-Out Sessions
│   │   ├── Leave.js                     # Leave Requests & Reviews
│   │   └── Payroll.js                   # Compensation & Payslips
│   ├── controllers/                     # Business Logic Handlers
│   ├── routes/                          # REST API Endpoints
│   ├── middleware/
│   │   ├── auth.js                      # JWT Verification & RBAC Guards
│   │   └── errorHandler.js              # Centralized Error Middleware
│   ├── seeds/
│   │   └── seedData.js                  # Automated Database Seeder
│   ├── package.json
│   ├── server.js                        # Express App Bootstrap
│   └── .env.example
│
├── client/                              # React.js Frontend (Vite + Tailwind)
│   ├── src/
│   │   ├── components/                  # Navbar, Sidebar, Modal, StatCard, StatusBadge
│   │   ├── context/
│   │   │   └── AuthContext.jsx          # Auth State & Session Persistence
│   │   ├── services/
│   │   │   └── api.js                   # Axios HTTP Client with Interceptors
│   │   ├── pages/                       # Login, Dashboard, Employees, Attendance, Leaves, Payroll
│   │   ├── App.jsx                      # Protected Routing Engine
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
└── package.json                         # Root Monorepo Scripts
```

---

## 🚀 4. Quick Start & Execution Guide

### 4.1 Backend Setup
```bash
# 1. Navigate to server folder
cd server

# 2. Install dependencies
npm install

# 3. Configure .env file
# Ensure MONGO_URI points to your local MongoDB or MongoDB Atlas cluster:
# MONGO_URI=mongodb://127.0.0.1:27017/staffsync

# 4. Seed sample test data (creates admin, manager, staff, depts, attendance & payroll)
npm run seed

# 5. Start development backend server (Port 5000)
npm run dev
```

### 4.2 Frontend Setup
```bash
# 1. Open a new terminal and navigate to client folder
cd client

# 2. Install dependencies
npm install

# 3. Start Vite React development server (Port 5173)
npm run dev
```

Open your browser at: **`http://localhost:5173`**

---

## 🔑 5. Pre-Configured Test Accounts (From Database Seeder)

| Role | Email Address | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **HR Admin** | `admin@staffsync.com` | `password123` | Full administrative control, onboard staff, approve leaves, compute payroll |
| **Dept Manager** | `manager@staffsync.com` | `password123` | View department employees, clock in/out, approve team leaves |
| **Employee** | `employee@staffsync.com` | `password123` | Personal profile, daily attendance clock, apply for leaves, view payslips |

---

## 📊 6. Evaluation Framework Alignment (SmartBridge 70 Marks)

| Evaluation Stage | Weightage | Completed Artifact / Evidence |
| :--- | :--- | :--- |
| **Phase 1: Brainstorming & Ideation** | 10 Marks | [`docs/01_IDEATION_AND_BRAINSTORMING.md`](docs/01_IDEATION_AND_BRAINSTORMING.md) |
| **Phase 2: Requirement Analysis** | 10 Marks | [`docs/02_REQUIREMENT_ANALYSIS.md`](docs/02_REQUIREMENT_ANALYSIS.md) |
| **Phase 3: Project Design** | 15 Marks | [`docs/03_PROJECT_DESIGN_AND_ARCHITECTURE.md`](docs/03_PROJECT_DESIGN_AND_ARCHITECTURE.md) |
| **Phase 4: Project Planning (Agile)** | 5 Marks | [`docs/04_AGILE_KANBAN_PLAN.md`](docs/04_AGILE_KANBAN_PLAN.md) |
| **Phase 5: Project Development** | 15 Marks | Complete Full-Stack MERN source code in `/server` & `/client` |
| **Phase 6: Testing & Evaluation** | 5 Marks | [`docs/05_TESTING_AND_EVALUATION_PLAN.md`](docs/05_TESTING_AND_EVALUATION_PLAN.md) |
| **Phase 7: Docs & Demonstration** | 10 Marks | Complete documentation, automated seeder & demo script |
| **TOTAL** | **70 Marks** | **100% Comprehensive Submission Ready** |
