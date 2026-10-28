import React from 'react';

const badgeStyles = {
  // Employment & User status
  Active: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  Inactive: 'bg-slate-100 text-slate-700 border-slate-200',
  Terminated: 'bg-rose-100 text-rose-800 border-rose-200',

  // Attendance status
  Present: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  Late: 'bg-amber-100 text-amber-800 border-amber-200',
  'Half-Day': 'bg-blue-100 text-blue-800 border-blue-200',
  Absent: 'bg-rose-100 text-rose-800 border-rose-200',
  'On-Leave': 'bg-purple-100 text-purple-800 border-purple-200',

  // Leave / Payroll status
  Approved: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  Paid: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  Pending: 'bg-amber-100 text-amber-800 border-amber-200',
  Draft: 'bg-slate-100 text-slate-700 border-slate-200',
  Processed: 'bg-blue-100 text-blue-800 border-blue-200',
  Rejected: 'bg-rose-100 text-rose-800 border-rose-200',
};

export default function StatusBadge({ status }) {
  const currentStyle = badgeStyles[status] || 'bg-slate-100 text-slate-700 border-slate-200';

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${currentStyle}`}
    >
      <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-current opacity-70"></span>
      {status}
    </span>
  );
}
