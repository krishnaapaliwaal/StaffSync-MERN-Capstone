# StaffSync — Project Design & Architecture (Phase 3)
**Project Score Weightage: 15 Marks**

---

## 1. System Architecture Overview
StaffSync follows a decoupled 3-tier MERN architecture:
- **Presentation Layer (Frontend)**: React.js SPA utilizing component-based architecture, React Router DOM for client-side routing, Context API for state management, and Axios for asynchronous API communication.
- **Application Layer (Backend)**: Node.js with Express.js providing a RESTful API gateway, route-level authorization middleware, input validators, and business controllers.
- **Data Persistence Layer (Database)**: MongoDB NoSQL document store accessed through Mongoose Object Data Modeling (ODM) with schema validation, indexes, and relational population.

```mermaid
flowchart TD
    subgraph ClientLayer["Frontend Client (React.js SPA)"]
        UI["React UI Views (Dashboard, Employees, Leaves, Attendance, Payroll)"]
        Context["Auth & App Context (State Management)"]
        AxiosClient["Axios HTTP Service (JWT Interceptors)"]
        UI --> Context
        Context --> AxiosClient
    end

    subgraph ServerLayer["Backend Server (Node.js & Express.js)"]
        Router["Express REST API Router"]
        AuthMiddleware["JWT & RBAC Authorization Middleware"]
        Controllers["Business Controllers (Auth, Emp, Leave, Attendance, Payroll)"]
        Mongoose["Mongoose ODM Models & Schemas"]
        
        Router --> AuthMiddleware
        AuthMiddleware --> Controllers
        Controllers --> Mongoose
    end

    subgraph DataLayer["Database (MongoDB Atlas / Community)"]
        UsersCol[("Users Collection")]
        EmployeesCol[("Employees Collection")]
        DepartmentsCol[("Departments Collection")]
        AttendanceCol[("Attendance Collection")]
        LeavesCol[("Leaves Collection")]
        PayrollCol[("Payroll Collection")]
        
        Mongoose --> UsersCol
        Mongoose --> EmployeesCol
        Mongoose --> DepartmentsCol
        Mongoose --> AttendanceCol
        Mongoose --> LeavesCol
        Mongoose --> PayrollCol
    end

    AxiosClient -->|"HTTP/HTTPS REST Calls + Bearer Token"| Router
    Controllers -->|"JSON Data Responses"| AxiosClient
```

---

## 2. Database Schema Design (Mongoose Models)

### 2.1 Entity Relationship Model
```mermaid
erDiagram
    USER ||--o| EMPLOYEE : "authenticates as"
    DEPARTMENT ||--o{ EMPLOYEE : "belongs to"
    EMPLOYEE ||--o{ ATTENDANCE : "logs daily"
    EMPLOYEE ||--o{ LEAVE : "submits"
    EMPLOYEE ||--o{ PAYROLL : "receives"
    USER ||--o{ LEAVE : "reviews/approves"

    USER {
        ObjectId _id PK
        string email UK
        string password
        string role "Admin | Manager | Employee"
        ObjectId employeeId FK
        string status "Active | Inactive"
        date createdAt
    }

    DEPARTMENT {
        ObjectId _id PK
        string name UK
        string code UK
        string description
        ObjectId headOfDepartment FK
        date createdAt
    }

    EMPLOYEE {
        ObjectId _id PK
        string employeeCode UK
        string firstName
        string lastName
        string email UK
        string phone
        ObjectId departmentId FK
        string designation
        date joiningDate
        string employmentType "Full-time | Part-time | Contract | Intern"
        number basicSalary
        string status "Active | Inactive | Terminated"
    }

    ATTENDANCE {
        ObjectId _id PK
        ObjectId employeeId FK
        date date
        date clockIn
        date clockOut
        number totalHours
        string status "Present | Late | Half-Day | Absent"
        string remarks
    }

    LEAVE {
        ObjectId _id PK
        ObjectId employeeId FK
        string leaveType "Sick | Casual | Paid | Unpaid"
        date startDate
        date endDate
        number totalDays
        string reason
        string status "Pending | Approved | Rejected"
        ObjectId reviewedBy FK
        date reviewedAt
        string reviewRemarks
    }

    PAYROLL {
        ObjectId _id PK
        ObjectId employeeId FK
        number month
        number year
        number basicSalary
        number allowances
        number deductions
        number netSalary
        string status "Draft | Processed | Paid"
        date paymentDate
    }
```

---

## 3. RESTful API Specification

### Authentication Endpoints (`/api/auth`)
| Method | Endpoint | Access | Description | Request Body | Response |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/login` | Public | Authenticates credentials and returns JWT token | `{ email, password }` | `{ token, user }` |
| `POST` | `/register` | Admin | Creates a system user account | `{ email, password, role, employeeId }` | `{ success, user }` |
| `GET` | `/me` | Authenticated | Fetches current logged-in user profile | None (Bearer Token) | `{ user }` |
| `PUT` | `/update-password` | Authenticated | Updates current user password | `{ currentPassword, newPassword }` | `{ message }` |

### Employee Management Endpoints (`/api/employees`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Admin, Manager | Fetch all employees with filters (search, department, status) |
| `GET` | `/:id` | Authenticated | Get detailed profile of an employee |
| `POST` | `/` | Admin, Manager | Onboard a new employee |
| `PUT` | `/:id` | Admin, Manager | Update employee details |
| `DELETE` | `/:id` | Admin | Soft-delete / deactivate employee |

### Department Endpoints (`/api/departments`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Authenticated | List all departments with manager and member count |
| `POST` | `/` | Admin | Create a new department |
| `PUT` | `/:id` | Admin | Update department details |
| `DELETE` | `/:id` | Admin | Delete an empty department |

### Attendance Endpoints (`/api/attendance`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/clock-in` | Employee, Manager | Clock in for the current day |
| `POST` | `/clock-out` | Employee, Manager | Clock out and calculate total working hours |
| `GET` | `/today` | Authenticated | Get today's attendance record for current user |
| `GET` | `/history` | Authenticated | Get logged-in user's attendance history |
| `GET` | `/all` | Admin, Manager | Get all employees' attendance for a given date |

### Leave Endpoints (`/api/leaves`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/apply` | Authenticated | Submit a new leave request |
| `GET` | `/my-leaves` | Authenticated | View current user's submitted leave requests |
| `GET` | `/all` | Admin, Manager | View all leave requests across the company |
| `PUT` | `/:id/status`| Admin, Manager | Approve or reject a leave request with comments |

### Payroll Endpoints (`/api/payroll`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/generate` | Admin | Generate monthly payroll records for all active employees |
| `GET` | `/month` | Admin | Get payroll summary for a specific month/year |
| `GET` | `/my-payslips`| Authenticated | Get logged-in employee's payslip history |
| `PUT` | `/:id/status`| Admin | Update payroll status (Draft -> Processed -> Paid) |

### Dashboard Analytics (`/api/dashboard`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/stats` | Authenticated | Get aggregate counts (headcount, attendance %, pending leaves, payroll total) |

---

## 4. Key Workflows & Sequence Diagrams

### 4.1 Leave Application & Review Sequence
```mermaid
sequenceDiagram
    autonumber
    actor Employee
    participant UI as React UI
    participant API as Express API
    participant DB as MongoDB Atlas
    actor Manager as HR Admin / Manager

    Employee->>UI: Fills leave form (Date range, reason, type)
    UI->>API: POST /api/leaves/apply (Bearer Token + Body)
    API->>API: Validate dates, check overlapping leaves
    API->>DB: Insert Leave Document (Status: Pending)
    DB-->>API: Saved Leave Record
    API-->>UI: 201 Created (Leave application recorded)
    UI-->>Employee: Success alert & live balance update

    Manager->>UI: Opens Leave Approvals Queue
    UI->>API: GET /api/leaves/all?status=Pending
    API->>DB: Query pending leaves populated with employee data
    DB-->>API: Return pending records
    API-->>UI: Display table with Approve / Reject buttons
    Manager->>UI: Clicks "Approve"
    UI->>API: PUT /api/leaves/:id/status { status: "Approved" }
    API->>DB: Update Leave status & reviewer ID
    DB-->>API: Updated Document
    API-->>UI: 200 OK (Status updated)
```
