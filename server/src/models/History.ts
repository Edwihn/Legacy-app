import mongoose, { Document, Schema } from 'mongoose';

/**
 * Interface para el modelo History (Auditoría)
 */
export interface IHistory extends Document {
    _id: mongoose.Types.ObjectId;
    taskId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    action: 'CREATED' | 'STATUS_CHANGED' | 'TITLE_CHANGED' | 'ASSIGNED' | 'UPDATED' | 'DELETED';
    oldValue: string;
    newValue: string;
    changes?: Record<string, any>;
    createdAt: Date;
}

/**
 * Schema de Mongoose para History
 */
const HistorySchema = new Schema<IHistory>(
    {
        taskId: {
            type: Schema.Types.ObjectId,
            ref: 'Task',
            required: [true, 'El ID de la tarea es requerido'],
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'El ID del usuario es requerido'],
        },
        action: {
            type: String,
            enum: ['CREATED', 'STATUS_CHANGED', 'TITLE_CHANGED', 'ASSIGNED', 'UPDATED', 'DELETED'],
            required: [true, 'La acción es requerida'],
        },
        oldValue: {
            type: String,
            default: '',
        },
        newValue: {
            type: String,
            default: '',
        },
        changes: {
            type: Schema.Types.Mixed,
            default: {},
        },
    },
    {
        timestamps: { createdAt: true, updatedAt: false }, // Solo createdAt para history
    }
);

// Índice para búsquedas por tarea y fecha
HistorySchema.index({ taskId: 1, createdAt: -1 });

export default mongoose.model<IHistory>('History', HistorySchema);
