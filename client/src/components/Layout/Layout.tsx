import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { authService } from '../../services/authService';
import { notificationService } from '../../services/notificationService';
import NotificationPanel from '../Notifications/NotificationPanel';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const location = useLocation();
    const user = authService.getCurrentUser();
    const [showNotifications, setShowNotifications] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    const isActive = (path: string) => location.pathname === path;

    useEffect(() => {
        loadUnreadCount();
        // Recargar cada 30 segundos
        const interval = setInterval(loadUnreadCount, 30000);
        return () => clearInterval(interval);
    }, []);

    const loadUnreadCount = async () => {
        try {
            console.log('Loading unread notifications...');
            const count = await notificationService.getUnreadCount();
            console.log('Unread notifications:', count);
            setUnreadCount(count);
        } catch (error) {
            console.error('Error loading notifications:', error);
        }
    };

    const handleNotificationsClose = () => {
        setShowNotifications(false);
        loadUnreadCount(); // Recargar el contador al cerrar
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Header */}
            <header className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center space-x-8">
                            <Link to="/dashboard" className="flex items-center">
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                                <span className="ml-3 text-xl font-bold text-gray-900">Task Manager</span>
                            </Link>

                            <nav className="hidden md:flex space-x-1">
                                <Link
                                    to="/dashboard"
                                    className={`px-4 py-2 rounded-lg font-medium transition-all ${isActive('/dashboard')
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    to="/tasks"
                                    className={`px-4 py-2 rounded-lg font-medium transition-all ${isActive('/tasks')
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    Tasks
                                </Link>
                                <Link
                                    to="/projects"
                                    className={`px-4 py-2 rounded-lg font-medium transition-all ${isActive('/projects')
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    Projects
                                </Link>
                                <Link
                                    to="/reports"
                                    className={`px-4 py-2 rounded-lg font-medium transition-all ${isActive('/reports')
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    Reports
                                </Link>
                            </nav>
                        </div>

                        <div className="flex items-center space-x-4">
                            {/* Botón de Notificaciones */}
                            <button
                                onClick={() => setShowNotifications(true)}
                                className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
                                title="Notifications"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </span>
                                )}
                            </button>

                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-900">{user?.username}</p>
                                <p className="text-xs text-gray-500">{user?.role}</p>
                            </div>
                            <button
                                onClick={() => authService.logout()}
                                className="btn-danger"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>

            {/* Modal de Notificaciones */}
            {showNotifications && (
                <NotificationPanel onClose={handleNotificationsClose} />
            )}
        </div>
    );
};

export default Layout;
