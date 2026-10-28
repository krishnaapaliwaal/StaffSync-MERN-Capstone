import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Modal from '../components/Modal';
import { useAuth } from '../context/AuthContext';
import { Building2, Plus, Users, ShieldAlert, Trash2 } from 'lucide-react';

export default function DepartmentList() {
  const { isAdmin } = useAuth();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', code: '', description: '' });
  const [formError, setFormError] = useState('');

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const res = await api.get('/departments');
      setDepartments(res.data.data);
    } catch (err) {
      console.error('Failed to load departments', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormError('');
    try {
      await api.post('/departments', formData);
      setIsModalOpen(false);
      setFormData({ name: '', code: '', description: '' });
      fetchDepartments();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to create department');
    }
  };

  const handleDelete = async (id, name, count) => {
    if (count > 0) {
      alert(`Cannot delete "${name}" because it currently has ${count} assigned employees.`);
      return;
    }
    if (window.confirm(`Are you sure you want to delete the department "${name}"?`)) {
      try {
        await api.delete(`/departments/${id}`);
        fetchDepartments();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete department.');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Department Management</h2>
          <p className="text-sm text-slate-500 mt-1">
            Organizational structure, business units and designated leads
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => {
              setFormData({ name: '', code: '', description: '' });
              setFormError('');
              setIsModalOpen(true);
            }}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-sm transition flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Create Department</span>
          </button>
        )}
      </div>

      {/* Grid of Department Cards */}
      {loading ? (
        <div className="text-center py-12 text-slate-400">Loading departments...</div>
      ) : departments.length === 0 ? (
        <div className="text-center py-12 text-slate-400">No departments configured yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((dept) => (
            <div
              key={dept._id}
              className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-mono font-bold text-xs uppercase">
                    {dept.code}
                  </span>
                  {isAdmin && (
                    <button
                      onClick={() => handleDelete(dept._id, dept.name, dept.employeeCount)}
                      className="text-slate-300 hover:text-rose-600 transition"
                      title="Delete Department"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <h3 className="text-lg font-bold text-slate-800">{dept.name}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {dept.description || 'No description provided.'}
                </p>

                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Department Lead</span>
                  <span className="font-semibold text-slate-700">
                    {dept.manager ? `${dept.manager.firstName} ${dept.manager.lastName}` : 'Not Assigned'}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600">
                  <Users className="w-4 h-4" />
                  <span>{dept.employeeCount || 0} Members</span>
                </div>
                <span className="text-xs text-slate-400">Active</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Department"
      >
        {formError && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 flex-shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Department Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Quality Assurance"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Department Code (Short 2-4 chars)
            </label>
            <input
              type="text"
              required
              placeholder="e.g. QA"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs uppercase"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Description / Responsibilities
            </label>
            <textarea
              rows={3}
              placeholder="Brief overview of department functions..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
              Create Department
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
