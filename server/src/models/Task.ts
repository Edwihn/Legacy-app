import mongoose, { Document, Schema } from 'mongoose';

/**
 * Interface para el modelo Task
 */
export interface ITask extends Document {
    _id: mongoose.Types.ObjectId;
    title: string;
    description: string;
    status: 'Pendiente' | 'En Progreso' | 'Completada' | 'Bloqueada' | 'Cancelada';
    priority: 'Baja' | 'Media' | 'Alta' | 'Crítica';
    projectId: mongoose.Types.ObjectId;
    assignedTo: mongoose.Types.ObjectId | null;
    createdBy: mongoose.Types.ObjectId;
    dueDate: Date | null;
    estimatedHours: number;
    actualHours: number;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Schema de Mongoose para Task
 */
const TaskSchema = new Schema<ITask>(
    {
        title: {
            type: String,
            required: [true, 'El título de la tarea es requerido'],
            trim: true,
            maxlength: [200, 'El título no puede exceder 200 caracteres'],
        },
        description: {
            type: String,
            trim: true,
            maxlength: [1000, 'La descripción no puede exceder 1000 caracteres'],
            default: '',
        },
        status: {
            type: String,
            enum: ['Pendiente', 'En Progreso', 'Completada', 'Bloqueada', 'Cancelada'],
            default: 'Pendiente',
        },
        priority: {
            type: String,
            enum: ['Baja', 'Media', 'Alta', 'Crítica'],
            default: 'Media',
        },
        projectId: {
            type: Schema.Types.ObjectId,
            ref: 'Project',
            required: [true, 'El proyecto es requerido'],
        },
        assignedTo: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'El creador es requerido'],
        },
        dueDate: {
            type: Date,
            default: null,
        },
        estimatedHours: {
            type: Number,
            min: [0, 'Las horas estimadas no pueden ser negativas'],
            default: 0,
        },
        actualHours: {
            type: Number,
            min: [0, 'Las horas reales no pueden ser negativas'],
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

// Índices para mejorar el rendimiento de las consultas
TaskSchema.index({ projectId: 1, status: 1 });
TaskSchema.index({ assignedTo: 1 });
TaskSchema.index({ createdBy: 1 });

export default mongoose.model<ITask>('Task', TaskSchema);
