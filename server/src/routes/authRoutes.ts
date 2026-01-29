import express from 'express';
import { login, register, getMe, getUsers } from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

/**
 * Rutas de autenticación
 */
router.post('/login', login);
router.post('/register', register);
router.get('/me', protect, getMe);
router.get('/users', protect, getUsers);

export default router;
