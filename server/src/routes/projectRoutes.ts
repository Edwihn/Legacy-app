import express from 'express';
import {
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
} from '../controllers/projectController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

/**
 * Rutas de proyectos - Todas protegidas
 */
router.use(protect); // Aplicar middleware a todas las rutas

router.route('/').get(getProjects).post(createProject);

router
    .route('/:id')
    .get(getProjectById)
    .put(updateProject)
    .delete(deleteProject);

export default router;
