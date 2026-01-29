import mongoose, { Document, Schema } from 'mongoose';

/**
 * Interface para el modelo Project
 */
export interface IProject extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Schema de Mongoose para Project
 */
const ProjectSchema = new Schema<IProject>(
    {
        name: {
            type: String,
            required: [true, 'El nombre del proyecto es requerido'],
            trim: true,
            maxlength: [100, 'El nombre no puede exceder 100 caracteres'],
        },
        description: {
            type: String,
            trim: true,
            maxlength: [500, 'La descripción no puede exceder 500 caracteres'],
            default: '',
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<IProject>('Project', ProjectSchema);
