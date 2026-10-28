const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: () => {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        return d;
      },
    },
    clockIn: {
      type: Date,
      default: Date.now,
    },
    clockOut: {
      type: Date,
      default: null,
    },
    totalHours: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['Present', 'Late', 'Half-Day', 'Absent', 'On-Leave'],
      default: 'Present',
    },
    remarks: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

// Unique compound index so one employee has only one record per calendar date
attendanceSchema.index({ employee: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
