import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

/**
 * Extender la interfaz Request de Express para incluir el usuario autenticado
 */
export interface AuthRequest extends Request {
    user?: IUser;
}

/**
 * Middleware para proteger rutas con JWT
 * Verifica el token en el header Authorization
 */
export const protect = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        let token: string | undefined;

        // Verificar si el token existe en los headers
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            res.status(401).json({
                success: false,
                message: 'No autorizado - Token no proporcionado',
            });
            return;
        }

        // Verificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || '') as {
            id: string;
        };

        // Buscar el usuario por ID
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            res.status(401).json({
                success: false,
                message: 'No autorizado - Usuario no encontrado',
            });
            return;
        }

        // Agregar el usuario a la request
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'No autorizado - Token inválido',
        });
    }
};

/**
 * Middleware para verificar si el usuario es admin
 */
export const authorize = (...roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction): void => {
        if (!req.user || !roles.includes(req.user.role)) {
            res.status(403).json({
                success: false,
                message: 'No tienes permisos para acceder a este recurso',
            });
            return;
        }
        next();
    };
};
