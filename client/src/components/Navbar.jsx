import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Bell } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">
          StaffSync
        </h1>
        <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-medium border border-indigo-100">
          MERN HRMS v1.0
        </span>
      </div>

      <div className="flex items-center gap-4">
        {/* User Info & Role */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-sm font-semibold text-slate-800 leading-tight">{user?.name || 'Staff Member'}</p>
            <p className="text-xs text-indigo-600 font-medium">{user?.role || 'User'}</p>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={logout}
          title="Sign Out"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors border border-rose-100"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>
    </header>
  );
}
