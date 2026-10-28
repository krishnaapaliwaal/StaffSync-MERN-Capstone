import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Building2,
  Clock,
  CalendarCheck,
  CreditCard,
  ShieldCheck,
} from 'lucide-react';

export default function Sidebar() {
  const { user, isAdmin, isManager } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Employees', path: '/employees', icon: Users, show: isManager },
    { name: 'Departments', path: '/departments', icon: Building2 },
    { name: 'Attendance', path: '/attendance', icon: Clock },
    { name: 'Leave Portal', path: '/leaves', icon: CalendarCheck },
    { name: 'Payroll & Slips', path: '/payroll', icon: CreditCard },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 min-h-screen flex flex-col justify-between flex-shrink-0">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">StaffSync</h2>
            <p className="text-xs text-slate-400">Human Resource Suite</p>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="p-4 space-y-1.5">
          {navItems
            .filter((item) => item.show !== false)
            .map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
        </nav>
      </div>

      {/* Role Pill at Bottom */}
      <div className="p-4 border-t border-slate-800 m-4 rounded-xl bg-slate-800/50">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Logged in as</span>
          <span className="font-semibold text-indigo-400 uppercase tracking-wide">
            {user?.role || 'Guest'}
          </span>
        </div>
        <p className="text-xs text-slate-300 truncate mt-1 font-medium">{user?.email}</p>
      </div>
    </aside>
  );
}
