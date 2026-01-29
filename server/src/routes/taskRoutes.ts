import express from 'express';
import {
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    searchTasks,
} from '../controllers/taskController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

/**
 * Rutas de tareas - Todas protegidas
 */
router.use(protect);

router.route('/').get(getTasks).post(createTask);

router.post('/search', searchTasks);

router.route('/:id').get(getTaskById).put(updateTask).delete(deleteTask);

export default router;
