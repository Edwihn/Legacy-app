import mongoose, { Document, Schema } from 'mongoose';

/**
 * Interface para el modelo Notification
 */
export interface INotification extends Document {
    _id: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    message: string;
    type: 'task_assigned' | 'task_updated' | 'task_completed' | 'comment_added' | 'general';
    read: boolean;
    relatedTaskId?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Schema de Mongoose para Notification
 */
const NotificationSchema = new Schema<INotification>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'El ID del usuario es requerido'],
        },
        message: {
            type: String,
            required: [true, 'El mensaje es requerido'],
            trim: true,
            maxlength: [500, 'El mensaje no puede exceder 500 caracteres'],
        },
        type: {
            type: String,
            enum: ['task_assigned', 'task_updated', 'task_completed', 'comment_added', 'general'],
            default: 'general',
        },
        read: {
            type: Boolean,
            default: false,
        },
        relatedTaskId: {
            type: Schema.Types.ObjectId,
            ref: 'Task',
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

// Índices para consultas eficientes
NotificationSchema.index({ userId: 1, read: 1, createdAt: -1 });

export default mongoose.model<INotification>('Notification', NotificationSchema);
