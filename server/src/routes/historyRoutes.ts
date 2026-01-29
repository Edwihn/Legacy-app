import express from 'express';
import {
    getHistoryByTask,
    getAllHistory,
} from '../controllers/historyController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

/**
 * Rutas de historial - Todas protegidas
 */
router.use(protect);

router.get('/', getAllHistory);
router.get('/task/:taskId', getHistoryByTask);

export default router;
