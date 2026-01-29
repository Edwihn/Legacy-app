import api from './api';

export interface Notification {
    _id: string;
    userId: string;
    message: string;
    type: 'task_assigned' | 'task_updated' | 'task_completed' | 'task_deleted' | 'project_created' | 'comment_added';
    read: boolean;
    relatedTaskId?: string;
    relatedProjectId?: string;
    createdAt: string;
}

export const notificationService = {
    /**
     * Obtener todas las notificaciones del usuario actual
     */
    getNotifications: async (): Promise<Notification[]> => {
        const response = await api.get('/notifications');
        return response.data.data;
    },

    /**
     * Marcar notificaciones como leídas
     */
    markAsRead: async (notificationIds: string[]): Promise<void> => {
        await api.put('/notifications/mark-read', { notificationIds });
    },

    /**
     * Marcar todas como leídas
     */
    markAllAsRead: async (): Promise<void> => {
        const notifications = await notificationService.getNotifications();
        const unreadIds = notifications.filter(n => !n.read).map(n => n._id);
        if (unreadIds.length > 0) {
            await notificationService.markAsRead(unreadIds);
        }
    },

    /**
     * Eliminar notificación
     */
    deleteNotification: async (id: string): Promise<void> => {
        await api.delete(`/notifications/${id}`);
    },

    /**
     * Obtener cantidad de notificaciones no leídas
     */
    getUnreadCount: async (): Promise<number> => {
        const notifications = await notificationService.getNotifications();
        return notifications.filter(n => !n.read).length;
    },
};
