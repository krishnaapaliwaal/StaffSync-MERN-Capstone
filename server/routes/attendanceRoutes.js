const express = require('express');
const router = express.Router();
const {
  clockIn,
  clockOut,
  getTodayAttendance,
  getAttendanceHistory,
  getAllAttendanceByDate,
} = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.post('/clock-in', clockIn);
router.post('/clock-out', clockOut);
router.get('/today', getTodayAttendance);
router.get('/history', getAttendanceHistory);
router.get('/all', authorize('Admin', 'Manager'), getAllAttendanceByDate);

module.exports = router;
