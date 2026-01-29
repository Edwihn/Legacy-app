import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import Task from '../models/Task';
import Project from '../models/Project';
import User from '../models/User';

/**
 * @desc    Generar reporte de tareas
 * @route   GET /api/reports/tasks
 * @access  Private
 */
export const getTasksReport = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const tasks = await Task.find();

        // Agrupar por estado
        const statusCount: Record<string, number> = {};
        const priorityCount: Record<string, number> = {};

        tasks.forEach((task) => {
            statusCount[task.status] = (statusCount[task.status] || 0) + 1;
            priorityCount[task.priority] = (priorityCount[task.priority] || 0) + 1;
        });

        // Calcular estadísticas
        const completed = tasks.filter((t) => t.status === 'Completada').length;
        const pending = tasks.filter((t) => t.status === 'Pendiente').length;
        const inProgress = tasks.filter((t) => t.status === 'En Progreso').length;

        // Tareas vencidas
        const now = new Date();
        const overdue = tasks.filter(
            (t) => t.dueDate && new Date(t.dueDate) < now && t.status !== 'Completada'
        ).length;

        res.status(200).json({
            success: true,
            data: {
                total: tasks.length,
                completed,
                pending,
                inProgress,
                overdue,
                byStatus: statusCount,
                byPriority: priorityCount,
            },
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error al generar reporte de tareas',
            error: error.message,
        });
    }
};

/**
 * @desc    Generar reporte de proyectos
 * @route   GET /api/reports/projects
 * @access  Private
 */
export const getProjectsReport = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const projects = await Project.find();
        const tasks = await Task.find();

        const projectStats = projects.map((project) => {
            const projectTasks = tasks.filter(
                (t) => t.projectId.toString() === project._id.toString()
            );

            return {
                projectId: project._id,
                projectName: project.name,
                totalTasks: projectTasks.length,
                completed: projectTasks.filter((t) => t.status === 'Completada').length,
                pending: projectTasks.filter((t) => t.status === 'Pendiente').length,
                inProgress: projectTasks.filter((t) => t.status === 'En Progreso').length,
            };
        });

        res.status(200).json({
            success: true,
            data: {
                totalProjects: projects.length,
                projects: projectStats,
            },
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error al generar reporte de proyectos',
            error: error.message,
        });
    }
};

/**
 * @desc    Generar reporte de usuarios
 * @route   GET /api/reports/users
 * @access  Private
 */
export const getUsersReport = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const users = await User.find();
        const tasks = await Task.find();

        const userStats = users.map((user) => {
            const assignedTasks = tasks.filter(
                (t) => t.assignedTo?.toString() === user._id.toString()
            );

            return {
                userId: user._id,
                username: user.username,
                totalAssigned: assignedTasks.length,
                completed: assignedTasks.filter((t) => t.status === 'Completada').length,
                pending: assignedTasks.filter((t) => t.status === 'Pendiente').length,
                inProgress: assignedTasks.filter((t) => t.status === 'En Progreso')
                    .length,
            };
        });

        res.status(200).json({
            success: true,
            data: {
                totalUsers: users.length,
                users: userStats,
            },
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error al generar reporte de usuarios',
            error: error.message,
        });
    }
};

/**
 * @desc    Exportar tareas a CSV
 * @route   GET /api/reports/export-csv
 * @access  Private
 */
export const exportTasksToCSV = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const tasks = await Task.find()
            .populate('projectId', 'name')
            .populate('assignedTo', 'username')
            .populate('createdBy', 'username');

        // Construir CSV
        let csv = 'ID,Título,Estado,Prioridad,Proyecto,Asignado A,Creado Por,Fecha Vencimiento\n';

        tasks.forEach((task) => {
            csv += `${task._id},"${task.title}","${task.status}","${task.priority}","${(task.projectId as any)?.name || 'N/A'
                }","${(task.assignedTo as any)?.username || 'Sin asignar'}","${(task.createdBy as any)?.username || 'N/A'
                }","${task.dueDate || 'Sin fecha'}"\n`;
        });

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=tasks_export.csv');
        res.status(200).send(csv);
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error al exportar CSV',
            error: error.message,
        });
    }
};
