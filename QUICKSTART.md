# Guía de Inicio Rápido - Task Manager MERN

## 🚀 Inicio Rápido (5 minutos)

### Paso 1: Instalar Dependencias

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### Paso 2: Configurar MongoDB Atlas

1. Ve a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Crea una cuenta gratuita
3. Crea un nuevo cluster (Free tier M0)
4. Espera a que se cree (2-3 minutos)
5. Haz clic en "Connect" → "Connect your application"
6. Copia la cadena de conexión

### Paso 3: Configurar Variables de Entorno

Crea `server/.env`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://admin:password123@cluster0.xxxxx.mongodb.net/taskmanager?retryWrites=true&w=majority
JWT_SECRET=mi_secreto_super_seguro_2024
JWT_EXPIRE=7d
```

⚠️ **Importante:** Reemplaza `admin`, `password123` y la URL del cluster con tus credenciales reales.

### Paso 4: Iniciar el Proyecto

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

Verás:
```
✅ MongoDB Atlas conectado exitosamente
🚀 Servidor corriendo en puerto 5000
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

Verás:
```
VITE v5.0.11  ready in 500 ms

➜  Local:   http://localhost:3000/
```

### Paso 5: Crear el Primer Usuario

#### Opción A: Usando Postman/Thunder Client/Insomnia

```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "username": "admin",
  "password": "admin",
  "email": "admin@example.com",
  "role": "admin"
}
```

#### Opción B: Usando cURL

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin","email":"admin@example.com","role":"admin"}'
```

### Paso 6: Acceder a la Aplicación

1. Abre tu navegador en `http://localhost:3000`
2. Inicia sesión con:
   - **Usuario:** admin
   - **Contraseña:** admin

¡Listo! 🎉

---

## 🔧 Solución de Problemas Comunes

### Error: "Cannot connect to MongoDB"

**Causa:** Credenciales incorrectas o IP no autorizada

**Solución:**
1. Ve a MongoDB Atlas → Security → Network Access
2. Haz clic en "Add IP Address"
3. Selecciona "Allow Access from Anywhere" (0.0.0.0/0)
4. Guarda los cambios

### Error: "Port 5000 is already in use"

**Solución:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

O cambia el puerto en `server/.env`:
```env
PORT=5001
```

### Error: "Module not found"

**Solución:**
```bash
# Eliminar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Error de TypeScript en el Frontend

**Solución:**
```bash
cd client
npm install --save-dev @types/react @types/react-dom
```

---

## 📦 Crear Datos de Prueba

Puedes usar estos scripts para crear datos de prueba rápidamente:

### Crear Proyectos

```http
POST http://localhost:5000/api/projects
Authorization: Bearer <TU_TOKEN>
Content-Type: application/json

{
  "name": "Proyecto Demo",
  "description": "Mi primer proyecto de prueba"
}
```

### Crear Tareas

```http
POST http://localhost:5000/api/tasks
Authorization: Bearer <TU_TOKEN>
Content-Type: application/json

{
  "title": "Tarea de Prueba",
  "description": "Esta es una tarea de ejemplo",
  "status": "Pendiente",
  "priority": "Alta",
  "projectId": "<ID_DEL_PROYECTO>",
  "dueDate": "2024-12-31"
}
```

---

## 🎯 Verificar que Todo Funciona

### Health Check del Backend

```bash
curl http://localhost:5000/api/health
```

Respuesta esperada:
```json
{
  "success": true,
  "message": "Task Manager API is running",
  "timestamp": "2024-01-29T..."
}
```

### Verificar Conexión a MongoDB

Si ves este mensaje en la consola del servidor:
```
✅ MongoDB Atlas conectado exitosamente
```

Todo está funcionando correctamente.

---

## 🚀 Siguientes Pasos

1. **Explora el Dashboard** en `http://localhost:3000/dashboard`
2. **Crea tu primer proyecto** desde la sección de proyectos
3. **Agrega tareas** y asígnalas
4. **Revisa las notificaciones** cuando se asignan tareas
5. **Genera reportes** para ver estadísticas

---

## 📚 Recursos Adicionales

- [Documentación de MongoDB Atlas](https://docs.atlas.mongodb.com/)
- [Documentación de Express](https://expressjs.com/)
- [Documentación de React](https://react.dev/)
- [Documentación de TailwindCSS](https://tailwindcss.com/)

---

¿Necesitas ayuda? Revisa el README principal o busca en la documentación de las tecnologías utilizadas.
