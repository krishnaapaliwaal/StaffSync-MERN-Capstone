const Employee = require('../models/Employee');
const Department = require('../models/Department');

// @desc    Get all employees with search & filters
// @route   GET /api/employees
// @access  Private (Admin, Manager)
exports.getEmployees = async (req, res, next) => {
  try {
    const { department, status, search, limit = 50, page = 1 } = req.query;
    const query = {};

    if (department) {
      query.department = department;
    }

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { employeeCode: { $regex: search, $options: 'i' } },
        { designation: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Employee.countDocuments(query);
    const employees = await Employee.find(query)
      .populate('department', 'name code')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      count: employees.length,
      data: employees,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single employee by ID
// @route   GET /api/employees/:id
// @access  Private
exports.getEmployeeById = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id).populate('department', 'name code manager');
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }
    res.status(200).json({ success: true, data: employee });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new employee
// @route   POST /api/employees
// @access  Private (Admin, Manager)
exports.createEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.create(req.body);
    const populated = await Employee.findById(employee._id).populate('department', 'name code');
    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    next(error);
  }
};

// @desc    Update employee
// @route   PUT /api/employees/:id
// @access  Private (Admin, Manager)
exports.updateEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('department', 'name code');

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    res.status(200).json({ success: true, data: employee });
  } catch (error) {
    next(error);
  }
};

// @desc    Deactivate / Delete employee
// @route   DELETE /api/employees/:id
// @access  Private (Admin)
exports.deleteEmployee = async (req, res, next) => {
  try {
    // Soft delete by setting status to Terminated or removing
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      { status: 'Terminated' },
      { new: true }
    );

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    res.status(200).json({ success: true, message: 'Employee deactivated successfully', data: employee });
  } catch (error) {
    next(error);
  }
};
