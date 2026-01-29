import mongoose from 'mongoose';

/**
 * Función para conectar con MongoDB Atlas
 * Utiliza variables de entorno para la cadena de conexión
 */
export const connectDatabase = async (): Promise<void> => {
    try {
        const mongoUri = process.env.MONGODB_URI || '';

        if (!mongoUri) {
            throw new Error('MONGODB_URI no está definido en las variables de entorno');
        }

        await mongoose.connect(mongoUri);

        console.log('✅ MongoDB Atlas conectado exitosamente');

        // Event listeners para monitoreo de la conexión
        mongoose.connection.on('error', (error) => {
            console.error('❌ Error de conexión MongoDB:', error);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('⚠️ MongoDB desconectado');
        });

    } catch (error) {
        console.error('❌ Error al conectar con MongoDB Atlas:', error);
        process.exit(1); // Salir si no se puede conectar a la BD
    }
};
