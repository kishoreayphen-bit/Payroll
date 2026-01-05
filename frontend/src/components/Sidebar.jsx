import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    Calendar,
    CheckCircle,
    FileText,
    Wallet,
    Gift,
    FolderOpen,
    PieChart,
    Settings,
    Receipt,
    X,
    ChevronRight
} from 'lucide-react';

const SIDEBAR_SECTIONS = [
    {
        title: 'Main',
        items: [
            { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { path: '/employees', label: 'Employees', icon: Users }
        ]
    },
    {
        title: 'Payroll',
        items: [
            { path: '/pay-runs', label: 'Pay Runs', icon: Calendar },
            { path: '/approvals', label: 'Approvals', icon: CheckCircle, hasSubmenu: true },
            { path: '/form16', label: 'Form 16', icon: FileText }
        ]
    },
    {
        title: 'Benefits',
        items: [
            { path: '/loans', label: 'Loans', icon: Wallet },
            { path: '/giving', label: 'Giving', icon: Gift }
        ]
    },
    {
        title: 'Management',
        items: [
            { path: '/documents', label: 'Documents', icon: FolderOpen },
            { path: '/reports', label: 'Reports', icon: PieChart },
            { path: '/settings/pay-schedule', label: 'Settings', icon: Settings }
        ]
    }
];

export default function Sidebar({ isOpen, onClose }) {
    const location = useLocation();

    const isActive = (path) => {
        if (path === '/dashboard') {
            return location.pathname === '/dashboard';
        }
        if (path === '/employees') {
            return location.pathname === '/employees' || location.pathname.startsWith('/employees/');
        }
        if (path === '/settings/pay-schedule') {
            return location.pathname.startsWith('/settings');
        }
        return location.pathname === path || location.pathname.startsWith(path + '/');
    };

    return (
        <div
            className={`bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col fixed left-0 top-0 h-screen transition-all duration-300 shadow-2xl z-40 ${
                isOpen ? 'w-56' : 'w-0'
            }`}
            style={{ overflow: isOpen ? 'visible' : 'hidden' }}
        >
            {isOpen && (
                <>
                    {/* Logo and Close Button */}
                    <div className="p-6 border-b border-slate-700/50 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg flex items-center justify-center">
                                <Receipt className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
                                Payroll
                            </span>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-1.5 hover:bg-slate-700/50 rounded-lg transition-colors"
                            title="Close sidebar"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-6 overflow-y-auto scrollbar-hide">
                        {SIDEBAR_SECTIONS.map((section) => (
                            <div key={section.title} className="space-y-1">
                                <div className="px-3 mb-2">
                                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                        {section.title}
                                    </span>
                                </div>
                                {section.items.map((item) => {
                                    const Icon = item.icon;
                                    const active = isActive(item.path);

                                    if (item.hasSubmenu) {
                                        return (
                                            <div
                                                key={item.path}
                                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-700/50 text-slate-300 hover:text-white transition-all cursor-pointer group"
                                            >
                                                <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                                <span className="font-medium">{item.label}</span>
                                                <ChevronRight className="w-4 h-4 ml-auto opacity-50" />
                                            </div>
                                        );
                                    }

                                    return (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group ${
                                                active
                                                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/30'
                                                    : 'hover:bg-slate-700/50 text-slate-300 hover:text-white'
                                            }`}
                                        >
                                            <Icon
                                                className={`w-5 h-5 ${
                                                    active ? '' : 'group-hover:scale-110 transition-transform'
                                                }`}
                                            />
                                            <span className="font-medium">{item.label}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        ))}
                    </nav>
                </>
            )}
        </div>
    );
}
