# 🚀 Guía de Deployment en Vercel

## 📋 Pre-requisitos

- Cuenta en [Vercel](https://vercel.com)
- Repositorio Git (GitHub, GitLab o Bitbucket)
- Backend desplegado y URL disponible

## 🔧 Configuración

### 1. Variables de Entorno

Antes de desplegar, configura estas variables de entorno en Vercel:

```bash
NEXT_PUBLIC_API_URL=https://back-wallet-20.vercel.app
```

**Importante:** Esta URL debe apuntar a tu backend en producción.

### 2. Deployment desde GitHub

#### Opción A: Desde el Dashboard de Vercel

1. Ve a [vercel.com/new](https://vercel.com/new)
2. Selecciona "Import Git Repository"
3. Elige el repositorio de tu frontend
4. Configura las variables de entorno:
   - Click en "Environment Variables"
   - Agrega: `NEXT_PUBLIC_API_URL` con el valor de tu backend
5. Click en "Deploy"

#### Opción B: Usando Vercel CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login en Vercel
vercel login

# Deploy
vercel

# Deploy a producción
vercel --prod
```

### 3. Configurar Variables de Entorno en Vercel

1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Agrega:
   ```
   Name: NEXT_PUBLIC_API_URL
   Value: https://tu-backend.vercel.app
   Environment: Production, Preview, Development
   ```

## 🔄 Proceso de Build

Vercel ejecutará automáticamente:

```bash
npm install
npm run build
```

El proyecto usa Next.js 16.0.1, que se optimiza automáticamente para producción.

## ✅ Verificación Post-Deployment

Después del deployment, verifica:

1. **Página de Login** - `https://tu-app.vercel.app/login`
2. **Página de Registro** - `https://tu-app.vercel.app/register`
3. **Dashboard** - `https://tu-app.vercel.app/dashboard`
4. **Conexión con API** - Intenta hacer login

### Checklist de Verificación:

- [ ] La aplicación carga correctamente
- [ ] El login funciona
- [ ] El registro funciona
- [ ] Se pueden ver los servicios
- [ ] Se pueden ver las tarjetas de transporte
- [ ] Las transacciones se cargan
- [ ] No hay errores en la consola del navegador
- [ ] Las variables de entorno están correctamente configuradas

## 🐛 Troubleshooting

### Error: "Failed to fetch" o "Network Error"

**Problema:** La aplicación no puede conectarse al backend.

**Solución:**
1. Verifica que `NEXT_PUBLIC_API_URL` esté configurada
2. Asegúrate de que el backend esté desplegado y funcionando
3. Verifica CORS en el backend

### Error: 401 Unauthorized

**Problema:** El token JWT no es válido.

**Solución:**
1. Cierra sesión y vuelve a iniciar
2. Verifica que el backend use el mismo secret JWT
3. Limpia localStorage del navegador

### Build Fails

**Problema:** El build falla en Vercel.

**Solución:**
1. Verifica que `npm run build` funcione localmente
2. Revisa los logs de build en Vercel
3. Asegúrate de que todas las dependencias estén en `package.json`

## 🔐 Seguridad en Producción

### Headers de Seguridad

El proyecto incluye headers de seguridad en `vercel.json`:
- X-Content-Type-Options
- X-Frame-Options
- X-XSS-Protection
- Referrer-Policy

### Variables Sensibles

**NUNCA** commitees:
- `.env.local`
- `.env.production`
- Tokens o secrets

Solo commitea:
- `.env.example` (sin valores reales)

## 📊 Monitoring

### Ver Logs en Vercel

1. Ve a tu proyecto en Vercel
2. Click en "Deployments"
3. Selecciona el deployment
4. Click en "Functions" → "Logs"

### Analytics

Vercel Analytics está habilitado por defecto. Puedes ver:
- Visitas
- Performance
- Core Web Vitals

## 🔄 Actualizar la Aplicación

### Opción 1: Push a Git

Vercel detecta automáticamente cambios:

```bash
git add .
git commit -m "feat: nueva funcionalidad"
git push origin main
```

Vercel desplegará automáticamente.

### Opción 2: Vercel CLI

```bash
vercel --prod
```

## 🌍 Dominios Personalizados

Para agregar un dominio personalizado:

1. Ve a Settings → Domains
2. Agrega tu dominio
3. Configura los DNS según las instrucciones
4. Espera a la verificación (puede tomar hasta 48 horas)

## 📱 Preview Deployments

Cada Pull Request crea un preview deployment automático:

- URL única temporal
- Mismo entorno que producción
- Perfecto para testing antes de merge

## ⚡ Performance

### Optimizaciones Incluidas:

- ✅ Next.js 16 con App Router
- ✅ Compilación optimizada
- ✅ Lazy loading de componentes
- ✅ Imágenes optimizadas (si usas next/image)
- ✅ Code splitting automático
- ✅ CSS Minification
- ✅ JavaScript Minification

### Recomendaciones:

1. Usa `next/image` para imágenes
2. Implementa ISR (Incremental Static Regeneration) cuando sea posible
3. Usa React.lazy() para componentes grandes
4. Implementa loading states

## 🆘 Soporte

### Recursos:

- [Documentación de Vercel](https://vercel.com/docs)
- [Documentación de Next.js](https://nextjs.org/docs)
- [Vercel Community](https://github.com/vercel/vercel/discussions)

### Comandos Útiles:

```bash
# Ver logs en tiempo real
vercel logs

# Ver información del proyecto
vercel inspect

# Revertir a deployment anterior
vercel rollback [deployment-url]

# Ver lista de deployments
vercel ls

# Eliminar deployment
vercel remove [deployment-name]
```

## 📈 Métricas de Éxito

Después del deployment, monitorea:

1. **Build Time** - Debe ser < 2 minutos
2. **Response Time** - Debe ser < 500ms
3. **Error Rate** - Debe ser < 1%
4. **Core Web Vitals**:
   - LCP (Largest Contentful Paint) < 2.5s
   - FID (First Input Delay) < 100ms
   - CLS (Cumulative Layout Shift) < 0.1

## ✨ Features de Vercel

- 🚀 Edge Network (CDN global)
- 🔄 Automatic HTTPS
- 🌐 Global CDN
- 📊 Analytics incluido
- 🔐 DDoS protection
- ⚡ Serverless Functions
- 🎯 Preview Deployments

---

**¡Listo para producción!** 🎉

Si tienes problemas, revisa los logs en Vercel Dashboard o contacta al equipo de desarrollo.
