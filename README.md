# Task Manager - MERN Stack (Refactorizado)

Sistema profesional de gestión de tareas y proyectos construido con el stack MERN (MongoDB, Express, React, Node.js) utilizando TypeScript y arquitectura MVC.

## 📋 Tabla de Contenidos

- [Descripción](#descripción)
- [Tecnologías](#tecnologías)
- [Arquitectura](#arquitectura)
- [Características](#características)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Uso](#uso)
- [API Endpoints](#api-endpoints)
- [Estructura del Proyecto](#estructura-del-proyecto)

## 🎯 Descripción

Este proyecto es una refactorización completa del Task Manager legacy, transformando un sistema monolítico de 4 archivos en una aplicación profesional, escalable y mantenible. La nueva arquitectura separa claramente las responsabilidades en capas, utiliza TypeScript para tipado estático, y sigue las mejores prácticas de desarrollo moderno.

## 🚀 Tecnologías

### Backend
- **Node.js** - Runtime de JavaScript
- **Express** - Framework web
- **TypeScript** - Tipado estático
- **MongoDB Atlas** - Base de datos NoSQL en la nube
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticación basada en tokens
- **bcryptjs** - Hashing de contraseñas

### Frontend
- **React 18** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **React Router v6** - Enrutamiento
- **Axios** - Cliente HTTP
- **TailwindCSS** - Framework de estilos
- **React Hot Toast** - Notificaciones

## 🏗️ Arquitectura

El proyecto sigue el patrón **MVC (Modelo-Vista-Controlador)**:

```
┌─────────────────────────────────────────────────────────┐
│                      CLIENTE (React)                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │  Pages   │  │Components│  │ Services │             │
│  └──────────┘  └──────────┘  └──────────┘             │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
                    [API REST]
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                    SERVIDOR (Express)                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │  Routes  │→│Controllers│→│  Models  │             │
│  └──────────┘  └──────────┘  └──────────┘             │
│                                      │                   │
└──────────────────────────────────────│───────────────────┘
                                       ▼
                              [MongoDB Atlas]
```

### Separación de Responsabilidades

- **Models**: Definición de esquemas y validaciones de datos
- **Controllers**: Lógica de negocio y manejo de peticiones
- **Routes**: Definición de endpoints y middleware
- **Services (Frontend)**: Capa de abstracción para llamadas API
- **Components**: Componentes React reutilizables
- **Pages**: Vistas completas de la aplicación

## ✨ Características

### Funcionalidades del Sistema

✅ **Autenticación y Autorización**
- Login/Registro con JWT
- Protección de rutas
- Roles de usuario (admin/user)

✅ **Gestión de Tareas (CRUD Completo)**
- Crear, leer, actualizar y eliminar tareas
- Estados: Pendiente, En Progreso, Completada, Bloqueada, Cancelada
- Prioridades: Baja, Media, Alta, Crítica
- Asignación a usuarios
- Fechas de vencimiento
- Estimación de horas

✅ **Gestión de Proyectos**
- CRUD completo de proyectos
- Agrupación de tareas por proyecto

✅ **Sistema de Comentarios**
- Comentarios en tareas
- Asociación con usuarios

✅ **Historial y Auditoría**
- Registro automático de cambios
- Trazabilidad completa de acciones

✅ **Notificaciones**
- Notificaciones de asignación
- Notificaciones de actualización
- Sistema de lectura/no leída

✅ **Búsqueda Avanzada**
- Filtros múltiples
- Búsqueda por texto
- Filtros combinados

✅ **Reportes**
- Reporte de tareas por estado
- Reporte de proyectos
- Reporte de usuarios
- Exportación a CSV

## 🔧 Instalación

### Prerrequisitos

- Node.js >= 18.x
- npm o yarn
- Cuenta en MongoDB Atlas (o MongoDB local)

### 1. Clonar el repositorio

```bash
cd "d:/CUATRI 7/Legacy"
```

### 2. Instalar dependencias del backend

```bash
cd server
npm install
```

### 3. Instalar dependencias del frontend

```bash
cd ../client
npm install
```

## ⚙️ Configuración

### Backend - Variables de Entorno

Crear un archivo `.env` en la carpeta `server/`:

```env
PORT=5000
NODE_ENV=development

# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://TU_USUARIO:TU_PASSWORD@cluster0.xxxxx.mongodb.net/taskmanager?retryWrites=true&w=majority

# JWT Secret (usa un valor complejo en producción)
JWT_SECRET=tu_super_secreto_jwt_cambialo_en_produccion
JWT_EXPIRE=7d
```

**Pasos para configurar MongoDB Atlas:**

1. Crear cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Crear un nuevo cluster (gratis)
3. Crear un usuario de base de datos
4. Obtener la cadena de conexión
5. Reemplazar `<username>`, `<password>` y el nombre del cluster en `MONGODB_URI`
6. Agregar tu IP a la whitelist en Atlas

### Frontend - Variables de Entorno (Opcional)

Crear archivo `.env` en la carpeta `client/` si necesitas cambiar la URL del API:

```env
VITE_API_URL=http://localhost:5000/api
```

## 🎮 Uso

### Modo Desarrollo

#### 1. Iniciar el backend

```bash
cd server
npm run dev
```

El servidor correrá en `http://localhost:5000`

#### 2. Iniciar el frontend (en otra terminal)

```bash
cd client
npm run dev
```

El cliente correrá en `http://localhost:3000`

### Credenciales por Defecto

**Usuario:** admin  
**Contraseña:** admin

(Estos usuarios debes crearlos mediante el endpoint de registro o desde MongoDB)

### Modo Producción

```bash
# Backend
cd server
npm run build
npm start

# Frontend
cd client
npm run build
npm run preview
```

## 📡 API Endpoints

### Autenticación

```
POST   /api/auth/register      - Registrar nuevo usuario
POST   /api/auth/login         - Login de usuario
GET    /api/auth/me            - Obtener usuario actual (protegida)
```

### Proyectos

```
GET    /api/projects           - Obtener todos los proyectos
GET    /api/projects/:id       - Obtener proyecto por ID
POST   /api/projects           - Crear nuevo proyecto
PUT    /api/projects/:id       - Actualizar proyecto
DELETE /api/projects/:id       - Eliminar proyecto
```

### Tareas

```
GET    /api/tasks              - Obtener todas las tareas (con filtros opcionales)
GET    /api/tasks/:id          - Obtener tarea por ID
POST   /api/tasks              - Crear nueva tarea
PUT    /api/tasks/:id          - Actualizar tarea
DELETE /api/tasks/:id          - Eliminar tarea
POST   /api/tasks/search       - Búsqueda avanzada
```

### Comentarios

```
GET    /api/comments/task/:taskId  - Obtener comentarios de una tarea
POST   /api/comments               - Crear comentario
DELETE /api/comments/:id           - Eliminar comentario
```

### Historial

```
GET    /api/history                - Obtener todo el historial
GET    /api/history/task/:taskId   - Obtener historial de una tarea
```

### Notificaciones

```
GET    /api/notifications          - Obtener notificaciones del usuario
PUT    /api/notifications/mark-read - Marcar como leídas
DELETE /api/notifications/:id      - Eliminar notificación
```

### Reportes

```
GET    /api/reports/tasks          - Reporte de tareas
GET    /api/reports/projects       - Reporte de proyectos
GET    /api/reports/users          - Reporte de usuarios
GET    /api/reports/export-csv     - Exportar tareas a CSV
```

## 📁 Estructura del Proyecto

```
task-manager-mern/
├── server/                          # Backend
│   ├── src/
│   │   ├── config/
│   │   │   └── database.ts         # Configuración MongoDB
│   │   ├── models/                 # Modelos Mongoose
│   │   │   ├── User.ts
│   │   │   ├── Project.ts
│   │   │   ├── Task.ts
│   │   │   ├── Comment.ts
│   │   │   ├── History.ts
│   │   │   └── Notification.ts
│   │   ├── controllers/            # Lógica de negocio
│   │   │   ├── authController.ts
│   │   │   ├── projectController.ts
│   │   │   ├── taskController.ts
│   │   │   ├── commentController.ts
│   │   │   ├── historyController.ts
│   │   │   ├── notificationController.ts
│   │   │   └── reportController.ts
│   │   ├── routes/                 # Definición de rutas
│   │   │   ├── authRoutes.ts
│   │   │   ├── projectRoutes.ts
│   │   │   ├── taskRoutes.ts
│   │   │   ├── commentRoutes.ts
│   │   │   ├── historyRoutes.ts
│   │   │   ├── notificationRoutes.ts
│   │   │   └── reportRoutes.ts
│   │   ├── middleware/
│   │   │   └── authMiddleware.ts   # JWT y autorización
│   │   └── server.ts               # Punto de entrada
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── client/                          # Frontend
│   ├── src/
│   │   ├── components/             # Componentes React
│   │   │   ├── Auth/
│   │   │   │   └── LoginForm.tsx
│   │   │   ├── Layout/
│   │   │   ├── Tasks/
│   │   │   ├── Projects/
│   │   │   └── ...
│   │   ├── pages/                  # Páginas/Vistas
│   │   │   ├── LoginPage.tsx
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── TasksPage.tsx
│   │   │   └── ProjectsPage.tsx
│   │   ├── services/               # Servicios API
│   │   │   ├── api.ts
│   │   │   ├── authService.ts
│   │   │   ├── taskService.ts
│   │   │   └── projectService.ts
│   │   ├── App.tsx
│   │   ├── index.tsx
│   │   └── index.css
│   ├── public/
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── index.html
│
└── README.md
```

## 🎨 Diseño y UX

El frontend utiliza **TailwindCSS** con un diseño moderno que incluye:

- ✨ Gradientes vibrantes
- 🌊 Animaciones fluidas
- 🎯 Microinteracciones
- 📱 Diseño responsivo
- 🌙 Esquema de colores profesional
- 🔔 Notificaciones toast

## 🔐 Seguridad

- ✅ Autenticación JWT
- ✅ Contraseñas hasheadas con bcrypt
- ✅ Validación de datos en backend
- ✅ Protección de rutas
- ✅ CORS configurado
- ✅ Variables de entorno para secretos

## 📝 Scripts Disponibles

### Backend
```bash
npm run dev       # Modo desarrollo con hot-reload
npm run build     # Compilar TypeScript
npm start         # Ejecutar en producción
```

### Frontend
```bash
npm run dev       # Servidor de desarrollo
npm run build     # Build para producción
npm run preview   # Preview del build
```

## 🚧 Próximos Pasos

Para completar la aplicación, se recomienda:

1. **Implementar componentes faltantes:**
   - TaskForm completo con validaciones
   - TaskList con paginación
   - ProjectForm y ProjectList
   - CommentSection
   - HistoryViewer
   - NotificationPanel
   - SearchPanel
   - ReportPanel

2. **Mejoras adicionales:**
   - Tests unitarios y de integración
   - Paginación en las listas
   - Filtros avanzados en tiempo real
   - WebSockets para notificaciones en tiempo real
   - Dashboard con gráficas
   - Temas claro/oscuro
   - Internacionalización (i18n)

## 🤝 Contribución

Este proyecto fue refactorizado desde un sistema legacy como ejercicio de arquitectura de software y buenas prácticas.

## 📄 Licencia

MIT

## 👨‍💻 Autor

Refactorizado por un Arquitecto de Software Senior especializado en MERN Stack.

---

**Nota:** Este proyecto demuestra la transformación de código legacy en una arquitectura moderna, escalable y profesional siguiendo estándares de la industria.
