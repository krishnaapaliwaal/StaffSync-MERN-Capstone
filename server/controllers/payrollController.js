const Payroll = require('../models/Payroll');
const Employee = require('../models/Employee');
const Leave = require('../models/Leave');

// @desc    Generate monthly payroll for all active employees
// @route   POST /api/payroll/generate
// @access  Private (Admin)
exports.generateMonthlyPayroll = async (req, res, next) => {
  try {
    const { month, year } = req.body;

    if (!month || !year) {
      return res.status(400).json({ success: false, message: 'Please provide month and year' });
    }

    const activeEmployees = await Employee.find({ status: 'Active' });
    const generatedPayrolls = [];

    for (const emp of activeEmployees) {
      // Check if payroll already exists for this employee, month, year
      let existing = await Payroll.findOne({ employee: emp._id, month, year });

      const basic = emp.salary?.basic || 30000;
      const allowance = emp.salary?.allowance || 5000;
      const baseDeductions = emp.salary?.deductions || 2000;

      // Calculate unpaid leaves in this month
      const startOfMonth = new Date(year, month - 1, 1);
      const endOfMonth = new Date(year, month, 0);

      const unpaidLeaves = await Leave.find({
        employee: emp._id,
        leaveType: 'Unpaid',
        status: 'Approved',
        startDate: { $gte: startOfMonth },
        endDate: { $lte: endOfMonth },
      });

      const unpaidDays = unpaidLeaves.reduce((acc, curr) => acc + curr.totalDays, 0);
      const dailyRate = Math.round(basic / 30);
      const unpaidDeduction = unpaidDays * dailyRate;

      const totalDeductions = baseDeductions + unpaidDeduction;
      const netSalary = basic + allowance - totalDeductions;

      if (existing) {
        // Update existing record
        existing.basicSalary = basic;
        existing.allowances = allowance;
        existing.deductions = totalDeductions;
        existing.netSalary = netSalary;
        existing.unpaidLeaveDays = unpaidDays;
        await existing.save();
        generatedPayrolls.push(existing);
      } else {
        const newRecord = await Payroll.create({
          employee: emp._id,
          month,
          year,
          basicSalary: basic,
          allowances: allowance,
          deductions: totalDeductions,
          netSalary,
          unpaidLeaveDays: unpaidDays,
          status: 'Draft',
        });
        generatedPayrolls.push(newRecord);
      }
    }

    res.status(201).json({
      success: true,
      message: `Payroll calculated for ${generatedPayrolls.length} employees`,
      count: generatedPayrolls.length,
      data: generatedPayrolls,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get payroll by month and year
// @route   GET /api/payroll/month
// @access  Private (Admin)
exports.getPayrollByMonth = async (req, res, next) => {
  try {
    const { month, year } = req.query;
    const query = {};
    if (month) query.month = Number(month);
    if (year) query.year = Number(year);

    const payrolls = await Payroll.find(query)
      .populate({
        path: 'employee',
        select: 'firstName lastName employeeCode department designation',
        populate: { path: 'department', select: 'name' },
      })
      .sort({ createdAt: -1 });

    const totalPayout = payrolls.reduce((sum, p) => sum + p.netSalary, 0);

    res.status(200).json({
      success: true,
      totalPayout,
      count: payrolls.length,
      data: payrolls,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current employee's payslips
// @route   GET /api/payroll/my-payslips
// @access  Private
exports.getMyPayslips = async (req, res, next) => {
  try {
    const employeeId = req.user.employeeId?._id || req.user.employeeId;
    if (!employeeId) {
      return res.status(200).json({ success: true, data: [] });
    }

    const payslips = await Payroll.find({ employee: employeeId }).sort({ year: -1, month: -1 });

    res.status(200).json({ success: true, count: payslips.length, data: payslips });
  } catch (error) {
    next(error);
  }
};

// @desc    Update payroll status (e.g. Mark as Paid)
// @route   PUT /api/payroll/:id/status
// @access  Private (Admin)
exports.updatePayrollStatus = async (req, res, next) => {
  try {
    const { status, paymentMethod } = req.body;

    const payroll = await Payroll.findById(req.params.id);
    if (!payroll) {
      return res.status(404).json({ success: false, message: 'Payroll record not found' });
    }

    payroll.status = status;
    if (paymentMethod) payroll.paymentMethod = paymentMethod;
    if (status === 'Paid') payroll.paymentDate = new Date();

    await payroll.save();

    res.status(200).json({ success: true, message: `Payroll status updated to ${status}`, data: payroll });
  } catch (error) {
    next(error);
  }
};
