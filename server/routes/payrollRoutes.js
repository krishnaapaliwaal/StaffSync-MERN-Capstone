const express = require('express');
const router = express.Router();
const {
  generateMonthlyPayroll,
  getPayrollByMonth,
  getMyPayslips,
  updatePayrollStatus,
} = require('../controllers/payrollController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.post('/generate', authorize('Admin'), generateMonthlyPayroll);
router.get('/month', authorize('Admin'), getPayrollByMonth);
router.get('/my-payslips', getMyPayslips);
router.put('/:id/status', authorize('Admin'), updatePayrollStatus);

module.exports = router;
