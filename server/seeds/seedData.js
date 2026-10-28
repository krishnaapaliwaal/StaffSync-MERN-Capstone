const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Department = require('../models/Department');
const Employee = require('../models/Employee');
const Attendance = require('../models/Attendance');
const Leave = require('../models/Leave');
const Payroll = require('../models/Payroll');

dotenv.config();

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/staffsync');
    console.log('[Seed]: Connected to MongoDB...');

    // Clear existing collections
    await Promise.all([
      User.deleteMany({}),
      Department.deleteMany({}),
      Employee.deleteMany({}),
      Attendance.deleteMany({}),
      Leave.deleteMany({}),
      Payroll.deleteMany({}),
    ]);
    console.log('[Seed]: Cleared existing database records.');

    // 1. Create Departments
    const departments = await Department.insertMany([
      { name: 'Engineering', code: 'ENG', description: 'Software engineering, DevOps and QA' },
      { name: 'Human Resources', code: 'HR', description: 'Talent acquisition, operations and culture' },
      { name: 'Finance & Accounts', code: 'FIN', description: 'Financial planning, accounting and payroll' },
      { name: 'Sales & Marketing', code: 'MKT', description: 'Brand marketing, customer acquisition and sales' },
      { name: 'Operations', code: 'OPS', description: 'Facilities and day-to-day business operations' },
    ]);
    console.log('[Seed]: Created 5 Departments.');

    const engDept = departments.find((d) => d.code === 'ENG');
    const hrDept = departments.find((d) => d.code === 'HR');
    const finDept = departments.find((d) => d.code === 'FIN');
    const mktDept = departments.find((d) => d.code === 'MKT');

    // 2. Create Sample Employees
    const employeesData = [
      {
        employeeCode: 'EMP-1001',
        firstName: 'Rajesh',
        lastName: 'Sharma',
        email: 'admin@staffsync.com',
        phone: '+91 98765 43210',
        department: hrDept._id,
        designation: 'HR Director',
        joiningDate: new Date('2022-01-15'),
        employmentType: 'Full-time',
        salary: { basic: 75000, allowance: 15000, deductions: 5000 },
        status: 'Active',
      },
      {
        employeeCode: 'EMP-1002',
        firstName: 'Priya',
        lastName: 'Nair',
        email: 'manager@staffsync.com',
        phone: '+91 98765 43211',
        department: engDept._id,
        designation: 'Engineering Lead',
        joiningDate: new Date('2022-06-01'),
        employmentType: 'Full-time',
        salary: { basic: 90000, allowance: 18000, deductions: 6000 },
        status: 'Active',
      },
      {
        employeeCode: 'EMP-1003',
        firstName: 'Amit',
        lastName: 'Kumar',
        email: 'employee@staffsync.com',
        phone: '+91 98765 43212',
        department: engDept._id,
        designation: 'Full Stack Developer',
        joiningDate: new Date('2023-03-10'),
        employmentType: 'Full-time',
        salary: { basic: 55000, allowance: 10000, deductions: 3500 },
        status: 'Active',
      },
      {
        employeeCode: 'EMP-1004',
        firstName: 'Sneha',
        lastName: 'Patel',
        email: 'sneha.patel@staffsync.com',
        phone: '+91 98765 43213',
        department: finDept._id,
        designation: 'Senior Accountant',
        joiningDate: new Date('2023-01-20'),
        employmentType: 'Full-time',
        salary: { basic: 50000, allowance: 8000, deductions: 3000 },
        status: 'Active',
      },
      {
        employeeCode: 'EMP-1005',
        firstName: 'Vikram',
        lastName: 'Rathore',
        email: 'vikram.r@staffsync.com',
        phone: '+91 98765 43214',
        department: mktDept._id,
        designation: 'Marketing Strategist',
        joiningDate: new Date('2023-08-15'),
        employmentType: 'Full-time',
        salary: { basic: 45000, allowance: 7000, deductions: 2500 },
        status: 'Active',
      },
      {
        employeeCode: 'EMP-1006',
        firstName: 'Ananya',
        lastName: 'Deshmukh',
        email: 'ananya.d@staffsync.com',
        phone: '+91 98765 43215',
        department: engDept._id,
        designation: 'UI/UX Frontend Engineer',
        joiningDate: new Date('2024-02-01'),
        employmentType: 'Full-time',
        salary: { basic: 48000, allowance: 7000, deductions: 2800 },
        status: 'Active',
      },
    ];

    const employees = await Employee.insertMany(employeesData);
    console.log(`[Seed]: Created ${employees.length} Employees.`);

    // Update department managers
    await Department.findByIdAndUpdate(hrDept._id, { manager: employees[0]._id });
    await Department.findByIdAndUpdate(engDept._id, { manager: employees[1]._id });

    // 3. Create Users with Passwords
    const users = [
      {
        name: 'Rajesh Sharma (Admin)',
        email: 'admin@staffsync.com',
        password: 'password123',
        role: 'Admin',
        employeeId: employees[0]._id,
      },
      {
        name: 'Priya Nair (Manager)',
        email: 'manager@staffsync.com',
        password: 'password123',
        role: 'Manager',
        employeeId: employees[1]._id,
      },
      {
        name: 'Amit Kumar (Employee)',
        email: 'employee@staffsync.com',
        password: 'password123',
        role: 'Employee',
        employeeId: employees[2]._id,
      },
    ];

    for (const u of users) {
      await User.create(u);
    }
    console.log('[Seed]: Created 3 User Auth Accounts (Admin, Manager, Employee).');

    // 4. Create Sample Attendance Records
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const clockInTime = new Date();
    clockInTime.setHours(9, 15, 0);

    await Attendance.insertMany([
      {
        employee: employees[0]._id,
        date: today,
        clockIn: clockInTime,
        status: 'Present',
      },
      {
        employee: employees[1]._id,
        date: today,
        clockIn: clockInTime,
        status: 'Present',
      },
      {
        employee: employees[2]._id,
        date: today,
        clockIn: clockInTime,
        status: 'Present',
      },
      {
        employee: employees[3]._id,
        date: today,
        clockIn: new Date(new Date().setHours(10, 30, 0)),
        status: 'Late',
      },
    ]);
    console.log('[Seed]: Created Attendance Records for Today.');

    // 5. Create Sample Leaves
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 2);
    const dayAfter = new Date();
    dayAfter.setDate(dayAfter.getDate() + 4);

    await Leave.insertMany([
      {
        employee: employees[2]._id,
        leaveType: 'Casual',
        startDate: tomorrow,
        endDate: dayAfter,
        totalDays: 2,
        reason: 'Attending family wedding ceremony',
        status: 'Pending',
      },
      {
        employee: employees[4]._id,
        leaveType: 'Sick',
        startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
        totalDays: 1,
        reason: 'Severe migraine recovery',
        status: 'Approved',
        reviewedAt: new Date(),
      },
    ]);
    console.log('[Seed]: Created Sample Leave Requests.');

    // 6. Create Sample Payroll Records for Current Month
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    for (const emp of employees) {
      const basic = emp.salary.basic;
      const allowance = emp.salary.allowance;
      const deductions = emp.salary.deductions;
      const net = basic + allowance - deductions;

      await Payroll.create({
        employee: emp._id,
        month: currentMonth,
        year: currentYear,
        basicSalary: basic,
        allowances: allowance,
        deductions,
        netSalary: net,
        status: 'Processed',
        paymentMethod: 'Bank Transfer',
      });
    }
    console.log('[Seed]: Created Monthly Payroll Records.');

    console.log('\n======================================================');
    console.log(' SEEDING COMPLETE! DEFAULT LOGIN CREDENTIALS:');
    console.log(' - HR Admin : admin@staffsync.com   | password123');
    console.log(' - Manager  : manager@staffsync.com | password123');
    console.log(' - Employee : employee@staffsync.com| password123');
    console.log('======================================================\n');

    process.exit(0);
  } catch (err) {
    console.error('[Seed Error]:', err);
    process.exit(1);
  }
};

seedDB();
