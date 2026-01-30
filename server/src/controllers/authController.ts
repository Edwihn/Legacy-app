import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

/**
 * Generar token JWT
 */
const generateToken = (id: string): string => {
    return jwt.sign({ id }, process.env.JWT_SECRET || '', {
        expiresIn: (process.env.JWT_EXPIRE || '7d') as any,
    });
};

/**
 * @desc    Login de usuario
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, password } = req.body;

        // Validar campos
        if (!username || !password) {
            res.status(400).json({
                success: false,
                message: 'Por favor proporciona usuario y contraseña',
            });
            return;
        }

        // Buscar usuario (incluir password que está en select: false)
        const user = await User.findOne({ username }).select('+password');

        if (!user) {
            res.status(401).json({
                success: false,
                message: 'Credenciales inválidas',
            });
            return;
        }

        // Verificar contraseña
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            res.status(401).json({
                success: false,
                message: 'Credenciales inválidas',
            });
            return;
        }

        // Generar token
        const token = generateToken(user._id.toString());

        res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error en el servidor',
            error: error.message,
        });
    }
};

/**
 * @desc    Registro de nuevo usuario
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, password, email, role } = req.body;

        // Validar campos requeridos
        if (!username || !password) {
            res.status(400).json({
                success: false,
                message: 'Por favor proporciona usuario y contraseña',
            });
            return;
        }

        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ username });

        if (existingUser) {
            res.status(400).json({
                success: false,
                message: 'El usuario ya existe',
            });
            return;
        }

        // Crear nuevo usuario
        const user = await User.create({
            username,
            password,
            email,
            role: role || 'user',
        });

        // Generar token
        const token = generateToken(user._id.toString());

        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error en el servidor',
            error: error.message,
        });
    }
};

/**
 * @desc    Obtener usuario actual
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = async (req: Request, res: Response): Promise<void> => {
    try {
        // El usuario ya viene del middleware protect
        const user = (req as any).user;

        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error en el servidor',
            error: error.message,
        });
    }
};

/**
 * @desc    Obtener lista de usuarios
 * @route   GET /api/auth/users
 * @access  Private
 */
export const getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await User.find().select('_id username email role');

        res.status(200).json({
            success: true,
            count: users.length,
            data: users,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener usuarios',
            error: error.message,
        });
    }
};
