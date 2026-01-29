import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import Task from '../models/Task';
import History from '../models/History';
import Notification from '../models/Notification';

/**
 * @desc    Obtener todas las tareas con filtros opcionales
 * @route   GET /api/tasks
 * @access  Private
 */
export const getTasks = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const { projectId, status, priority, assignedTo } = req.query;

        // Construir filtro dinámico
        const filter: any = {};
        if (projectId) filter.projectId = projectId;
        if (status) filter.status = status;
        if (priority) filter.priority = priority;
        if (assignedTo) filter.assignedTo = assignedTo;

        const tasks = await Task.find(filter)
            .populate('projectId', 'name')
            .populate('assignedTo', 'username')
            .populate('createdBy', 'username')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: tasks.length,
            data: tasks,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener tareas',
            error: error.message,
        });
    }
};

/**
 * @desc    Obtener una tarea por ID
 * @route   GET /api/tasks/:id
 * @access  Private
 */
export const getTaskById = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const task = await Task.findById(req.params.id)
            .populate('projectId', 'name description')
            .populate('assignedTo', 'username email')
            .populate('createdBy', 'username email');

        if (!task) {
            res.status(404).json({
                success: false,
                message: 'Tarea no encontrada',
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: task,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener tarea',
            error: error.message,
        });
    }
};

/**
 * @desc    Crear nueva tarea
 * @route   POST /api/tasks
 * @access  Private
 */
export const createTask = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const {
            title,
            description,
            status,
            priority,
            projectId,
            assignedTo,
            dueDate,
            estimatedHours,
        } = req.body;

        if (!title || !projectId) {
            res.status(400).json({
                success: false,
                message: 'El título y el proyecto son requeridos',
            });
            return;
        }

        const task = await Task.create({
            title,
            description: description || '',
            status: status || 'Pendiente',
            priority: priority || 'Media',
            projectId,
            assignedTo: assignedTo && assignedTo !== '' ? assignedTo : null,
            createdBy: req.user!._id,
            dueDate: dueDate || null,
            estimatedHours: estimatedHours || 0,
            actualHours: 0,
        });

        // Crear registro en el historial
        await History.create({
            taskId: task._id,
            userId: req.user!._id,
            action: 'CREATED',
            oldValue: '',
            newValue: task.title,
        });

        // Crear notificación si fue asignada a alguien
        if (assignedTo) {
            await Notification.create({
                userId: assignedTo,
                message: `Nueva tarea asignada: ${task.title}`,
                type: 'task_assigned',
                relatedTaskId: task._id,
            });
        }

        const populatedTask = await Task.findById(task._id)
            .populate('projectId', 'name')
            .populate('assignedTo', 'username')
            .populate('createdBy', 'username');

        res.status(201).json({
            success: true,
            data: populatedTask,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error al crear tarea',
            error: error.message,
        });
    }
};

/**
 * @desc    Actualizar tarea
 * @route   PUT /api/tasks/:id
 * @access  Private
 */
export const updateTask = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        let task = await Task.findById(req.params.id);

        if (!task) {
            res.status(404).json({
                success: false,
                message: 'Tarea no encontrada',
            });
            return;
        }

        const oldTask = { ...task.toObject() };
        const updates = req.body;

        // Limpiar datos: convertir strings vacíos en null para campos ObjectId
        if (updates.assignedTo === '') {
            updates.assignedTo = null;
        }
        if (updates.projectId === '') {
            updates.projectId = null;
        }

        // Registrar cambios en el historial
        if (updates.status && updates.status !== oldTask.status) {
            await History.create({
                taskId: task._id,
                userId: req.user!._id,
                action: 'STATUS_CHANGED',
                oldValue: oldTask.status,
                newValue: updates.status,
                changes: {
                    status: {
                        from: oldTask.status,
                        to: updates.status,
                    },
                },
            });
        }

        if (updates.title && updates.title !== oldTask.title) {
            await History.create({
                taskId: task._id,
                userId: req.user!._id,
                action: 'TITLE_CHANGED',
                oldValue: oldTask.title,
                newValue: updates.title,
                changes: {
                    title: {
                        from: oldTask.title,
                        to: updates.title,
                    },
                },
            });
        }

        // Mejorar manejo de assignedTo
        const oldAssignedTo = oldTask.assignedTo ? oldTask.assignedTo.toString() : '';
        const newAssignedTo = updates.assignedTo || '';

        if (newAssignedTo && newAssignedTo !== oldAssignedTo) {
            await History.create({
                taskId: task._id,
                userId: req.user!._id,
                action: 'ASSIGNED',
                oldValue: oldAssignedTo,
                newValue: newAssignedTo,
                changes: {
                    assignedTo: {
                        from: oldAssignedTo,
                        to: newAssignedTo,
                    },
                },
            });

            // Crear notificación solo si es un usuario diferente
            if (newAssignedTo) {
                await Notification.create({
                    userId: newAssignedTo,
                    message: `Tarea actualizada: ${updates.title || task.title}`,
                    type: 'task_updated',
                    relatedTaskId: task._id,
                });
            }
        }

        // Actualizar la tarea
        task = await Task.findByIdAndUpdate(req.params.id, updates, {
            new: true,
            runValidators: true,
        })
            .populate('projectId', 'name')
            .populate('assignedTo', 'username')
            .populate('createdBy', 'username');

        res.status(200).json({
            success: true,
            data: task,
        });
    } catch (error: any) {
        console.error('Error al actualizar tarea:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar tarea',
            error: error.message,
        });
    }
};

/**
 * @desc    Eliminar tarea
 * @route   DELETE /api/tasks/:id
 * @access  Private
 */
export const deleteTask = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            res.status(404).json({
                success: false,
                message: 'Tarea no encontrada',
            });
            return;
        }

        // Registrar en el historial
        await History.create({
            taskId: task._id,
            userId: req.user!._id,
            action: 'DELETED',
            oldValue: task.title,
            newValue: '',
        });

        await task.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Tarea eliminada correctamente',
            data: {},
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar tarea',
            error: error.message,
        });
    }
};

/**
 * @desc    Búsqueda avanzada de tareas
 * @route   POST /api/tasks/search
 * @access  Private
 */
export const searchTasks = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const { searchText, status, priority, projectId } = req.body;

        const filter: any = {};

        // Búsqueda por texto en título y descripción
        if (searchText) {
            filter.$or = [
                { title: { $regex: searchText, $options: 'i' } },
                { description: { $regex: searchText, $options: 'i' } },
            ];
        }

        if (status) filter.status = status;
        if (priority) filter.priority = priority;
        if (projectId) filter.projectId = projectId;

        const tasks = await Task.find(filter)
            .populate('projectId', 'name')
            .populate('assignedTo', 'username')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: tasks.length,
            data: tasks,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error en la búsqueda',
            error: error.message,
        });
    }
};
