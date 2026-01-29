import express from 'express';
import { login, register, getMe } from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

/**
 * Rutas de autenticación
 */
router.post('/login', login);
router.post('/register', register);
router.get('/me', protect, getMe);

export default router;
