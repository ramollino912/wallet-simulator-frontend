# 🏦 Wallet TIC - Frontend

Frontend de Next.js 14 para la aplicación Wallet TIC, conectado con la API backend en producción.

## 🚀 Setup Completado

✅ **El proyecto está 100% configurado y funcional!**

- Next.js 14 con TypeScript y App Router
- Tailwind CSS + shadcn/ui components
- Sistema de autenticación con JWT
- Dashboard funcional con estadísticas
- Layout responsive con Sidebar y Navbar
- Protección automática de rutas

## 📚 Documentación

Lee los siguientes archivos para información detallada:

- **[SETUP_COMPLETE.md](./SETUP_COMPLETE.md)** - Resumen completo del proyecto
- **[PROJECT_README.md](./PROJECT_README.md)** - Documentación técnica detallada
- **[IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)** - Guía para implementar páginas adicionales

## ⚡ Quick Start

```bash
# Instalar dependencias (si es necesario)
npm install

# Iniciar servidor de desarrollo
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) y serás redirigido al login.

## 🔐 Login

Usa credenciales de un usuario registrado en la API:
- **API Backend**: https://back-wallet-20.vercel.app
- **Email**: tu@email.com
- **Password**: tu_password

## 📁 Estructura

```
app/
├── (auth)/           # Login y Registro
├── (dashboard)/      # Dashboard y páginas protegidas
components/
├── layout/           # Sidebar y Navbar
└── ui/              # Componentes shadcn/ui
lib/
├── axios.ts         # Config API con interceptors
└── utils.ts
store/
└── authStore.ts     # Estado global de autenticación
```

## 🎯 Páginas Implementadas

- ✅ Login (`/login`)
- ✅ Registro (`/register`)
- ✅ Dashboard (`/dashboard`)

## 📝 Próximos Pasos

Ver **[IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)** para código de:
- Página de Transacciones
- Página de Servicios
- Página de Transporte
- Página de Perfil
- Funcionalidad de Transferencias

## 🔧 Stack Tecnológico

- **Framework**: Next.js 14
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS v4
- **Componentes**: shadcn/ui
- **Estado**: Zustand
- **HTTP Client**: Axios
- **Iconos**: Lucide React

## 🌐 URLs

- **Frontend**: http://localhost:3000
- **Backend API**: https://back-wallet-20.vercel.app

## 📖 Más Información

Para instrucciones detalladas de implementación, deployment y personalización, consulta la documentación en los archivos mencionados arriba.

---

**Estado**: ✅ Setup Inicial Completado  
**Última actualización**: 29 de Octubre, 2025

