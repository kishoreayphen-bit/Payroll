import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, Check, X, Trash2, ArrowLeft, Filter, CheckCheck, UserPlus, AlertTriangle, DollarSign, Calendar, Clock, Settings } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useTheme } from '../contexts/ThemeContext';
import Sidebar from '../components/Sidebar';
import AppHeader from '../components/AppHeader';

export default function Notifications() {
    const navigate = useNavigate();
    const { darkMode } = useTheme();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [organization, setOrganization] = useState(null);
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            title: 'New Employee Added',
            message: 'John Doe has been added to the system successfully',
            time: '2 hours ago',
            read: false,
            type: 'success',
            icon: UserPlus
        },
        {
            id: 2,
            title: 'Incomplete Profiles',
            message: '3 employees have incomplete profiles that need attention',
            time: '5 hours ago',
            read: false,
            type: 'warning',
            icon: AlertTriangle
        },
        {
            id: 3,
            title: 'Payroll Reminder',
            message: 'Monthly payroll processing is due in 2 days',
            time: '1 day ago',
            read: true,
            type: 'info',
            icon: DollarSign
        },
        {
            id: 4,
            title: 'Leave Request Approved',
            message: 'Your leave request for Dec 25-26 has been approved',
            time: '2 days ago',
            read: true,
            type: 'success',
            icon: Calendar
        }
    ]);

    const [filter, setFilter] = useState('all');

    React.useEffect(() => {
        loadOrganization();
    }, []);

    const loadOrganization = async () => {
        try {
            const orgId = localStorage.getItem('selectedOrganizationId');
            if (orgId) {
                const { api } = await import('../services/authService');
                const res = await api.get('/organizations');
                const org = res.data?.find(o => o.id === parseInt(orgId));
                setOrganization(org);
            }
        } catch (error) {
            console.error('Error loading organization:', error);
        }
    };

    const markAsRead = (id) => {
        setNotifications(notifications.map(n =>
            n.id === id ? { ...n, read: true } : n
        ));
    };

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const deleteNotification = (id) => {
        setNotifications(notifications.filter(n => n.id !== id));
    };

    const filteredNotifications = notifications.filter(n => {
        if (filter === 'unread') return !n.read;
        if (filter === 'read') return n.read;
        return true;
    });

    const unreadCount = notifications.filter(n => !n.read).length;

    const getTypeStyles = (type) => {
        switch (type) {
            case 'success': return {
                bg: 'bg-emerald-50 dark:bg-emerald-900/20',
                border: 'border-emerald-200 dark:border-emerald-800',
                icon: 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400'
            };
            case 'warning': return {
                bg: 'bg-amber-50 dark:bg-amber-900/20',
                border: 'border-amber-200 dark:border-amber-800',
                icon: 'bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400'
            };
            case 'info': return {
                bg: 'bg-blue-50 dark:bg-blue-900/20',
                border: 'border-blue-200 dark:border-blue-800',
                icon: 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
            };
            default: return {
                bg: 'bg-slate-50 dark:bg-slate-800',
                border: 'border-slate-200 dark:border-slate-700',
                icon: 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
            };
        }
    };

    return (
        <div className="h-screen bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 flex overflow-hidden">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            
            <div className={`flex-1 flex flex-col min-w-0 overflow-hidden transition-all duration-300 ${sidebarOpen ? 'ml-56' : 'ml-0'}`}>
                <AppHeader 
                    sidebarOpen={sidebarOpen} 
                    setSidebarOpen={setSidebarOpen}
                    organization={organization}
                />
                
                <main className="flex-1 overflow-y-auto p-4">
                    <div className="max-w-3xl mx-auto">
                        {/* Header */}
                        <div className="mb-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-pink-600 rounded-lg flex items-center justify-center">
                                            <Bell className="w-4 h-4 text-white" />
                                        </div>
                                        Notifications
                                    </h1>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                        {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
                                    </p>
                                </div>

                                {unreadCount > 0 && (
                                    <Button
                                        onClick={markAllAsRead}
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-xs font-medium"
                                    >
                                        <CheckCheck className="w-3.5 h-3.5" />
                                        Mark all read
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Filter Tabs */}
                        <div className="flex items-center gap-1 mb-4 bg-white dark:bg-slate-800 rounded-lg p-1 border border-slate-200/60 dark:border-slate-700/60 shadow-sm">
                            {[
                                { key: 'all', label: 'All', count: notifications.length },
                                { key: 'unread', label: 'Unread', count: unreadCount },
                                { key: 'read', label: 'Read', count: notifications.length - unreadCount }
                            ].map(tab => (
                                <button
                                    key={tab.key}
                                    onClick={() => setFilter(tab.key)}
                                    className={`flex-1 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                                        filter === tab.key
                                            ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-sm'
                                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                                    }`}
                                >
                                    {tab.label} ({tab.count})
                                </button>
                            ))}
                        </div>

                        {/* Notifications List */}
                        <div className="space-y-2">
                            {filteredNotifications.length === 0 ? (
                                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200/60 dark:border-slate-700/60 p-8 text-center shadow-sm">
                                    <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <Bell className="w-6 h-6 text-slate-400 dark:text-slate-500" />
                                    </div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">No notifications to display</p>
                                    {filter !== 'all' && (
                                        <button
                                            onClick={() => setFilter('all')}
                                            className="mt-3 text-xs text-rose-600 hover:text-rose-700 font-medium"
                                        >
                                            View all notifications →
                                        </button>
                                    )}
                                </div>
                            ) : (
                                filteredNotifications.map((notification) => {
                                    const styles = getTypeStyles(notification.type);
                                    const IconComponent = notification.icon || Bell;
                                    
                                    return (
                                        <div
                                            key={notification.id}
                                            className={`bg-white dark:bg-slate-800 rounded-lg border p-3 transition-all hover:shadow-md group ${
                                                notification.read 
                                                    ? 'border-slate-200/60 dark:border-slate-700/60' 
                                                    : 'border-rose-200 dark:border-rose-800/50 bg-rose-50/30 dark:bg-rose-900/10'
                                            }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                {/* Icon */}
                                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${styles.icon}`}>
                                                    <IconComponent className="w-4 h-4" />
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div className="flex-1">
                                                            <h3 className={`text-sm font-semibold flex items-center gap-1.5 ${
                                                                notification.read 
                                                                    ? 'text-slate-700 dark:text-slate-300' 
                                                                    : 'text-slate-900 dark:text-white'
                                                            }`}>
                                                                {notification.title}
                                                                {!notification.read && (
                                                                    <span className="w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
                                                                )}
                                                            </h3>
                                                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 line-clamp-2">
                                                                {notification.message}
                                                            </p>
                                                            <div className="flex items-center gap-2 mt-1.5">
                                                                <Clock className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                                                                <span className="text-[10px] text-slate-400 dark:text-slate-500">
                                                                    {notification.time}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* Actions */}
                                                        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            {!notification.read && (
                                                                <button
                                                                    onClick={() => markAsRead(notification.id)}
                                                                    className="p-1.5 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-md transition-colors"
                                                                    title="Mark as read"
                                                                >
                                                                    <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                                                </button>
                                                            )}
                                                            <button
                                                                onClick={() => deleteNotification(notification.id)}
                                                                className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md transition-colors"
                                                                title="Delete"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5 text-red-500 dark:text-red-400" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {/* Settings Link */}
                        <div className="mt-4 text-center">
                            <button
                                onClick={() => navigate('/settings')}
                                className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                            >
                                <Settings className="w-3.5 h-3.5" />
                                Notification preferences
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
