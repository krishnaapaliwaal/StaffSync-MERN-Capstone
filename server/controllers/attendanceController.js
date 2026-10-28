const Attendance = require('../models/Attendance');
const Employee = require('../models/Employee');

// Helper to get normalized start of today
const getTodayDate = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

// @desc    Clock in for today
// @route   POST /api/attendance/clock-in
// @access  Private
exports.clockIn = async (req, res, next) => {
  try {
    const employeeId = req.user.employeeId?._id || req.user.employeeId;
    if (!employeeId) {
      return res.status(400).json({ success: false, message: 'No employee profile linked to this user' });
    }

    const today = getTodayDate();
    let record = await Attendance.findOne({ employee: employeeId, date: today });

    if (record) {
      return res.status(400).json({ success: false, message: 'You have already clocked in for today.' });
    }

    const now = new Date();
    // Example: If clock in is after 10:00 AM, mark as Late
    const isLate = now.getHours() > 10 || (now.getHours() === 10 && now.getMinutes() > 15);

    record = await Attendance.create({
      employee: employeeId,
      date: today,
      clockIn: now,
      status: isLate ? 'Late' : 'Present',
    });

    res.status(201).json({ success: true, message: 'Clocked in successfully', data: record });
  } catch (error) {
    next(error);
  }
};

// @desc    Clock out for today
// @route   POST /api/attendance/clock-out
// @access  Private
exports.clockOut = async (req, res, next) => {
  try {
    const employeeId = req.user.employeeId?._id || req.user.employeeId;
    if (!employeeId) {
      return res.status(400).json({ success: false, message: 'No employee profile linked to this user' });
    }

    const today = getTodayDate();
    const record = await Attendance.findOne({ employee: employeeId, date: today });

    if (!record) {
      return res.status(400).json({ success: false, message: 'No clock-in record found for today.' });
    }

    if (record.clockOut) {
      return res.status(400).json({ success: false, message: 'You have already clocked out for today.' });
    }

    const now = new Date();
    record.clockOut = now;

    // Calculate total hours worked
    const diffMs = now - new Date(record.clockIn);
    const diffHours = parseFloat((diffMs / (1000 * 60 * 60)).toFixed(2));
    record.totalHours = diffHours;

    if (diffHours < 4) {
      record.status = 'Half-Day';
    }

    await record.save();

    res.status(200).json({ success: true, message: 'Clocked out successfully', data: record });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's today status
// @route   GET /api/attendance/today
// @access  Private
exports.getTodayAttendance = async (req, res, next) => {
  try {
    const employeeId = req.user.employeeId?._id || req.user.employeeId;
    if (!employeeId) {
      return res.status(200).json({ success: true, data: null });
    }

    const today = getTodayDate();
    const record = await Attendance.findOne({ employee: employeeId, date: today });

    res.status(200).json({ success: true, data: record });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's attendance history
// @route   GET /api/attendance/history
// @access  Private
exports.getAttendanceHistory = async (req, res, next) => {
  try {
    const employeeId = req.user.employeeId?._id || req.user.employeeId;
    if (!employeeId) {
      return res.status(200).json({ success: true, data: [] });
    }

    const history = await Attendance.find({ employee: employeeId })
      .sort({ date: -1 })
      .limit(30);

    res.status(200).json({ success: true, count: history.length, data: history });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all employees attendance for a date (Admin / Manager)
// @route   GET /api/attendance/all
// @access  Private (Admin, Manager)
exports.getAllAttendanceByDate = async (req, res, next) => {
  try {
    const targetDate = req.query.date ? new Date(req.query.date) : new Date();
    targetDate.setHours(0, 0, 0, 0);

    const records = await Attendance.find({ date: targetDate })
      .populate({
        path: 'employee',
        select: 'firstName lastName employeeCode department designation',
        populate: { path: 'department', select: 'name' },
      })
      .sort({ clockIn: -1 });

    res.status(200).json({
      success: true,
      date: targetDate,
      count: records.length,
      data: records,
    });
  } catch (error) {
    next(error);
  }
};
