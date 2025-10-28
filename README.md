# PM3-yohita86

## Descripción

Este proyecto es una aplicación de gestión de turnos para un centro de servicios estéticos, desarrollada con un stack **Node.js + Express + TypeORM + PostgreSQL** en el backend y **React + Vite** en el frontend. Permite a los usuarios registrarse, iniciar sesión, solicitar turnos, cancelar turnos y contactar al centro por email.

---

## Características principales

### Backend
- **Node.js + Express** como servidor principal.
- **TypeORM** para ORM y manejo de entidades.
- **PostgreSQL** como base de datos.
- **Creación automática de tablas** con `synchronize: true`.
- **Validación de datos** con DTOs y `class-validator`.
- **Hash de contraseñas** usando el módulo nativo `crypto` de Node.js.
- **Manejo de sesiones** con `express-session`.
- **Envío de emails** con `nodemailer`.
- **Manejo centralizado de errores** y respuestas claras al frontend.
- **Rutas RESTful** para usuarios, turnos, servicios y autenticación.

### Frontend
- **React** con Vite para desarrollo rápido.
- **Context API** para manejo global de usuario y turnos.
- **Rutas protegidas** y control de acceso según autenticación.
- **Persistencia en LocalStorage** para usuario y turnos.
- **Validaciones y feedback de errores** amigables para el usuario.
- **Animaciones y video de fondo** para una mejor experiencia visual.

---

## Requisitos y tareas cumplidas

- [x] **Solucionado el error de módulo `crypto`**: ahora se usa el módulo nativo de Node.js para el hash de contraseñas.
- [x] **Creación automática de tablas**: al iniciar el backend, las tablas se crean si no existen.
- [x] **Variables de entorno**: configuración clara y segura usando `.env`.
- [x] **Registro y login funcionales**: tanto en backend como en frontend, con validaciones y feedback.
- [x] **Gestión de turnos**: crear, listar y cancelar turnos desde el frontend.
- [x] **Enrutamiento protegido y mejor UX/UI**: rutas privadas y navegación clara.
- [x] **Envío de emails**: formulario de contacto funcional.
- [x] **Manejo de errores**: tanto en backend como en frontend, con mensajes claros para el usuario.
- [x] **Listo para evaluación**: el proyecto arranca sin errores y cumple con los requisitos de la devolución.

---

## Instalación y ejecución

### Backend

1. Instala dependencias:
   ```bash
   cd back
   npm install
   ```
2. Configura el archivo `.env` en `back/` con tus datos de base de datos y email:
   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=tu_usuario
   DB_PASSWORD=tu_contraseña
   DB_DATABASE=nombre_db
   MAIL_USER=tu_email@gmail.com
   MAIL_PASS=tu_app_password
   ```
3. Inicia el backend:
   ```bash
   npm run dev
   ```

### Frontend

1. Instala dependencias:
   ```bash
   cd front/vite-project
   npm install
   ```
2. Inicia el frontend:
   ```bash
   npm run dev
   ```
3. Accede a la app en [http://localhost:5173](http://localhost:5173)

---

## Notas finales

- El backend debe estar corriendo en el puerto 3000 y el frontend en 5173.
- Las rutas y la autenticación están protegidas y validadas.
- El proyecto está listo para ser evaluado y cumple con todos los requisitos mencionados en la devolución.

---

## Autor

- **yohita86**

---
