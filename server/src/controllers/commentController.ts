import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import Comment from '../models/Comment';
import Notification from '../models/Notification';
import Task from '../models/Task';

/**
 * @desc    Obtener comentarios de una tarea
 * @route   GET /api/comments/task/:taskId
 * @access  Private
 */
export const getCommentsByTask = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const comments = await Comment.find({ taskId: req.params.taskId })
            .populate('userId', 'username')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: comments.length,
            data: comments,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener comentarios',
            error: error.message,
        });
    }
};

/**
 * @desc    Crear un comentario
 * @route   POST /api/comments
 * @access  Private
 */
export const createComment = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const { taskId, commentText } = req.body;

        if (!taskId || !commentText) {
            res.status(400).json({
                success: false,
                message: 'El ID de tarea y el texto del comentario son requeridos',
            });
            return;
        }

        const comment = await Comment.create({
            taskId,
            userId: req.user!._id,
            commentText,
        });

        const populatedComment = await Comment.findById(comment._id).populate(
            'userId',
            'username'
        );

        // Notificar a los involucrados en la tarea
        try {
            const task = await Task.findById(taskId);
            if (task) {
                // Notificar al asignado (si existe)
                if (task.assignedTo) {
                    console.log(`Creando notificación COMMENT para asignado: ${task.assignedTo}`);
                    await Notification.create({
                        userId: task.assignedTo,
                        message: `Nuevo comentario en "${task.title}": ${commentText.substring(0, 30)}...`,
                        type: 'comment_added',
                        relatedTaskId: task._id,
                    });
                }

                // Notificar al creador (si existe y es diferente del asignado para no duplicar)
                if (task.createdBy && (!task.assignedTo || task.assignedTo.toString() !== task.createdBy.toString())) {
                    console.log(`Creando notificación COMMENT para creador: ${task.createdBy}`);
                    await Notification.create({
                        userId: task.createdBy,
                        message: `Nuevo comentario en "${task.title}": ${commentText.substring(0, 30)}...`,
                        type: 'comment_added',
                        relatedTaskId: task._id,
                    });
                }
            }
        } catch (error) {
            console.error('Error al crear notificación de comentario:', error);
        }

        res.status(201).json({
            success: true,
            data: populatedComment,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error al crear comentario',
            error: error.message,
        });
    }
};

/**
 * @desc    Eliminar un comentario
 * @route   DELETE /api/comments/:id
 * @access  Private
 */
export const deleteComment = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            res.status(404).json({
                success: false,
                message: 'Comentario no encontrado',
            });
            return;
        }

        // Solo el creador o un admin puede eliminar
        if (
            comment.userId.toString() !== req.user!._id.toString() &&
            req.user!.role !== 'admin'
        ) {
            res.status(403).json({
                success: false,
                message: 'No tienes permisos para eliminar este comentario',
            });
            return;
        }

        await comment.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Comentario eliminado correctamente',
            data: {},
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar comentario',
            error: error.message,
        });
    }
};
