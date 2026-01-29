import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

/**
 * Interface para el modelo User con tipado TypeScript
 */
export interface IUser extends Document {
    _id: mongoose.Types.ObjectId;
    username: string;
    password: string;
    email?: string;
    role: 'admin' | 'user';
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

/**
 * Schema de Mongoose para User
 */
const UserSchema = new Schema<IUser>(
    {
        username: {
            type: String,
            required: [true, 'El nombre de usuario es requerido'],
            unique: true,
            trim: true,
            minlength: [3, 'El nombre de usuario debe tener al menos 3 caracteres'],
        },
        password: {
            type: String,
            required: [true, 'La contraseña es requerida'],
            minlength: [3, 'La contraseña debe tener al menos 3 caracteres'],
            select: false, // No devolver la contraseña en las consultas por defecto
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
        },
        role: {
            type: String,
            enum: ['admin', 'user'],
            default: 'user',
        },
    },
    {
        timestamps: true, // Agrega createdAt y updatedAt automáticamente
    }
);

// Middleware: Hashear la contraseña antes de guardar
UserSchema.pre('save', async function (next) {
    // Solo hashear si la contraseña ha sido modificada
    if (!this.isModified('password')) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error: any) {
        next(error);
    }
});

// Método para comparar contraseñas
UserSchema.methods.comparePassword = async function (
    candidatePassword: string
): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>('User', UserSchema);
