import mongoose, { Document, Schema } from 'mongoose';

/**
 * Interface para el modelo Comment
 */
export interface IComment extends Document {
    _id: mongoose.Types.ObjectId;
    taskId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    commentText: string;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Schema de Mongoose para Comment
 */
const CommentSchema = new Schema<IComment>(
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
        commentText: {
            type: String,
            required: [true, 'El texto del comentario es requerido'],
            trim: true,
            maxlength: [1000, 'El comentario no puede exceder 1000 caracteres'],
        },
    },
    {
        timestamps: true,
    }
);

// Índice para búsquedas rápidas por tarea
CommentSchema.index({ taskId: 1, createdAt: -1 });

export default mongoose.model<IComment>('Comment', CommentSchema);
