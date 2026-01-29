import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import Notification from '../models/Notification';

/**
 * @desc    Obtener notificaciones del usuario actual
 * @route   GET /api/notifications
 * @access  Private
 */
export const getMyNotifications = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const unreadOnly = req.query.unreadOnly === 'true';

        const filter: any = { userId: req.user!._id };
        if (unreadOnly) {
            filter.read = false;
        }

        const notifications = await Notification.find(filter)
            .populate('relatedTaskId', 'title')
            .sort({ createdAt: -1 })
            .limit(50);

        res.status(200).json({
            success: true,
            count: notifications.length,
            data: notifications,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener notificaciones',
            error: error.message,
        });
    }
};

/**
 * @desc    Marcar notificaciones como leídas
 * @route   PUT /api/notifications/mark-read
 * @access  Private
 */
export const markNotificationsAsRead = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const { notificationIds } = req.body;

        if (!notificationIds || !Array.isArray(notificationIds)) {
            // Si no se envían IDs específicos, marcar todas las del usuario
            await Notification.updateMany(
                { userId: req.user!._id, read: false },
                { read: true }
            );

            res.status(200).json({
                success: true,
                message: 'Todas las notificaciones marcadas como leídas',
            });
            return;
        }

        // Marcar solo las notificaciones especificadas
        await Notification.updateMany(
            {
                _id: { $in: notificationIds },
                userId: req.user!._id,
            },
            { read: true }
        );

        res.status(200).json({
            success: true,
            message: 'Notificaciones marcadas como leídas',
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error al marcar notificaciones',
            error: error.message,
        });
    }
};

/**
 * @desc    Eliminar notificación
 * @route   DELETE /api/notifications/:id
 * @access  Private
 */
export const deleteNotification = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const notification = await Notification.findById(req.params.id);

        if (!notification) {
            res.status(404).json({
                success: false,
                message: 'Notificación no encontrada',
            });
            return;
        }

        // Solo el usuario dueño puede eliminar su notificación
        if (notification.userId.toString() !== req.user!._id.toString()) {
            res.status(403).json({
                success: false,
                message: 'No tienes permisos para eliminar esta notificación',
            });
            return;
        }

        await notification.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Notificación eliminada correctamente',
            data: {},
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar notificación',
            error: error.message,
        });
    }
};
