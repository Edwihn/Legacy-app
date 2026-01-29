import React, { useEffect, useState } from 'react';
import { notificationService, Notification } from '../../services/notificationService';
import toast from 'react-hot-toast';

interface NotificationPanelProps {
    onClose: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ onClose }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadNotifications();
    }, []);

    const loadNotifications = async () => {
        try {
            setLoading(true);
            const data = await notificationService.getNotifications();
            setNotifications(data);
        } catch (error: any) {
            toast.error('Error al cargar notificaciones');
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (id: string) => {
        try {
            await notificationService.markAsRead([id]);
            setNotifications(notifications.map(n =>
                n._id === id ? { ...n, isRead: true } : n
            ));
            toast.success('Marcada como leída');
        } catch (error: any) {
            toast.error('Error al marcar como leída');
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await notificationService.markAllAsRead();
            setNotifications(notifications.map(n => ({ ...n, isRead: true })));
            toast.success('Todas marcadas como leídas');
        } catch (error: any) {
            toast.error('Error al marcar todas como leídas');
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await notificationService.deleteNotification(id);
            setNotifications(notifications.filter(n => n._id !== id));
            toast.success('Notificación eliminada');
        } catch (error: any) {
            toast.error('Error al eliminar notificación');
        }
    };

    const getNotificationIcon = (type: string) => {
        const icons: Record<string, string> = {
            task_assigned: '📋',
            task_updated: '✏️',
            task_completed: '✅',
            task_deleted: '🗑️',
            project_created: '📁',
            comment_added: '💬',
        };
        return icons[type] || '🔔';
    };

    const getNotificationColor = (type: string) => {
        const colors: Record<string, string> = {
            task_assigned: 'bg-blue-50 border-blue-200',
            task_updated: 'bg-yellow-50 border-yellow-200',
            task_completed: 'bg-green-50 border-green-200',
            task_deleted: 'bg-red-50 border-red-200',
            project_created: 'bg-purple-50 border-purple-200',
            comment_added: 'bg-indigo-50 border-indigo-200',
        };
        return colors[type] || 'bg-gray-50 border-gray-200';
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Ahora mismo';
        if (minutes < 60) return `Hace ${minutes} min`;
        if (hours < 24) return `Hace ${hours} h`;
        if (days < 7) return `Hace ${days} días`;
        return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="card max-w-2xl w-full max-h-[80vh] overflow-hidden p-6 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            🔔 Notificaciones
                        </h2>
                        {unreadCount > 0 && (
                            <p className="text-sm text-gray-600 mt-1">
                                {unreadCount} sin leer
                            </p>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {unreadCount > 0 && (
                    <div className="mb-4">
                        <button
                            onClick={handleMarkAllAsRead}
                            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                        >
                            Marcar todas como leídas
                        </button>
                    </div>
                )}

                <div className="flex-1 overflow-y-auto">
                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-gray-400 mb-2">
                                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                            </div>
                            <p className="text-gray-600">No tienes notificaciones</p>
                            <p className="text-gray-500 text-sm mt-2">Te avisaremos cuando haya novedades</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {notifications.map((notification) => (
                                <div
                                    key={notification._id}
                                    className={`p-4 rounded-lg border-2 transition-all hover:shadow-md ${getNotificationColor(notification.type)
                                        } ${!notification.isRead ? 'border-l-4' : ''}`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start space-x-3 flex-1">
                                            <span className="text-2xl">{getNotificationIcon(notification.type)}</span>
                                            <div className="flex-1">
                                                <p className={`text-sm ${!notification.isRead ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                                                    {notification.message}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {formatDate(notification.createdAt)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2 ml-4">
                                            {!notification.isRead && (
                                                <button
                                                    onClick={() => handleMarkAsRead(notification._id)}
                                                    className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                                                    title="Marcar como leída"
                                                >
                                                    ✓
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDelete(notification._id)}
                                                className="text-red-600 hover:text-red-800 text-xs"
                                                title="Eliminar"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                    <button onClick={onClose} className="btn-secondary w-full">
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotificationPanel;
