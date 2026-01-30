import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDatabase } from './config/database';

// Importar rutas
import authRoutes from './routes/authRoutes';
import projectRoutes from './routes/projectRoutes';
import taskRoutes from './routes/taskRoutes';
import commentRoutes from './routes/commentRoutes';
import historyRoutes from './routes/historyRoutes';
import notificationRoutes from './routes/notificationRoutes';
import reportRoutes from './routes/reportRoutes';

// Cargar variables de entorno
dotenv.config();

// Crear aplicación Express
const app: Application = express();

// Middleware
app.use(cors()); // Habilitar CORS para el frontend
app.use(express.json()); // Parser de JSON
app.use(express.urlencoded({ extended: true })); // Parser de URL encoded

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/reports', reportRoutes);

// Manejo de rutas no encontradas de la API
app.use('/api/*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Ruta de API no encontrada',
    });
});

// Ruta de prueba
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Task Manager API is running',
        timestamp: new Date().toISOString(),
    });
});

// Servir archivos estáticos del frontend en producción
import path from 'path';

// Servir archivos estáticos desde la carpeta client/dist
// La ruta es relativa al archivo compilado en dist/server.js
app.use(express.static(path.join(__dirname, '../../client/dist')));

// Manejar cualquier otra ruta devolviendo el index.html (para SPA)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
});

// Puerto
const PORT = process.env.PORT || 5000;

// Iniciar servidor
const startServer = async () => {
    try {
        // Conectar a MongoDB
        await connectDatabase();

        // Iniciar servidor Express
        app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
            console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
        });
    } catch (error) {
        console.error('❌ Error al iniciar el servidor:', error);
        process.exit(1);
    }
};

startServer();

export default app;
