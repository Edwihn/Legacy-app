import express from 'express';
import {
    getCommentsByTask,
    createComment,
    deleteComment,
} from '../controllers/commentController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

/**
 * Rutas de comentarios - Todas protegidas
 */
router.use(protect);

router.post('/', createComment);
router.get('/task/:taskId', getCommentsByTask);
router.delete('/:id', deleteComment);

export default router;
