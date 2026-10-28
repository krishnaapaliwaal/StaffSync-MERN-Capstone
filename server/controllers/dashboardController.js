const Employee = require('../models/Employee');
const Department = require('../models/Department');
const Attendance = require('../models/Attendance');
const Leave = require('../models/Leave');
const Payroll = require('../models/Payroll');

// @desc    Get dashboard metrics & summary data
// @route   GET /api/dashboard/stats
// @access  Private
exports.getDashboardStats = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalEmployees,
      activeEmployees,
      totalDepartments,
      todayAttendanceCount,
      pendingLeavesCount,
      departments,
    ] = await Promise.all([
      Employee.countDocuments(),
      Employee.countDocuments({ status: 'Active' }),
      Department.countDocuments(),
      Attendance.countDocuments({ date: today, status: { $in: ['Present', 'Late', 'Half-Day'] } }),
      Leave.countDocuments({ status: 'Pending' }),
      Department.find().lean(),
    ]);

    // Calculate department breakdown
    const departmentDistribution = await Promise.all(
      departments.map(async (dept) => {
        const count = await Employee.countDocuments({ department: dept._id, status: 'Active' });
        return { name: dept.name, code: dept.code, count };
      })
    );

    // Recent 5 leave requests
    const recentLeaves = await Leave.find()
      .populate('employee', 'firstName lastName employeeCode designation')
      .sort({ createdAt: -1 })
      .limit(5);

    // Attendance rate %
    const attendanceRate = activeEmployees > 0
      ? Math.round((todayAttendanceCount / activeEmployees) * 100)
      : 0;

    res.status(200).json({
      success: true,
      stats: {
        totalEmployees,
        activeEmployees,
        totalDepartments,
        todayAttendanceCount,
        attendanceRate,
        pendingLeavesCount,
      },
      departmentDistribution,
      recentLeaves,
    });
  } catch (error) {
    next(error);
  }
};
