# StaffSync — Agile Project Planning & Kanban Breakdown (Phase 4)
**Project Score Weightage: 5 Marks**

---

## 1. Agile Framework Overview
The development of StaffSync is planned over a 4-week Agile delivery cycle aligned with the **SmartBridge Experiential Learning 37-day calendar** (Day 17 Project Kickoff to Day 36 Final Submission).

Work is partitioned into **4 Sprints**, managed across a 4-column Kanban workflow:
1. `Backlog / To Do`: Tasks scoped and prioritized for upcoming execution.
2. `In Progress`: Actively under development / implementation.
3. `In Review / Testing`: Feature complete, undergoing unit/functional validation and code review.
4. `Done`: Verified against acceptance criteria and merged to main repository.

---

## 2. Sprint Milestones & Timeline Mapping

| Sprint | Timeline (Calendar Days) | Focus Area | Key Deliverable |
| :--- | :--- | :--- | :--- |
| **Sprint 1** | Days 17 – 21 (Orientation & Discovery) | Problem Framing, Requirements & Architecture | System Architecture, Wireframes & Database Schema Design |
| **Sprint 2** | Days 22 – 26 (Core Backend & DB) | REST API Development & Data Persistence | Express Server, MongoDB Atlas Models, JWT Auth & CRUD APIs |
| **Sprint 3** | Days 27 – 31 (Frontend UI & Integration) | React SPA & Full-Stack Integration | Responsive Dashboard, Employee Directory, Leaves & Attendance UI |
| **Sprint 4** | Days 32 – 36 (Testing & Polishing) | Payroll Module, Testing & Final Documentation | End-to-End Testing, Postman Collection, GitHub Repository & Demo |

---

## 3. Skill Wallet Kanban Board Representation

```
+-----------------------------------------------------------------------------------------------------------------------------------+
|                                                 STAFFSYNC KANBAN BOARD                                                            |
+------------------------------+------------------------------+------------------------------------+--------------------------------+
|          TO DO (0)           |       IN PROGRESS (0)        |        IN REVIEW / TESTING (0)     |           DONE (16)            |
+------------------------------+------------------------------+------------------------------------+--------------------------------+
|                              |                              |                                    | [SS-101] Ideation & Problem    |
|                              |                              |                                    | Definition Document            |
|                              |                              |                                    |                                |
|                              |                              |                                    | [SS-102] SRS & Hardware/       |
|                              |                              |                                    | Software Spec Matrix           |
|                              |                              |                                    |                                |
|                              |                              |                                    | [SS-103] Mongoose ER Schemas   |
|                              |                              |                                    | (User, Emp, Dept, Leave, etc.) |
|                              |                              |                                    |                                |
|                              |                              |                                    | [SS-104] Express Server &      |
|                              |                              |                                    | MongoDB Connection Setup       |
|                              |                              |                                    |                                |
|                              |                              |                                    | [SS-105] JWT Auth & Password   |
|                              |                              |                                    | Hashing Middleware             |
|                              |                              |                                    |                                |
|                              |                              |                                    | [SS-106] Employee CRUD REST    |
|                              |                              |                                    | Endpoints & Validations        |
|                              |                              |                                    |                                |
|                              |                              |                                    | [SS-107] Department Structure  |
|                              |                              |                                    | & Manager Linking APIs         |
|                              |                              |                                    |                                |
|                              |                              |                                    | [SS-108] Clock-in/Clock-out    |
|                              |                              |                                    | Attendance Engine              |
|                              |                              |                                    |                                |
|                              |                              |                                    | [SS-109] Leave Request &       |
|                              |                              |                                    | Manager Approval Workflow      |
|                              |                              |                                    |                                |
|                              |                              |                                    | [SS-110] Monthly Payroll & Net |
|                              |                              |                                    | Salary Calculation API         |
|                              |                              |                                    |                                |
|                              |                              |                                    | [SS-111] React Single Page App |
|                              |                              |                                    | Scaffolding + React Router     |
|                              |                              |                                    |                                |
|                              |                              |                                    | [SS-112] AuthContext & Private |
|                              |                              |                                    | Route Protection               |
|                              |                              |                                    |                                |
|                              |                              |                                    | [SS-113] Responsive Navbar &   |
|                              |                              |                                    | Sidebar Navigation Layout      |
|                              |                              |                                    |                                |
|                              |                              |                                    | [SS-114] Interactive Employee  |
|                              |                              |                                    | Directory with Modals          |
|                              |                              |                                    |                                |
|                              |                              |                                    | [SS-115] Attendance & Leave    |
|                              |                              |                                    | Management UI Pages            |
|                              |                              |                                    |                                |
|                              |                              |                                    | [SS-116] Seed Data & Postman   |
|                              |                              |                                    | API Test Verification          |
+------------------------------+------------------------------+------------------------------------+--------------------------------+
```

---

## 4. User Story Backlog Matrix

| Story ID | User Story | Priority | Estimation | Acceptance Criteria |
| :--- | :--- | :--- | :--- | :--- |
| **US-01** | *As an HR Admin*, I want to log in securely so that I can manage company staff without unauthorized access. | High | 3 pts | Valid credentials return JWT; incorrect password returns 401 error. |
| **US-02** | *As an HR Admin*, I want to create and edit employee profiles with departments and salaries so that records remain current. | High | 5 pts | All required fields validated; duplicate email rejected; updates reflected instantly. |
| **US-03** | *As an Employee*, I want to clock in and out daily so that my work attendance is accurately recorded. | High | 5 pts | Prevents duplicate clock-ins; calculates total working hours on clock-out. |
| **US-04** | *As an Employee*, I want to apply for leaves and view my remaining balance so that I can plan time off. | High | 5 pts | Date validation (start <= end); automated total days computation; status starts as 'Pending'. |
| **US-05** | *As a Manager*, I want to review pending leave requests and approve/reject them with comments. | High | 3 pts | Manager can see list of requests; click approve/reject updates status and logs timestamp. |
| **US-06** | *As an HR Admin*, I want to compute monthly payroll for all active employees and generate payslips. | Medium | 5 pts | Deducts unpaid days, calculates net pay = basic + allowance - deductions. |
| **US-07** | *As an Executive*, I want a high-level dashboard displaying key HR KPIs. | Medium | 3 pts | Cards display real-time employee count, attendance rate %, pending leaves, and active departments. |
