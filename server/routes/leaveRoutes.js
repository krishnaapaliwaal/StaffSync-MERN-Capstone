const express = require('express');
const router = express.Router();
const {
  applyLeave,
  getMyLeaves,
  getAllLeaves,
  updateLeaveStatus,
} = require('../controllers/leaveController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.post('/apply', applyLeave);
router.get('/my-leaves', getMyLeaves);
router.get('/all', authorize('Admin', 'Manager'), getAllLeaves);
router.put('/:id/status', authorize('Admin', 'Manager'), updateLeaveStatus);

module.exports = router;
