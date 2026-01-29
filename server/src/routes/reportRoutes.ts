import express from 'express';
import {
    getTasksReport,
    getProjectsReport,
    getUsersReport,
    exportTasksToCSV,
} from '../controllers/reportController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

/**
 * Rutas de reportes - Todas protegidas
 */
router.use(protect);

router.get('/tasks', getTasksReport);
router.get('/projects', getProjectsReport);
router.get('/users', getUsersReport);
router.get('/export-csv', exportTasksToCSV);

export default router;
