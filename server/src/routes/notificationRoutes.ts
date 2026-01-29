import express from 'express';
import {
    getMyNotifications,
    markNotificationsAsRead,
    deleteNotification,
} from '../controllers/notificationController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

/**
 * Rutas de notificaciones - Todas protegidas
 */
router.use(protect);

router.get('/', getMyNotifications);
router.put('/mark-read', markNotificationsAsRead);
router.delete('/:id', deleteNotification);

export default router;
