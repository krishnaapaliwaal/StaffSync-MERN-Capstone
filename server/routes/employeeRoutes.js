const express = require('express');
const router = express.Router();
const {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} = require('../controllers/employeeController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getEmployees)
  .post(authorize('Admin', 'Manager'), createEmployee);

router.route('/:id')
  .get(getEmployeeById)
  .put(authorize('Admin', 'Manager'), updateEmployee)
  .delete(authorize('Admin'), deleteEmployee);

module.exports = router;
