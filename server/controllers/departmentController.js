const Department = require('../models/Department');
const Employee = require('../models/Employee');

// @desc    Get all departments with member count
// @route   GET /api/departments
// @access  Private
exports.getDepartments = async (req, res, next) => {
  try {
    const departments = await Department.find().populate('manager', 'firstName lastName email').lean();

    // Attach count of active employees in each department
    const departmentsWithCounts = await Promise.all(
      departments.map(async (dept) => {
        const count = await Employee.countDocuments({ department: dept._id, status: 'Active' });
        return { ...dept, employeeCount: count };
      })
    );

    res.status(200).json({
      success: true,
      count: departmentsWithCounts.length,
      data: departmentsWithCounts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new department
// @route   POST /api/departments
// @access  Private (Admin)
exports.createDepartment = async (req, res, next) => {
  try {
    const department = await Department.create(req.body);
    res.status(201).json({ success: true, data: department });
  } catch (error) {
    next(error);
  }
};

// @desc    Update department
// @route   PUT /api/departments/:id
// @access  Private (Admin)
exports.updateDepartment = async (req, res, next) => {
  try {
    const department = await Department.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!department) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }

    res.status(200).json({ success: true, data: department });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete department
// @route   DELETE /api/departments/:id
// @access  Private (Admin)
exports.deleteDepartment = async (req, res, next) => {
  try {
    const employeeCount = await Employee.countDocuments({ department: req.params.id });
    if (employeeCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete department. There are ${employeeCount} active employees assigned to it.`,
      });
    }

    const department = await Department.findByIdAndDelete(req.params.id);
    if (!department) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }

    res.status(200).json({ success: true, message: 'Department removed successfully' });
  } catch (error) {
    next(error);
  }
};
