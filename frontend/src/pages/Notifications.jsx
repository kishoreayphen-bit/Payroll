import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, Check, X, Trash2, ArrowLeft, Filter, CheckCheck } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function Notifications() {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            title: 'New Employee Added',
            message: 'John Doe has been added to the system',
            time: '2 hours ago',
            read: false,
            type: 'success'
        },
        {
            id: 2,
            title: 'Incomplete Profile',
            message: '3 employees have incomplete profiles',
            time: '5 hours ago',
            read: false,
            type: 'warning'
        },
        {
            id: 3,
            title: 'Payroll Reminder',
            message: 'Payroll processing is due in 2 days',
            time: '1 day ago',
            read: true,
            type: 'info'
        }
    ]);

    const [filter, setFilter] = useState('all'); // all, unread, read

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

    const getTypeColor = (type) => {
        switch (type) {
            case 'success': return 'bg-green-50 border-green-200 text-green-700';
            case 'warning': return 'bg-orange-50 border-orange-200 text-orange-700';
            case 'info': return 'bg-blue-50 border-blue-200 text-blue-700';
            default: return 'bg-slate-50 border-slate-200 text-slate-700';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-white">
            <div className="max-w-4xl mx-auto p-6">
                {/* Header */}
                <div className="mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm">Back</span>
                    </button>

                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                                <Bell className="w-7 h-7 text-rose-600" />
                                Notifications
                            </h1>
                            <p className="text-sm text-slate-600 mt-1">
                                {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                            </p>
                        </div>

                        {unreadCount > 0 && (
                            <Button
                                onClick={markAllAsRead}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                            >
                                <CheckCheck className="w-4 h-4" />
                                Mark all as read
                            </Button>
                        )}
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-2 mb-6 bg-white rounded-lg p-1 border border-slate-200">
                    <button
                        onClick={() => setFilter('all')}
                        className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${filter === 'all'
                                ? 'bg-rose-500 text-white'
                                : 'text-slate-600 hover:bg-slate-50'
                            }`}
                    >
                        All ({notifications.length})
                    </button>
                    <button
                        onClick={() => setFilter('unread')}
                        className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${filter === 'unread'
                                ? 'bg-rose-500 text-white'
                                : 'text-slate-600 hover:bg-slate-50'
                            }`}
                    >
                        Unread ({unreadCount})
                    </button>
                    <button
                        onClick={() => setFilter('read')}
                        className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${filter === 'read'
                                ? 'bg-rose-500 text-white'
                                : 'text-slate-600 hover:bg-slate-50'
                            }`}
                    >
                        Read ({notifications.length - unreadCount})
                    </button>
                </div>

                {/* Notifications List */}
                <div className="space-y-3">
                    {filteredNotifications.length === 0 ? (
                        <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
                            <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                            <p className="text-slate-500">No notifications to display</p>
                        </div>
                    ) : (
                        filteredNotifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`bg-white rounded-lg border p-4 transition-all hover:shadow-md ${notification.read ? 'border-slate-200' : 'border-rose-200 bg-rose-50/30'
                                    }`}
                            >
                                <div className="flex items-start gap-3">
                                    {/* Type Indicator */}
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getTypeColor(notification.type)}`}>
                                        <Bell className="w-5 h-5" />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex-1">
                                                <h3 className={`font-semibold ${notification.read ? 'text-slate-700' : 'text-slate-900'}`}>
                                                    {notification.title}
                                                    {!notification.read && (
                                                        <span className="ml-2 inline-block w-2 h-2 bg-rose-500 rounded-full"></span>
                                                    )}
                                                </h3>
                                                <p className="text-sm text-slate-600 mt-1">
                                                    {notification.message}
                                                </p>
                                                <p className="text-xs text-slate-400 mt-2">
                                                    {notification.time}
                                                </p>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-1">
                                                {!notification.read && (
                                                    <button
                                                        onClick={() => markAsRead(notification.id)}
                                                        className="p-1.5 hover:bg-green-50 rounded-md transition-colors"
                                                        title="Mark as read"
                                                    >
                                                        <Check className="w-4 h-4 text-green-600" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => deleteNotification(notification.id)}
                                                    className="p-1.5 hover:bg-red-50 rounded-md transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4 text-red-600" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Empty State for Filtered View */}
                {filteredNotifications.length === 0 && notifications.length > 0 && (
                    <div className="text-center mt-8">
                        <Button
                            onClick={() => setFilter('all')}
                            className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
                        >
                            View All Notifications
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
