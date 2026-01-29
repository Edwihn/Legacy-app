import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import History from '../models/History';

/**
 * @desc    Obtener historial de una tarea
 * @route   GET /api/history/task/:taskId
 * @access  Private
 */
export const getHistoryByTask = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const history = await History.find({ taskId: req.params.taskId })
            .populate('userId', 'username')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: history.length,
            data: history,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener historial',
            error: error.message,
        });
    }
};

/**
 * @desc    Obtener todo el historial (últimos 100 registros)
 * @route   GET /api/history
 * @access  Private
 */
export const getAllHistory = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const limit = parseInt(req.query.limit as string) || 100;

        const history = await History.find()
            .populate('userId', 'username')
            .populate('taskId', 'title')
            .sort({ createdAt: -1 })
            .limit(limit);

        res.status(200).json({
            success: true,
            count: history.length,
            data: history,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener historial',
            error: error.message,
        });
    }
};
