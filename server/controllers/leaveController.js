const Leave = require('../models/Leave');
const Employee = require('../models/Employee');

// @desc    Apply for a leave
// @route   POST /api/leaves/apply
// @access  Private
exports.applyLeave = async (req, res, next) => {
  try {
    const employeeId = req.user.employeeId?._id || req.user.employeeId;
    if (!employeeId) {
      return res.status(400).json({ success: false, message: 'No employee profile linked to this user' });
    }

    const { leaveType, startDate, endDate, reason } = req.body;

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < start) {
      return res.status(400).json({ success: false, message: 'End date cannot be earlier than start date.' });
    }

    // Calculate business/calendar days difference
    const diffTime = Math.abs(end - start);
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const leave = await Leave.create({
      employee: employeeId,
      leaveType,
      startDate: start,
      endDate: end,
      totalDays,
      reason,
      status: 'Pending',
    });

    res.status(201).json({
      success: true,
      message: 'Leave application submitted successfully',
      data: leave,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's leaves
// @route   GET /api/leaves/my-leaves
// @access  Private
exports.getMyLeaves = async (req, res, next) => {
  try {
    const employeeId = req.user.employeeId?._id || req.user.employeeId;
    if (!employeeId) {
      return res.status(200).json({ success: true, data: [] });
    }

    const leaves = await Leave.find({ employee: employeeId }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: leaves.length, data: leaves });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all leave requests (Admin, Manager)
// @route   GET /api/leaves/all
// @access  Private (Admin, Manager)
exports.getAllLeaves = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status) query.status = status;

    const leaves = await Leave.find(query)
      .populate({
        path: 'employee',
        select: 'firstName lastName employeeCode department designation',
        populate: { path: 'department', select: 'name' },
      })
      .populate('reviewedBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: leaves.length, data: leaves });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve or Reject a leave request
// @route   PUT /api/leaves/:id/status
// @access  Private (Admin, Manager)
exports.updateLeaveStatus = async (req, res, next) => {
  try {
    const { status, reviewRemarks } = req.body;

    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Status must be either Approved or Rejected' });
    }

    const leave = await Leave.findById(req.params.id);
    if (!leave) {
      return res.status(404).json({ success: false, message: 'Leave request not found' });
    }

    leave.status = status;
    leave.reviewedBy = req.user._id;
    leave.reviewedAt = new Date();
    if (reviewRemarks) leave.reviewRemarks = reviewRemarks;

    await leave.save();

    res.status(200).json({
      success: true,
      message: `Leave request marked as ${status}`,
      data: leave,
    });
  } catch (error) {
    next(error);
  }
};
