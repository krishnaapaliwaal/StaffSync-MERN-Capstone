import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Modal from '../components/Modal';
import StatusBadge from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';
import { CalendarCheck, Plus, Check, X, AlertCircle } from 'lucide-react';

export default function LeaveManagement() {
  const { isManager } = useAuth();
  const [myLeaves, setMyLeaves] = useState([]);
  const [allLeaves, setAllLeaves] = useState([]);
  const [activeTab, setActiveTab] = useState(isManager ? 'queue' : 'my');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Leave Form
  const [formData, setFormData] = useState({
    leaveType: 'Casual',
    startDate: '',
    endDate: '',
    reason: '',
  });
  const [formError, setFormError] = useState('');

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const myRes = await api.get('/leaves/my-leaves');
      setMyLeaves(myRes.data.data || []);

      if (isManager) {
        const allRes = await api.get('/leaves/all');
        setAllLeaves(allRes.data.data || []);
      }
    } catch (err) {
      console.error('Failed to load leave records', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleApply = async (e) => {
    e.preventDefault();
    setFormError('');

    try {
      await api.post('/leaves/apply', formData);
      setIsModalOpen(false);
      setFormData({ leaveType: 'Casual', startDate: '', endDate: '', reason: '' });
      fetchLeaves();
      setActiveTab('my');
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to apply for leave');
    }
  };

  const handleReview = async (id, status) => {
    const reviewRemarks = prompt(`Enter comments for ${status.toLowerCase()}ing this request (optional):`) || '';
    try {
      await api.put(`/leaves/${id}/status`, { status, reviewRemarks });
      fetchLeaves();
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Leave Portal</h2>
          <p className="text-sm text-slate-500 mt-1">
            Apply for time-off, track request statuses and review departmental requests
          </p>
        </div>
        <button
          onClick={() => {
            setFormError('');
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-sm transition flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Apply For Leave</span>
        </button>
      </div>

      {/* Tab Switcher if Manager */}
      {isManager && (
        <div className="flex border-b border-slate-200 gap-4">
          <button
            onClick={() => setActiveTab('queue')}
            className={`pb-3 text-sm font-semibold transition border-b-2 ${
              activeTab === 'queue'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Review Queue ({allLeaves.filter((l) => l.status === 'Pending').length} Pending)
          </button>
          <button
            onClick={() => setActiveTab('my')}
            className={`pb-3 text-sm font-semibold transition border-b-2 ${
              activeTab === 'my'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            My Submitted Applications ({myLeaves.length})
          </button>
        </div>
      )}

      {/* Main Table Content */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                {activeTab === 'queue' && <th className="py-3 px-4">Staff Member</th>}
                <th className="py-3 px-4">Leave Type</th>
                <th className="py-3 px-4">From</th>
                <th className="py-3 px-4">To</th>
                <th className="py-3 px-4">Days</th>
                <th className="py-3 px-4">Reason</th>
                <th className="py-3 px-4">Status</th>
                {activeTab === 'queue' && <th className="py-3 px-4 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-slate-400">
                    Loading records...
                  </td>
                </tr>
              ) : (activeTab === 'queue' ? allLeaves : myLeaves).length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-slate-400">
                    No leave requests found.
                  </td>
                </tr>
              ) : (
                (activeTab === 'queue' ? allLeaves : myLeaves).map((leave) => (
                  <tr key={leave._id} className="hover:bg-slate-50/50 transition">
                    {activeTab === 'queue' && (
                      <td className="py-3 px-4 font-semibold text-slate-800">
                        {leave.employee?.firstName} {leave.employee?.lastName}
                        <span className="block text-xs text-slate-400">
                          {leave.employee?.department?.name} • {leave.employee?.designation}
                        </span>
                      </td>
                    )}
                    <td className="py-3 px-4 font-medium text-slate-700">{leave.leaveType}</td>
                    <td className="py-3 px-4 text-xs text-slate-600">
                      {new Date(leave.startDate).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-600">
                      {new Date(leave.endDate).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{leave.totalDays}d</td>
                    <td className="py-3 px-4 text-xs text-slate-600 max-w-xs truncate">{leave.reason}</td>
                    <td className="py-3 px-4">
                      <StatusBadge status={leave.status} />
                    </td>
                    {activeTab === 'queue' && (
                      <td className="py-3 px-4 text-right">
                        {leave.status === 'Pending' ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleReview(leave._id, 'Approved')}
                              className="px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                            >
                              <Check className="w-3.5 h-3.5" />
                              Approve
                            </button>
                            <button
                              onClick={() => handleReview(leave._id, 'Rejected')}
                              className="px-2.5 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                            >
                              <X className="w-3.5 h-3.5" />
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">Decision Recorded</span>
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

      {/* Apply Leave Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Submit Leave Application"
      >
        {formError && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleApply} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Leave Category</label>
            <select
              value={formData.leaveType}
              onChange={(e) => setFormData({ ...formData, leaveType: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
            >
              <option value="Casual">Casual Leave</option>
              <option value="Sick">Sick Leave</option>
              <option value="Paid">Earned / Paid Leave</option>
              <option value="Unpaid">Unpaid Leave (LWP)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Start Date</label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">End Date</label>
              <input
                type="date"
                required
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Reason / Justification
            </label>
            <textarea
              required
              rows={3}
              placeholder="Provide reason for time off..."
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-sm transition"
            >
              Submit Application
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
