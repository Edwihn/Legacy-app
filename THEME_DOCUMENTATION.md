# Sistema de Temas Claro/Oscuro - Documentación

## Resumen de Cambios

Se ha implementado un sistema de temas claro y oscuro en la aplicación Legacy Task Manager sin afectar su lógica ni funcionamiento. Los usuarios ahora pueden alternar entre el tema claro (por defecto) y el tema oscuro según sus preferencias.

## Características Implementadas

### 1. **Variables CSS para Temas**
- Se crearon variables CSS personalizadas en `:root` para el tema claro
- Se definieron variables equivalentes para el tema oscuro usando la clase `.dark-theme` en el `body`
- Variables incluyen colores para:
  - Fondos (body, contenedor, header, formularios, tablas)
  - Botones (normal, hover, activo)
  - Pestañas (activa, inactiva, hover)
  - Texto y bordes

### 2. **Botón de Cambio de Tema**
- Ubicado en el header de la aplicación junto al botón "Salir"
- Icono visual: 🌓 (luna y sol)
- Texto: "Cambiar Tema"
- Fácilmente accesible para el usuario

### 3. **Persistencia de Preferencias**
- La preferencia del tema se guarda en `localStorage`
- Al recargar la página, se restaura automáticamente el último tema seleccionado
- Key en localStorage: `'appTheme'` con valores `'light'` o `'dark'`

### 4. **Transiciones Suaves**
- Todas las propiedades de color tienen transiciones CSS de 0.3s
- El cambio entre temas es visualmente agradable y no abrupto

## Archivos Modificados

### `style.css`
- **Líneas 3-21**: Variables CSS para tema claro
- **Líneas 23-41**: Variables CSS para tema oscuro
- **Líneas 43-50**: Aplicación de variables y transiciones en `body`
- **Todo el archivo**: Reemplazo de colores hardcodeados por variables CSS
- **Líneas 243-258**: Estilos del botón de cambio de tema

### `index.html`
- **Líneas 29-35**: Modificación del header para incluir el botón de cambio de tema

### `app.js`
- **Línea 175**: Llamada a `loadTheme()` al inicializar la aplicación
- **Líneas 178-190**: Nuevas funciones para gestión de tema:
  - `loadTheme()`: Carga el tema guardado del localStorage
  - `toggleTheme()`: Alterna entre tema claro y oscuro

## Paleta de Colores

### Tema Claro (Por Defecto)
- Fondo body: `#c0c0c0` (gris claro)
- Contenedor: `#fff` (blanco)
- Headers: `#e0e0e0` (gris muy claro)
- Texto: `#000` (negro)
- Bordes: `#000` (negro)

### Tema Oscuro
- Fondo body: `#2a2a2a` (gris muy oscuro)
- Contenedor: `#1e1e1e` (gris oscuro profundo)
- Headers: `#333333` (gris medio oscuro)
- Texto: `#e0e0e0` (gris claro)
- Bordes: `#555555` (gris medio)

## Cómo Usar

1. **Iniciar sesión** en la aplicación (usuario: admin, contraseña: admin)
2. **Localizar el botón** "🌓 Cambiar Tema" en el header superior derecho
3. **Hacer clic** en el botón para alternar entre tema claro y oscuro
4. **La preferencia se guarda automáticamente** y se mantiene al recargar la página

## Características Técnicas

### Compatibilidad
- ✅ Funciona en navegadores modernos que soportan CSS Variables
- ✅ Compatible con Chrome, Firefox, Safari, Edge (versiones recientes)
- ✅ Utiliza `localStorage` para persistencia (ampliamente soportado)

### Rendimiento
- ✅ Cambio instantáneo con transiciones suaves (300ms)
- ✅ No requiere recarga de página
- ✅ Mínimo impacto en el rendimiento

### Mantenibilidad
- ✅ Todos los colores centralizados en variables CSS
- ✅ Fácil agregar nuevos temas modificando solo las variables
- ✅ Código modular y bien comentado

## Funcionamiento Sin Afectar la Lógica

**Importante**: Todas las modificaciones son puramente visuales y de interfaz de usuario:

- ❌ **NO se modificó** ninguna función de negocio
- ❌ **NO se afectó** la gestión de tareas, proyectos o usuarios
- ❌ **NO se cambió** el sistema de almacenamiento en localStorage
- ❌ **NO se alteró** el flujo de login/logout
- ✅ **SOLO se agregaron** estilos visuales y dos funciones auxiliares para el tema
- ✅ **SOLO se modificó** el HTML para agregar el botón de cambio de tema

## Testing Recomendado

1. Verificar que el tema claro se muestra correctamente por defecto
2. Cambiar al tema oscuro y verificar que todos los elementos se ven bien
3. Recargar la página y verificar que el tema se mantiene
4. Probar todas las pestañas (Tareas, Proyectos, Comentarios, etc.)
5. Verificar formularios, tablas y botones en ambos temas
6. Comprobar que la funcionalidad de la app funciona igual en ambos temas

## Notas Adicionales

- El tema oscuro utiliza una paleta que reduce el cansancio visual
- Los colores mantienen suficiente contraste para accesibilidad
- El icono 🌓 es universalmente reconocido para cambio de tema
- Los bordes en tema oscuro son más sutiles (#555 vs #000) para mejor estética
