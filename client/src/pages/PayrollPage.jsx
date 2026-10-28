import React, { useState, useEffect } from 'react';
import api from '../services/api';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import { useAuth } from '../context/AuthContext';
import { CreditCard, Play, CheckCircle2, FileText, Download, DollarSign } from 'lucide-react';

export default function PayrollPage() {
  const { isAdmin } = useAuth();
  const [payrolls, setPayrolls] = useState([]);
  const [myPayslips, setMyPayslips] = useState([]);
  const [totalPayout, setTotalPayout] = useState(0);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  // Selected payslip modal
  const [selectedPayslip, setSelectedPayslip] = useState(null);

  const fetchPayroll = async () => {
    try {
      setLoading(true);
      if (isAdmin) {
        const res = await api.get('/payroll/month', { params: { month, year } });
        setPayrolls(res.data.data || []);
        setTotalPayout(res.data.totalPayout || 0);
      } else {
        const res = await api.get('/payroll/my-payslips');
        setMyPayslips(res.data.data || []);
      }
    } catch (err) {
      console.error('Failed to load payroll data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayroll();
  }, [month, year, isAdmin]);

  const handleGenerate = async () => {
    try {
      setGenerating(true);
      await api.post('/payroll/generate', { month: Number(month), year: Number(year) });
      alert(`Payroll generated successfully for ${month}/${year}`);
      fetchPayroll();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to generate payroll');
    } finally {
      setGenerating(false);
    }
  };

  const handleMarkAsPaid = async (id) => {
    try {
      await api.put(`/payroll/${id}/status`, { status: 'Paid', paymentMethod: 'Bank Transfer' });
      fetchPayroll();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update payroll status');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Payroll & Compensation</h2>
          <p className="text-sm text-slate-500 mt-1">
            Automated monthly compensation calculation, tax/deduction adjustments, and digital payslips
          </p>
        </div>

        {isAdmin && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-medium">
              <select
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                className="bg-transparent border-0 py-1 px-2 focus:ring-0 text-slate-700"
              >
                {[...Array(12).keys()].map((m) => (
                  <option key={m + 1} value={m + 1}>
                    {new Date(0, m).toLocaleString('default', { month: 'long' })}
                  </option>
                ))}
              </select>
              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="bg-transparent border-0 py-1 px-2 focus:ring-0 text-slate-700"
              >
                <option value={2025}>2025</option>
                <option value={2026}>2026</option>
              </select>
            </div>

            <button
              onClick={handleGenerate}
              disabled={generating}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-sm transition flex items-center gap-1.5 disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5" />
              <span>{generating ? 'Calculating...' : 'Compute Month Payroll'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Admin Summary Cards */}
      {isAdmin && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
            <p className="text-xs font-semibold text-slate-500 uppercase">Selected Cycle</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">
              {new Date(year, month - 1).toLocaleString('default', { month: 'long' })} {year}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
            <p className="text-xs font-semibold text-slate-500 uppercase">Employees Processed</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{payrolls.length} Records</p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
            <p className="text-xs font-semibold text-slate-500 uppercase">Total Net Disbursement</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">
              ₹{totalPayout.toLocaleString('en-IN')}
            </p>
          </div>
        </div>
      )}

      {/* Table Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                {isAdmin && <th className="py-3 px-4">Staff Member</th>}
                <th className="py-3 px-4">Period</th>
                <th className="py-3 px-4">Basic Pay</th>
                <th className="py-3 px-4">Allowances</th>
                <th className="py-3 px-4">Deductions</th>
                <th className="py-3 px-4 font-bold text-slate-700">Net Salary</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Payslip</th>
                {isAdmin && <th className="py-3 px-4 text-right">Disburse</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={9} className="text-center py-10 text-slate-400">
                    Loading payroll data...
                  </td>
                </tr>
              ) : (isAdmin ? payrolls : myPayslips).length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-10 text-slate-400">
                    No payroll records generated for this cycle.
                  </td>
                </tr>
              ) : (
                (isAdmin ? payrolls : myPayslips).map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50/50 transition">
                    {isAdmin && (
                      <td className="py-3 px-4 font-semibold text-slate-800">
                        {p.employee?.firstName} {p.employee?.lastName}
                        <span className="block text-xs text-slate-400">
                          {p.employee?.employeeCode} • {p.employee?.designation}
                        </span>
                      </td>
                    )}
                    <td className="py-3 px-4 text-xs font-medium text-slate-600">
                      {new Date(p.year, p.month - 1).toLocaleString('default', { month: 'short' })} {p.year}
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-600">₹{p.basicSalary.toLocaleString()}</td>
                    <td className="py-3 px-4 text-xs text-emerald-600">+₹{p.allowances.toLocaleString()}</td>
                    <td className="py-3 px-4 text-xs text-rose-600">-₹{p.deductions.toLocaleString()}</td>
                    <td className="py-3 px-4 font-bold text-slate-800">
                      ₹{p.netSalary.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedPayslip(p)}
                        className="inline-flex items-center gap-1 text-xs text-indigo-600 font-medium hover:underline"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        View Slip
                      </button>
                    </td>
                    {isAdmin && (
                      <td className="py-3 px-4 text-right">
                        {p.status !== 'Paid' ? (
                          <button
                            onClick={() => handleMarkAsPaid(p._id)}
                            className="px-2.5 py-1 text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition"
                          >
                            Mark Paid
                          </button>
                        ) : (
                          <span className="text-xs text-emerald-600 flex items-center justify-end gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Disbursed
                          </span>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payslip Modal Dialog */}
      <Modal
        isOpen={!!selectedPayslip}
        onClose={() => setSelectedPayslip(null)}
        title="Official Salary Statement / Payslip"
        maxWidth="max-w-xl"
      >
        {selectedPayslip && (
          <div className="space-y-6 p-2">
            {/* Header branding */}
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">StaffSync Enterprises Inc.</h3>
                <p className="text-xs text-slate-500">Corporate HR & Payroll Department</p>
                <p className="text-xs text-slate-400 mt-1">
                  Pay Period: {new Date(selectedPayslip.year, selectedPayslip.month - 1).toLocaleString('default', { month: 'long' })} {selectedPayslip.year}
                </p>
              </div>
              <div className="text-right">
                <StatusBadge status={selectedPayslip.status} />
                <p className="text-[10px] text-slate-400 mt-1 font-mono">
                  REF: PAY-{selectedPayslip._id.slice(-6).toUpperCase()}
                </p>
              </div>
            </div>

            {/* Employee info */}
            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl text-xs">
              <div>
                <span className="text-slate-400 block">Employee Name</span>
                <span className="font-semibold text-slate-800">
                  {selectedPayslip.employee?.firstName} {selectedPayslip.employee?.lastName}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Employee Code</span>
                <span className="font-mono font-semibold text-slate-800">
                  {selectedPayslip.employee?.employeeCode}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Department</span>
                <span className="font-semibold text-slate-800">
                  {selectedPayslip.employee?.department?.name || 'General'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Designation</span>
                <span className="font-semibold text-slate-800">
                  {selectedPayslip.employee?.designation || 'Staff'}
                </span>
              </div>
            </div>

            {/* Compensation breakdown */}
            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <div className="grid grid-cols-2 bg-slate-100 p-2.5 font-bold text-slate-700">
                <span>Earnings & Allowances</span>
                <span className="text-right">Amount (₹)</span>
              </div>
              <div className="divide-y divide-slate-100 p-2.5 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-600">Basic Wage</span>
                  <span className="font-semibold text-slate-800">₹{selectedPayslip.basicSalary.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-slate-600">Special Allowances & HRA</span>
                  <span className="font-semibold text-emerald-600">+₹{selectedPayslip.allowances.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-slate-600">Statutory Deductions & Taxes</span>
                  <span className="font-semibold text-rose-600">-₹{selectedPayslip.deductions.toLocaleString()}</span>
                </div>
                {selectedPayslip.unpaidLeaveDays > 0 && (
                  <div className="flex justify-between pt-1 text-slate-500">
                    <span>Unpaid Leave Days</span>
                    <span>{selectedPayslip.unpaidLeaveDays} days docked</span>
                  </div>
                )}
              </div>
              <div className="bg-slate-50 p-3 flex justify-between items-center border-t border-slate-200">
                <span className="font-bold text-slate-800 text-sm">Net Payable Salary</span>
                <span className="font-bold text-indigo-700 text-base">
                  ₹{selectedPayslip.netSalary.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Print / Save PDF</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedPayslip(null)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
