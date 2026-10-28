import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import {
  Users,
  Building2,
  Clock,
  CalendarCheck,
  CheckCircle,
  XCircle,
  PlusCircle,
  TrendingUp,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user, isManager } = useAuth();
  const [stats, setStats] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [recentLeaves, setRecentLeaves] = useState([]);
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, todayAttRes] = await Promise.all([
        api.get('/dashboard/stats'),
        api.get('/attendance/today'),
      ]);

      setStats(statsRes.data.stats);
      setDepartments(statsRes.data.departmentDistribution || []);
      setRecentLeaves(statsRes.data.recentLeaves || []);
      setTodayAttendance(todayAttRes.data.data);
    } catch (err) {
      console.error('Failed to load dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleLeaveDecision = async (leaveId, status) => {
    try {
      await api.put(`/leaves/${leaveId}/status`, { status });
      fetchDashboardData();
    } catch (err) {
      alert('Failed to update leave status: ' + (err.response?.data?.message || err.message));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            Welcome back, {user?.name} 👋
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            StaffSync Workforce Intelligence & Operational Management Overview
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/attendance"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-sm transition flex items-center gap-1.5"
          >
            <Clock className="w-4 h-4" />
            <span>Attendance Terminal</span>
          </Link>
          <Link
            to="/leaves"
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition flex items-center gap-1.5"
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Leave Requests</span>
          </Link>
        </div>
      </div>

      {/* Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Workforce"
          value={stats?.totalEmployees || 0}
          subtitle={`${stats?.activeEmployees || 0} currently active`}
          icon={Users}
          color="indigo"
        />
        <StatCard
          title="Departments"
          value={stats?.totalDepartments || 0}
          subtitle="Operational units"
          icon={Building2}
          color="purple"
        />
        <StatCard
          title="Today's Attendance"
          value={`${stats?.attendanceRate || 0}%`}
          subtitle={`${stats?.todayAttendanceCount || 0} clocked in today`}
          icon={Clock}
          color="emerald"
        />
        <StatCard
          title="Pending Leaves"
          value={stats?.pendingLeavesCount || 0}
          subtitle="Requiring HR/Lead review"
          icon={CalendarCheck}
          color="amber"
        />
      </div>

      {/* Main Grid: Department Distribution & Recent Leaves */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Distribution (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-800">Department Headcount</h3>
              <p className="text-xs text-slate-500">Distribution of active employees</p>
            </div>
            <Link to="/departments" className="text-xs font-semibold text-indigo-600 hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {departments.length === 0 ? (
              <p className="text-sm text-slate-400 py-4">No department data available.</p>
            ) : (
              departments.map((dept) => {
                const total = stats?.activeEmployees || 1;
                const percentage = Math.round((dept.count / total) * 100);
                return (
                  <div key={dept.code} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-700">{dept.name} ({dept.code})</span>
                      <span className="text-slate-500">{dept.count} staff ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Today's Clock Status Pill Card (1 col) */}
        <div className="bg-gradient-to-br from-indigo-700 to-indigo-900 rounded-2xl p-6 text-white shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-200">
                My Attendance Today
              </span>
              <Clock className="w-4 h-4 text-indigo-200" />
            </div>
            <p className="text-2xl font-bold">
              {todayAttendance ? (
                <span>Clocked In: {new Date(todayAttendance.clockIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              ) : (
                <span>Not Clocked In Yet</span>
              )}
            </p>
            <p className="text-xs text-indigo-200 mt-2">
              {todayAttendance?.clockOut
                ? `Clocked out at ${new Date(todayAttendance.clockOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} (${todayAttendance.totalHours} hrs)`
                : todayAttendance
                ? 'Work session in progress'
                : 'Click below to log your start of day'}
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-indigo-600/50">
            <Link
              to="/attendance"
              className="w-full inline-block text-center py-2 px-4 bg-white text-indigo-700 hover:bg-indigo-50 rounded-xl text-xs font-bold transition shadow"
            >
              Go to Clock Terminal
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Leave Requests Section */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-800">Recent Leave Requests</h3>
            <p className="text-xs text-slate-500">Self-service employee time-off pipeline</p>
          </div>
          <Link to="/leaves" className="text-xs font-semibold text-indigo-600 hover:underline">
            Manage Leaves
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase bg-slate-50 text-slate-500 border-y border-slate-200">
              <tr>
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4">Reason</th>
                <th className="py-3 px-4">Status</th>
                {isManager && <th className="py-3 px-4 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentLeaves.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-slate-400">
                    No leave requests found.
                  </td>
                </tr>
              ) : (
                recentLeaves.map((leave) => (
                  <tr key={leave._id} className="hover:bg-slate-50/50 transition">
                    <td className="py-3 px-4 font-medium text-slate-800">
                      {leave.employee?.firstName} {leave.employee?.lastName}
                      <span className="block text-xs text-slate-400">{leave.employee?.designation}</span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-600">{leave.leaveType}</td>
                    <td className="py-3 px-4 text-xs text-slate-600">
                      {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                      <span className="block text-slate-400">({leave.totalDays} days)</span>
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-600 max-w-xs truncate">{leave.reason}</td>
                    <td className="py-3 px-4">
                      <StatusBadge status={leave.status} />
                    </td>
                    {isManager && (
                      <td className="py-3 px-4 text-right">
                        {leave.status === 'Pending' ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleLeaveDecision(leave._id, 'Approved')}
                              title="Approve"
                              className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                            >
                              <CheckCircle className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleLeaveDecision(leave._id, 'Rejected')}
                              title="Reject"
                              className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                            >
                              <XCircle className="w-5 h-5" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">Resolved</span>
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
    </div>
  );
}
