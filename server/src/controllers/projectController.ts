import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import Project from '../models/Project';

/**
 * @desc    Obtener todos los proyectos
 * @route   GET /api/projects
 * @access  Private
 */
export const getProjects = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const projects = await Project.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: projects.length,
            data: projects,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener proyectos',
            error: error.message,
        });
    }
};

/**
 * @desc    Obtener un proyecto por ID
 * @route   GET /api/projects/:id
 * @access  Private
 */
export const getProjectById = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            res.status(404).json({
                success: false,
                message: 'Proyecto no encontrado',
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: project,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener proyecto',
            error: error.message,
        });
    }
};

/**
 * @desc    Crear nuevo proyecto
 * @route   POST /api/projects
 * @access  Private
 */
export const createProject = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const { name, description } = req.body;

        if (!name) {
            res.status(400).json({
                success: false,
                message: 'El nombre del proyecto es requerido',
            });
            return;
        }

        const project = await Project.create({
            name,
            description: description || '',
        });

        res.status(201).json({
            success: true,
            data: project,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error al crear proyecto',
            error: error.message,
        });
    }
};

/**
 * @desc    Actualizar proyecto
 * @route   PUT /api/projects/:id
 * @access  Private
 */
export const updateProject = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const { name, description } = req.body;

        let project = await Project.findById(req.params.id);

        if (!project) {
            res.status(404).json({
                success: false,
                message: 'Proyecto no encontrado',
            });
            return;
        }

        project = await Project.findByIdAndUpdate(
            req.params.id,
            { name, description },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            data: project,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error al actualizar proyecto',
            error: error.message,
        });
    }
};

/**
 * @desc    Eliminar proyecto
 * @route   DELETE /api/projects/:id
 * @access  Private
 */
export const deleteProject = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            res.status(404).json({
                success: false,
                message: 'Proyecto no encontrado',
            });
            return;
        }

        await project.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Proyecto eliminado correctamente',
            data: {},
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar proyecto',
            error: error.message,
        });
    }
};
