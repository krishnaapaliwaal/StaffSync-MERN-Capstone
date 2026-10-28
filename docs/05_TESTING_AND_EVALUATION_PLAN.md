# StaffSync — Testing, Evaluation & Demonstration Plan (Phases 6 & 7)
**Project Score Weightage: 15 Marks (5 Marks Testing + 5 Marks Documentation + 5 Marks Demonstration)**

---

## 1. Testing Strategy & Methodology
StaffSync undergoes a comprehensive multi-tier quality assurance lifecycle:
1. **API & Integration Testing**: Postman collections verifying all RESTful endpoints, status codes, payload validations, and JWT token authentication.
2. **Database Integrity Testing**: Mongoose schema validations, uniqueness constraints (Email, Employee Code), and relational integrity (foreign keys).
3. **Role-Based Access Control (RBAC) Verification**: Ensuring protected routes block unauthenticated and unauthorized role requests (401 Unauthorized, 403 Forbidden).
4. **Frontend UI & Usability Testing**: Form input validations, modal behaviors, responsive layout across mobile, tablet, and desktop breakpoints.

---

## 2. API Functional Test Cases Matrix

| Test ID | Module | Endpoint | Method | Test Input / Condition | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-01** | Auth | `/api/auth/login` | `POST` | Valid admin email & correct password | HTTP 200 OK + JWT Token + User Object | Passed |
| **TC-02** | Auth | `/api/auth/login` | `POST` | Invalid password or unregistered email | HTTP 401 Unauthorized (`Invalid credentials`) | Passed |
| **TC-03** | Auth | `/api/employees` | `GET` | Request without `Authorization` header | HTTP 401 Unauthorized (`No token provided`) | Passed |
| **TC-04** | Employee | `/api/employees` | `POST` | New employee payload with unique email & code | HTTP 201 Created + Employee Document | Passed |
| **TC-05** | Employee | `/api/employees` | `POST` | Duplicate employee email or missing required fields | HTTP 400 Bad Request (`Validation failed`) | Passed |
| **TC-06** | Attendance | `/api/attendance/clock-in` | `POST` | Logged-in employee clocks in | HTTP 201 Created + Clock-in timestamp logged | Passed |
| **TC-07** | Attendance | `/api/attendance/clock-in` | `POST` | Attempt second clock-in on same calendar day | HTTP 400 Bad Request (`Already clocked in`) | Passed |
| **TC-08** | Attendance | `/api/attendance/clock-out`| `POST` | Employee clocks out after working hours | HTTP 200 OK + Total hours computed & status set | Passed |
| **TC-09** | Leave | `/api/leaves/apply` | `POST` | Valid date range (start <= end) with reason | HTTP 201 Created + Status: `Pending` | Passed |
| **TC-10** | Leave | `/api/leaves/:id/status`| `PUT` | Manager approves request (`status: Approved`) | HTTP 200 OK + Updated status + reviewerId logged | Passed |
| **TC-11** | Payroll | `/api/payroll/generate` | `POST` | Target month & year | HTTP 201 Created + Payslips created for active staff | Passed |
| **TC-12** | Dashboard | `/api/dashboard/stats` | `GET` | Authenticated manager / admin token | HTTP 200 OK + Real-time counts & metrics | Passed |

---

## 3. Project Demonstration Script (Phase 7 - 5 Marks)
Follow this step-by-step 5-minute walkthrough during your cohort final evaluation:

1. **Introduction (1 min)**:
   - State the project title: **StaffSync - Modern Human Resource Management Solution**.
   - Mention the tech stack: **MongoDB, Express.js, React.js, Node.js (MERN Stack)**.
   - Highlight the business value: Centralized records, paperless leaves, automated attendance, and one-click payroll.

2. **Executive Dashboard Walkthrough (1 min)**:
   - Log in as `admin@staffsync.com`.
   - Showcase KPI metric cards (Total Headcount, Active Staff, Attendance Rate %, Pending Leaves).
   - Display department distribution and quick-action navigation.

3. **Employee Lifecycle & Department Management (1 min)**:
   - Navigate to the **Employee Directory**.
   - Demonstrate real-time search and department filtering.
   - Open the "Add New Employee" modal, submit a profile, and show immediate table update.

4. **Self-Service Attendance & Leave Workflow (1.5 min)**:
   - Switch or demonstrate the **Attendance Clock-In / Clock-Out** widget.
   - Show how the total working hours and status (`Present` / `Half-Day`) are automatically calculated.
   - Submit a new leave application (e.g., Casual Leave for 2 days).
   - Show the Manager/Admin review queue approving the leave with a single click.

5. **Payroll Generation & Wrap Up (0.5 min)**:
   - Navigate to **Payroll Management**.
   - Trigger the monthly payroll computation.
   - Display the generated payslip breakdown (Basic + Allowances - Deductions = Net Pay).
   - Conclude by highlighting code quality, Mongoose schema design, and modular REST API structure.
