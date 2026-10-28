# StaffSync — Requirement Analysis (Phase 2)
**Project Score Weightage: 10 Marks**

---

## 1. Scope & Objective
The scope of the StaffSync project is to design, develop, test, and deploy a robust full-stack web application providing automated human resource management capabilities for modern organizations.

---

## 2. Hardware & Software Requirements (As per Skill Wallet Specification)

### 2.1 Software Requirements
- **Operating System**: Windows 10/11, macOS, or Linux (cross-platform compatible).
- **Node.js**: v16.x or above (runtime environment for Express backend and frontend toolchain).
- **npm / pnpm**: v8.x or above (package manager for client and server dependencies).
- **React.js**: v18.x (functional components, hooks, React Router v6 for dynamic SPA navigation).
- **Express.js**: v4.x (RESTful API framework, modular routers, and custom middleware).
- **MongoDB**: NoSQL document database (MongoDB Atlas cloud instance or local Community Server v6+).
- **Mongoose**: v8.x ODM for structured data modeling, validation schemas, and indexing.
- **Postman**: API testing suite for endpoint validation, request payloads, and status assertions.
- **Code Editor**: Visual Studio Code with ESLint and Prettier extensions.
- **Browser**: Google Chrome / Mozilla Firefox / Microsoft Edge (latest standards-compliant browsers).

### 2.2 Hardware Requirements
- **Processor**: Intel Core i5 (8th Gen or above) / AMD Ryzen 5 or higher.
- **RAM**: Minimum 8 GB (16 GB recommended for concurrent backend, frontend, and database instances).
- **Storage**: At least 1 GB free disk space for node_modules, MongoDB data, and local assets.
- **Display Resolution**: 1366x768 or higher (tested for 1920x1080 full HD and responsive mobile breakpoints).

---

## 3. Functional Requirements (FRs)

### FR-1: Authentication & Role-Based Access Control (RBAC)
- **FR-1.1**: Secure user registration and login with email and salted/hashed passwords (bcrypt).
- **FR-1.2**: JWT (JSON Web Token) issuance on successful login with customizable token expiry.
- **FR-1.3**: Role definitions:
  - `Admin`: Unrestricted access across departments, employees, leaves, payroll, and settings.
  - `Manager`: Access to department team members, attendance review, and leave approvals.
  - `Employee`: Access to personal profile, attendance check-in/out, leave requests, and personal payslips.
- **FR-1.4**: Protected frontend routes with unauthorized redirect logic.

### FR-2: Employee Directory & Lifecycle Management
- **FR-2.1**: Comprehensive employee creation form with validation:
  - Unique Employee Code (e.g., `EMP-1001`), Full Name, Email, Phone, Date of Birth, Gender.
  - Professional: Department, Designation, Date of Joining, Employment Type (Full-time, Part-time, Contract, Intern).
  - Financial: Basic Salary, Allowance package, Bank account details.
- **FR-2.2**: Search, filter, and pagination across employee records (by department, status, name).
- **FR-2.3**: Update employee profiles and soft-delete/deactivate accounts when offboarding.

### FR-3: Department & Organizational Hierarchy
- **FR-3.1**: Create, read, update, and delete company departments (e.g., Engineering, HR, Finance, Marketing, Sales).
- **FR-3.2**: Assign designated Department Heads / Managers.
- **FR-3.3**: Real-time staff headcounts per department.

### FR-4: Attendance Tracking System
- **FR-4.1**: One-click daily Clock-In and Clock-Out recording timestamped logs.
- **FR-4.2**: Automatic status assignment: `Present` (>= 8 hours), `Half-Day` (4 to 8 hours), `Late` (check-in after grace period), or `Absent`.
- **FR-4.3**: Calendar and tabular view of employee daily attendance history.
- **FR-4.4**: HR monthly attendance summaries for payroll calculation inputs.

### FR-5: Leave Request & Approval Workflow
- **FR-5.1**: Self-service leave application specifying leave type (`Sick`, `Casual`, `Paid`, `Unpaid`), date range, and reason.
- **FR-5.2**: Automated duration calculation (excluding weekends/public holidays).
- **FR-5.3**: Manager/Admin review portal with one-click **Approve** or **Reject** with comments.
- **FR-5.4**: Real-time leave balance deduction and status notification badge for employees.

### FR-6: Payroll Management Engine
- **FR-6.1**: Monthly payroll generation aggregating basic salary, allowances (HRA, Transport, Special), and deductions (PF, Tax).
- **FR-6.2**: Automated calculation of Net Salary = `(Basic + Allowances) - (Deductions + Unpaid Leave Penalties)`.
- **FR-6.3**: Payment status tracking (`Pending`, `Processed`, `Paid`).
- **FR-6.4**: Printable/downloadable digital payslip view for employees.

### FR-7: Executive Analytics & Reporting Dashboard
- **FR-7.1**: Real-time metric cards: Total Headcount, Active Staff, Today's Attendance %, Pending Leave Requests, Monthly Payroll Total.
- **FR-7.2**: Visual departmental distribution chart and attendance trend breakdown.
- **FR-7.3**: Recent activity feed highlighting new hires and pending approval queues.

---

## 4. Non-Functional Requirements (NFRs)

| Category | Requirement Specification |
| :--- | :--- |
| **Performance** | API responses delivered within < 200ms under standard operational loads; SPA initial load time < 2.5s. |
| **Security** | Passwords hashed using `bcrypt` (10 salt rounds); JWT token validation on protected endpoints; input sanitization and XSS prevention. |
| **Scalability** | Stateless RESTful architecture; modular Mongoose schemas capable of indexing millions of attendance and log records. |
| **Usability** | Clean, responsive UI built with modern CSS / Tailwind utility design; intuitive navigation requiring minimal staff training. |
| **Maintainability** | Clean MVC architecture (Model-View-Controller) separating business logic, routing, schemas, and UI components. |
