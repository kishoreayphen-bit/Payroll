import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Search,
    Bell,
    Settings,
    Menu,
    ChevronRight,
    Building,
    User,
    LogOut,
    Moon,
    Sun
} from 'lucide-react';
import { Button } from './ui/button';
import { useTheme } from '../contexts/ThemeContext';

export default function AppHeader({
    sidebarOpen,
    setSidebarOpen,
    showCompanyMenu,
    setShowCompanyMenu,
    showProfileMenu,
    setShowProfileMenu,
    organization,
    loading,
    user,
    logout
}) {
    const navigate = useNavigate();
    const { darkMode, toggleDarkMode } = useTheme();

    return (
        <div className="bg-white/80 dark:bg-slate-900/90 backdrop-blur-md border-b border-pink-100 dark:border-slate-700 px-6 py-4 flex-shrink-0 shadow-sm">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                    {/* Menu button to open sidebar when closed */}
                    {!sidebarOpen && (
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="p-2 hover:bg-pink-50 dark:hover:bg-slate-700 rounded-xl transition-colors"
                            title="Open sidebar"
                        >
                            <Menu className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                        </button>
                    )}
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search employees..."
                            className="w-full pl-10 pr-4 py-2 border border-pink-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-white dark:bg-slate-800 dark:text-white dark:placeholder-slate-400"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && e.target.value.trim()) {
                                    window.location.href = `/employees?search=${encodeURIComponent(e.target.value.trim())}`;
                                }
                            }}
                        />
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {/* Company Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => {
                                setShowCompanyMenu(!showCompanyMenu);
                                setShowProfileMenu(false);
                            }}
                            className="flex items-center gap-2 px-3 py-1.5 bg-pink-50 dark:bg-slate-800 rounded-xl hover:bg-pink-100 dark:hover:bg-slate-700 transition-colors"
                        >
                            <span className="text-slate-700 dark:text-slate-200 font-medium text-xs">
                                {loading ? 'Loading...' : (organization?.companyName || 'No Company')}
                            </span>
                            <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                        </button>

                        {showCompanyMenu && (
                            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-pink-100 dark:border-slate-700 py-2 z-50">
                                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg flex items-center justify-center">
                                            <Building className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900 dark:text-white text-sm">
                                                {organization?.companyName || 'No Company'}
                                            </p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                {organization?.industry || 'Not specified'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="px-2 py-1">
                                    <Link to="/company/settings" className="flex items-center gap-2 px-3 py-2 hover:bg-pink-50 dark:hover:bg-slate-700 rounded-lg transition-colors">
                                        <Settings className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                                        <span className="text-sm text-slate-700 dark:text-slate-200">Company Settings</span>
                                    </Link>
                                    <Link to="/company/profile" className="flex items-center gap-2 px-3 py-2 hover:bg-pink-50 dark:hover:bg-slate-700 rounded-lg transition-colors">
                                        <Building className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                                        <span className="text-sm text-slate-700 dark:text-slate-200">Company Profile</span>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Dark Mode Toggle */}
                    <button
                        onClick={toggleDarkMode}
                        className="p-2 hover:bg-pink-50 dark:hover:bg-slate-700 rounded-xl transition-colors"
                        title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                    >
                        {darkMode ? (
                            <Sun className="w-4 h-4 text-yellow-500" />
                        ) : (
                            <Moon className="w-4 h-4 text-slate-600" />
                        )}
                    </button>

                    <Link to="/notifications" className="p-2 hover:bg-pink-50 dark:hover:bg-slate-700 rounded-xl transition-colors block">
                        <Bell className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                    </Link>

                    <button className="p-2 hover:bg-pink-50 dark:hover:bg-slate-700 rounded-xl transition-colors">
                        <Settings className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                    </button>

                    {/* Profile Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => {
                                setShowProfileMenu(!showProfileMenu);
                                setShowCompanyMenu(false);
                            }}
                            className="w-8 h-8 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg hover:shadow-xl transition-shadow"
                        >
                            {user?.email?.charAt(0).toUpperCase() || 'U'}
                        </button>

                        {showProfileMenu && (
                            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-pink-100 dark:border-slate-700 py-2 z-50">
                                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                                            {user?.email?.charAt(0).toUpperCase() || 'U'}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900 dark:text-white text-sm">{user?.email?.split('@')[0] || 'User'}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">{user?.email || 'user@example.com'}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="px-2 py-1">
                                    <Link to="/profile" className="flex items-center gap-2 px-3 py-2 hover:bg-pink-50 dark:hover:bg-slate-700 rounded-lg transition-colors">
                                        <User className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                                        <span className="text-sm text-slate-700 dark:text-slate-200">My Profile</span>
                                    </Link>
                                    <Link to="/settings" className="flex items-center gap-2 px-3 py-2 hover:bg-pink-50 dark:hover:bg-slate-700 rounded-lg transition-colors">
                                        <Settings className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                                        <span className="text-sm text-slate-700 dark:text-slate-200">Account Settings</span>
                                    </Link>
                                    <button
                                        onClick={() => {
                                            logout();
                                            window.location.href = '/login';
                                        }}
                                        className="w-full flex items-center gap-2 px-3 py-2 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors text-left"
                                    >
                                        <LogOut className="w-4 h-4 text-red-600" />
                                        <span className="text-sm text-red-600">Logout</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
