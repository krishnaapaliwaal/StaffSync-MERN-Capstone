import React, { useState, useEffect } from 'react';
import api from '../services/api';
import StatusBadge from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';
import { Clock, CheckCircle, LogOut, Calendar, AlertCircle } from 'lucide-react';

export default function AttendancePage() {
  const { isManager } = useAuth();
  const [todayRecord, setTodayRecord] = useState(null);
  const [personalHistory, setPersonalHistory] = useState([]);
  const [companyAttendance, setCompanyAttendance] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });

  // Digital Clock timer
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const [todayRes, historyRes] = await Promise.all([
        api.get('/attendance/today'),
        api.get('/attendance/history'),
      ]);
      setTodayRecord(todayRes.data.data);
      setPersonalHistory(historyRes.data.data || []);

      if (isManager) {
        const compRes = await api.get('/attendance/all', {
          params: { date: selectedDate },
        });
        setCompanyAttendance(compRes.data.data || []);
      }
    } catch (err) {
      console.error('Failed to load attendance records', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [selectedDate]);

  const handleClockIn = async () => {
    try {
      setActionLoading(true);
      const res = await api.post('/attendance/clock-in');
      setTodayRecord(res.data.data);
      setMsg({ text: 'Clock-in recorded successfully!', type: 'success' });
      fetchAttendance();
    } catch (err) {
      setMsg({ text: err.response?.data?.message || 'Failed to clock in', type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleClockOut = async () => {
    try {
      setActionLoading(true);
      const res = await api.post('/attendance/clock-out');
      setTodayRecord(res.data.data);
      setMsg({ text: 'Clock-out recorded. Have a great evening!', type: 'success' });
      fetchAttendance();
    } catch (err) {
      setMsg({ text: err.response?.data?.message || 'Failed to clock out', type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Attendance Terminal</h2>
          <p className="text-sm text-slate-500 mt-1">
            Automated work session tracking, clock-in timestamps, and work hours calculation
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 bg-slate-100 px-4 py-2 rounded-xl">
          <Calendar className="w-4 h-4 text-indigo-600" />
          <span>{currentTime.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
        </div>
      </div>

      {msg.text && (
        <div
          className={`p-4 rounded-xl text-sm flex items-center gap-2 border ${
            msg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          {msg.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{msg.text}</span>
        </div>
      )}

      {/* Terminal Widget Card */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-2xl p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left space-y-2">
          <span className="text-xs font-semibold tracking-wider uppercase text-indigo-300">
            System Local Time
          </span>
          <div className="text-4xl sm:text-5xl font-mono font-bold tracking-tight text-white">
            {currentTime.toLocaleTimeString()}
          </div>
          <p className="text-xs text-slate-400">
            Shift Standard: 09:30 AM – 06:30 PM (Grace limit: 10:15 AM)
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          {!todayRecord ? (
            <button
              onClick={handleClockIn}
              disabled={actionLoading}
              className="w-full sm:w-auto px-6 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/25 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <CheckCircle className="w-5 h-5" />
              <span>{actionLoading ? 'Recording...' : 'Clock In Now'}</span>
            </button>
          ) : !todayRecord.clockOut ? (
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
              <div className="px-4 py-2 bg-slate-800/80 rounded-xl border border-slate-700 text-xs">
                <span className="text-slate-400 block">Clocked In At</span>
                <span className="font-semibold text-white">
                  {new Date(todayRecord.clockIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <button
                onClick={handleClockOut}
                disabled={actionLoading}
                className="w-full sm:w-auto px-6 py-3.5 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl shadow-lg shadow-rose-500/25 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <LogOut className="w-5 h-5" />
                <span>{actionLoading ? 'Recording...' : 'Clock Out'}</span>
              </button>
            </div>
          ) : (
            <div className="bg-slate-800/90 rounded-xl p-4 border border-slate-700 text-center">
              <span className="text-xs text-emerald-400 font-semibold block mb-1">✓ Session Completed</span>
              <p className="text-sm font-semibold text-white">
                Total: {todayRecord.totalHours} hrs worked today
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Tabs / Multi-view */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal History */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
          <h3 className="text-base font-bold text-slate-800 mb-1">My Recent Attendance</h3>
          <p className="text-xs text-slate-500 mb-4">Past 30 days of personal punch logs</p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase border-y border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">In</th>
                  <th className="py-2.5 px-3">Out</th>
                  <th className="py-2.5 px-3">Hours</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {personalHistory.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-slate-400">
                      No logs recorded yet.
                    </td>
                  </tr>
                ) : (
                  personalHistory.map((rec) => (
                    <tr key={rec._id} className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-3 font-medium text-slate-800">
                        {new Date(rec.date).toLocaleDateString()}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600">
                        {new Date(rec.clockIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600">
                        {rec.clockOut
                          ? new Date(rec.clockOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                          : '—'}
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-slate-700">{rec.totalHours || 0}h</td>
                      <td className="py-2.5 px-3">
                        <StatusBadge status={rec.status} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Company Attendance for Selected Date (Managers / Admin) */}
        {isManager ? (
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-800">Workforce Daily Sheet</h3>
                <p className="text-xs text-slate-500">Live check-ins for the selected date</p>
              </div>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase border-y border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Staff Member</th>
                    <th className="py-2.5 px-3">Dept</th>
                    <th className="py-2.5 px-3">Clock In</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {companyAttendance.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-6 text-slate-400">
                        No employees clocked in for this date.
                      </td>
                    </tr>
                  ) : (
                    companyAttendance.map((rec) => (
                      <tr key={rec._id} className="hover:bg-slate-50/50">
                        <td className="py-2.5 px-3 font-medium text-slate-800">
                          {rec.employee?.firstName} {rec.employee?.lastName}
                          <span className="block text-[10px] text-slate-400">{rec.employee?.employeeCode}</span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-600">
                          {rec.employee?.department?.name || '—'}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600">
                          {new Date(rec.clockIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="py-2.5 px-3">
                          <StatusBadge status={rec.status} />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-indigo-50/50 rounded-2xl p-6 border border-indigo-100 flex flex-col justify-center text-center">
            <Clock className="w-10 h-10 text-indigo-600 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-800">Daily Punctuality Tips</h4>
            <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto">
              Ensure you clock in before 10:15 AM each morning. Clock out upon completion of work to ensure accurate payroll calculation.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
