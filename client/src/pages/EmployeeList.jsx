import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Modal from '../components/Modal';
import StatusBadge from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  Search,
  Plus,
  Filter,
  Edit2,
  Trash2,
  Mail,
  Phone,
  Briefcase,
  AlertCircle,
} from 'lucide-react';

export default function EmployeeList() {
  const { isAdmin } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formData, setFormData] = useState({
    employeeCode: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: '',
    designation: '',
    employmentType: 'Full-time',
    salary: { basic: 40000, allowance: 6000, deductions: 2000 },
    status: 'Active',
  });
  const [formError, setFormError] = useState('');

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (selectedDept) params.department = selectedDept;

      const res = await api.get('/employees', { params });
      setEmployees(res.data.data);
    } catch (err) {
      console.error('Failed to load employees', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await api.get('/departments');
      setDepartments(res.data.data);
    } catch (err) {
      console.error('Failed to load departments', err);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchEmployees();
    }, 300);
    return () => clearTimeout(delay);
  }, [search, selectedDept]);

  const openCreateModal = () => {
    setEditingEmployee(null);
    setFormData({
      employeeCode: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      department: departments[0]?._id || '',
      designation: '',
      employmentType: 'Full-time',
      salary: { basic: 40000, allowance: 6000, deductions: 2000 },
      status: 'Active',
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (emp) => {
    setEditingEmployee(emp);
    setFormData({
      employeeCode: emp.employeeCode,
      firstName: emp.firstName,
      lastName: emp.lastName,
      email: emp.email,
      phone: emp.phone,
      department: emp.department?._id || emp.department,
      designation: emp.designation,
      employmentType: emp.employmentType,
      salary: {
        basic: emp.salary?.basic || 40000,
        allowance: emp.salary?.allowance || 6000,
        deductions: emp.salary?.deductions || 2000,
      },
      status: emp.status,
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    try {
      if (editingEmployee) {
        await api.put(`/employees/${editingEmployee._id}`, formData);
      } else {
        await api.post('/employees', formData);
      }
      setIsModalOpen(false);
      fetchEmployees();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save employee.');
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to deactivate employee "${name}"?`)) {
      try {
        await api.delete(`/employees/${id}`);
        fetchEmployees();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to deactivate employee.');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Employee Directory</h2>
          <p className="text-sm text-slate-500 mt-1">
            Manage company personnel, designations, and departmental allocations
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-sm transition flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Onboard Employee</span>
          </button>
        )}
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, code or role..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Departments</option>
            {departments.map((d) => (
              <option key={d._id} value={d._id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Code</th>
                <th className="py-3.5 px-4">Employee</th>
                <th className="py-3.5 px-4">Department & Role</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Status</th>
                {isAdmin && <th className="py-3.5 px-4 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-400">
                    Loading employee directory...
                  </td>
                </tr>
              ) : employees.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-400">
                    No employees matching criteria.
                  </td>
                </tr>
              ) : (
                employees.map((emp) => (
                  <tr key={emp._id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3.5 px-4 font-mono text-xs text-indigo-700 font-bold">
                      {emp.employeeCode}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-800">
                        {emp.firstName} {emp.lastName}
                      </p>
                      <p className="text-xs text-slate-400">{emp.email}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="text-slate-800 font-medium">{emp.designation}</p>
                      <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                        {emp.department?.name || 'Unassigned'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-600">
                      <p className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        {emp.phone}
                      </p>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-600 font-medium">
                      {emp.employmentType}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={emp.status} />
                    </td>
                    {isAdmin && (
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openEditModal(emp)}
                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                            title="Edit Profile"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(emp._id, `${emp.firstName} ${emp.lastName}`)}
                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            title="Deactivate"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingEmployee ? 'Edit Employee Details' : 'Onboard New Staff Member'}
        maxWidth="max-w-2xl"
      >
        {formError && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Code</label>
              <input
                type="text"
                required
                value={formData.employeeCode}
                onChange={(e) => setFormData({ ...formData, employeeCode: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs uppercase"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">First Name</label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Last Name</label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Phone</label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Department</label>
              <select
                required
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
              >
                <option value="">Select Department</option>
                {departments.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.name} ({d.code})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Designation</label>
              <input
                type="text"
                required
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Employment Type</label>
              <select
                value={formData.employmentType}
                onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Intern">Intern</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Basic Salary (₹)</label>
              <input
                type="number"
                required
                value={formData.salary.basic}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    salary: { ...formData.salary, basic: Number(e.target.value) },
                  })
                }
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Terminated">Terminated</option>
              </select>
            </div>
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
              {editingEmployee ? 'Save Changes' : 'Confirm Onboarding'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
