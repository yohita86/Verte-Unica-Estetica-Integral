# 📚 GUÍA DE DEPLOYMENT EN RENDER

## Paso 1: Preparar el repositorio

Asegúrate de que tu repositorio en GitHub tenga:
- ✅ `render.yaml` (en la raíz del proyecto)
- ✅ `.env.example` (en `back/` y `front/vite-project/`)
- ✅ Los cambios en URLs de API (usando `import.meta.env.VITE_API_URL`)

Haz commit y push de estos cambios:
```bash
git add render.yaml back/.env.example front/vite-project/.env.example
git commit -m "Configuración para deployment en Render"
git push origin main
```

## Paso 2: Crear una Base de Datos PostgreSQL en Render

1. Ve a [render.com](https://render.com)
2. Crea una cuenta o inicia sesión
3. En el dashboard, haz clic en **"New +"** → **"PostgreSQL"**
4. Configura:
   - Name: `verte-unica-db`
   - Database: `verte_unica_db`
   - User: `postgres`
   - Region: Elige la más cercana a ti
   - Plan: **Free** (limitado a 90 días)
5. Copia las credenciales (host, puerto, usuario, contraseña)
6. ⚠️ **Nota**: Plan gratuito de Render expira en 90 días. Considera cambiar a otro proveedor de BD como **Supabase** (postgre gratuita) o **Railway**.

## Paso 3: Desplegar Backend

1. En el dashboard de Render, haz clic en **"New +"** → **"Web Service"**
2. Selecciona **"Deploy existing repository from GitHub"**
3. Conecta tu repositorio GitHub
4. Configura:
   - **Name**: `verte-unica-backend`
   - **Root Directory**: `back`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free

5. En **Environment Variables**, agrega:
   ```
   DB_HOST=<tu_host_postgresql_de_render>
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=<tu_password>
   DB_DATABASE=verte_unica_db
   MAIL_USER=<tu_email_gmail>
   MAIL_PASS=<tu_app_password_gmail>
   FRONTEND_URL=https://verte-unica-frontend.onrender.com
   PORT=10000
   ```

6. Haz clic en **"Create Web Service"**
7. Espera a que termine el build (verás logs en tiempo real)

## Paso 4: Desplegar Frontend

1. En el dashboard, haz clic en **"New +"** → **"Web Service"**
2. Selecciona tu repositorio GitHub
3. Configura:
   - **Name**: `verte-unica-frontend`
   - **Root Directory**: `front/vite-project`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run preview` (o instala `serve`: `npm install -g serve && serve -s dist`)
   - **Plan**: Free

4. En **Environment Variables**, agrega:
   ```
   VITE_API_URL=https://verte-unica-backend.onrender.com
   ```

5. Haz clic en **"Create Web Service"**

## Paso 5: Configurar CORS en Backend (si aún no está hecho)

Tu backend ya debe tener:
```typescript
cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
})
```

## Paso 6: Verificar el Deployment

- Backend estará en: `https://verte-unica-backend.onrender.com`
- Frontend estará en: `https://verte-unica-frontend.onrender.com`

Accede al frontend y prueba:
- Registro
- Login
- Crear turnos
- Cancelar turnos
- Enviar email de contacto

## Problemas Comunes

### ❌ Error: "Cannot find module"
- Asegúrate de que `npm install` está en el **Build Command**
- Verifica que `package.json` está en el directorio raíz del servicio

### ❌ Error: "CORS Policy"
- Verifica que `FRONTEND_URL` esté bien configurada en las variables de entorno del backend
- Recarga el frontend después de cambiar variables de entorno

### ❌ Error: "Database connection failed"
- Verifica las credenciales de PostgreSQL
- Asegúrate de que la BD existe en Render
- En logs de Render deberías ver mensajes de conexión

### ⚠️ Servicio entra en "Sleep"
- Plan gratuito de Render pone servicios en sleep tras 15 min de inactividad
- Primer acceso puede tardar 30-60 segundos
- Para evitar esto, considera plan pagado o cambiar de proveedor

## 💡 Alternativas a Render (más económicas)

- **Railway.app**: Excelente, $5 crédito gratis mensual
- **Vercel** (Frontend) + **Railway** (Backend)
- **Supabase** para PostgreSQL gratuito (sin expiración)
- **Firebase** para fullstack serverless

## 📌 Próximos Pasos

Después del deployment:
1. Prueba tu aplicación en producción
2. Registra tu dominio personalizado (opcional)
3. Configura SSL/TLS (Render lo hace automáticamente)
4. Monitorea logs y performance

¡Listo! Tu aplicación está en la nube. 🚀
