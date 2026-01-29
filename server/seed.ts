import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User';
import Project from './src/models/Project';
import Task from './src/models/Task';

dotenv.config();

/**
 * Script de inicialización de datos (seed)
 * Ejecutar con: npx ts-node seed.ts
 */

const seedData = async () => {
    try {
        // Conectar a MongoDB
        await mongoose.connect(process.env.MONGODB_URI || '');
        console.log('✅ Conectado a MongoDB');

        // Limpiar datos existentes (opcional - comentar si no quieres borrar)
        console.log('🗑️  Limpiando datos existentes...');
        await User.deleteMany({});
        await Project.deleteMany({});
        await Task.deleteMany({});

        // Crear usuarios
        console.log('👥 Creando usuarios...');
        const admin = await User.create({
            username: 'admin',
            password: 'admin',
            email: 'admin@taskmanager.com',
            role: 'admin',
        });

        const user1 = await User.create({
            username: 'user1',
            password: 'user1',
            email: 'user1@taskmanager.com',
            role: 'user',
        });

        const user2 = await User.create({
            username: 'user2',
            password: 'user2',
            email: 'user2@taskmanager.com',
            role: 'user',
        });

        console.log(`✅ Creados ${[admin, user1, user2].length} usuarios`);

        // Crear proyectos
        console.log('📁 Creando proyectos...');
        const projectDemo = await Project.create({
            name: 'Proyecto Demo',
            description: 'Proyecto de demostración del sistema',
        });

        const projectAlpha = await Project.create({
            name: 'Proyecto Alpha',
            description: 'Proyecto importante de alta prioridad',
        });

        const projectBeta = await Project.create({
            name: 'Proyecto Beta',
            description: 'Proyecto secundario de pruebas',
        });

        console.log(`✅ Creados ${[projectDemo, projectAlpha, projectBeta].length} proyectos`);

        // Crear tareas
        console.log('📝 Creando tareas...');
        const tasks = [
            {
                title: 'Configurar entorno de desarrollo',
                description: 'Instalar todas las dependencias y configurar variables de entorno',
                status: 'Completada',
                priority: 'Alta',
                projectId: projectDemo._id,
                assignedTo: admin._id,
                createdBy: admin._id,
                estimatedHours: 2,
                actualHours: 1.5,
            },
            {
                title: 'Diseñar base de datos',
                description: 'Crear esquemas de MongoDB para todas las entidades',
                status: 'Completada',
                priority: 'Crítica',
                projectId: projectDemo._id,
                assignedTo: admin._id,
                createdBy: admin._id,
                estimatedHours: 4,
                actualHours: 3,
            },
            {
                title: 'Implementar API REST',
                description: 'Desarrollar todos los endpoints del backend',
                status: 'En Progreso',
                priority: 'Alta',
                projectId: projectDemo._id,
                assignedTo: user1._id,
                createdBy: admin._id,
                estimatedHours: 16,
                actualHours: 10,
            },
            {
                title: 'Crear componentes de React',
                description: 'Desarrollar componentes reutilizables con TailwindCSS',
                status: 'En Progreso',
                priority: 'Alta',
                projectId: projectDemo._id,
                assignedTo: user2._id,
                createdBy: admin._id,
                estimatedHours: 12,
                actualHours: 5,
            },
            {
                title: 'Escribir documentación',
                description: 'Documentar API y guías de uso',
                status: 'Pendiente',
                priority: 'Media',
                projectId: projectDemo._id,
                assignedTo: user1._id,
                createdBy: admin._id,
                estimatedHours: 6,
                actualHours: 0,
            },
            {
                title: 'Pruebas de integración',
                description: 'Realizar pruebas completas del sistema',
                status: 'Pendiente',
                priority: 'Alta',
                projectId: projectAlpha._id,
                assignedTo: null,
                createdBy: admin._id,
                estimatedHours: 8,
                actualHours: 0,
            },
            {
                title: 'Optimización de rendimiento',
                description: 'Optimizar consultas y mejorar tiempos de respuesta',
                status: 'Pendiente',
                priority: 'Baja',
                projectId: projectAlpha._id,
                assignedTo: null,
                createdBy: admin._id,
                estimatedHours: 4,
                actualHours: 0,
            },
            {
                title: 'Implementar paginación',
                description: 'Agregar paginación a las listas de tareas y proyectos',
                status: 'Bloqueada',
                priority: 'Media',
                projectId: projectBeta._id,
                assignedTo: user2._id,
                createdBy: admin._id,
                estimatedHours: 3,
                actualHours: 0,
            },
        ];

        await Task.insertMany(tasks);
        console.log(`✅ Creadas ${tasks.length} tareas`);

        console.log('\n🎉 ¡Datos de prueba creados exitosamente!\n');
        console.log('Usuarios creados:');
        console.log('  - admin / admin (Administrador)');
        console.log('  - user1 / user1 (Usuario)');
        console.log('  - user2 / user2 (Usuario)');
        console.log('\nProyectos creados:');
        console.log(`  - ${projectDemo.name}`);
        console.log(`  - ${projectAlpha.name}`);
        console.log(`  - ${projectBeta.name}`);
        console.log(`\nTareas creadas: ${tasks.length}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error al crear datos de prueba:', error);
        process.exit(1);
    }
};

seedData();
