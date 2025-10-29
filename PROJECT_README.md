# 🏦 Wallet TIC - Frontend

Frontend de Next.js 14 para la aplicación Wallet TIC. Conectado con la API backend en: `https://back-wallet-20.vercel.app`

## ✅ Setup Completado

El proyecto está completamente configurado con:

- ✅ Next.js 14 con TypeScript
- ✅ Tailwind CSS
- ✅ shadcn/ui Components
- ✅ Axios con interceptors JWT
- ✅ Zustand para state management
- ✅ Middleware de protección de rutas
- ✅ Layout responsive con Sidebar y Navbar
- ✅ Página de Login funcional
- ✅ Página de Registro
- ✅ Dashboard con estadísticas

## 🚀 Comandos

```bash
# Instalar dependencias (si es necesario)
npm install

# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build

# Iniciar servidor de producción
npm start
```

## 📁 Estructura del Proyecto

```
wallet-simulator-frontend/
├── app/
│   ├── (auth)/                    # Rutas de autenticación
│   │   ├── login/
│   │   │   └── page.tsx          # Página de login
│   │   └── register/
│   │       └── page.tsx          # Página de registro
│   ├── (dashboard)/              # Rutas protegidas
│   │   ├── dashboard/
│   │   │   └── page.tsx          # Dashboard principal
│   │   └── layout.tsx            # Layout con Sidebar y Navbar
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home (redirect a login)
│   └── globals.css               # Estilos globales
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx            # Barra de navegación superior
│   │   └── Sidebar.tsx           # Menú lateral responsive
│   └── ui/                       # Componentes shadcn/ui
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       └── label.tsx
├── lib/
│   ├── axios.ts                  # Configuración de Axios + Interceptors
│   └── utils.ts                  # Utilidades (cn function)
├── store/
│   └── authStore.ts              # Zustand store de autenticación
├── middleware.ts                 # Middleware de protección de rutas
├── .env.local                    # Variables de entorno
└── components.json               # Configuración shadcn/ui
```

## 🔐 Autenticación

### Login
- **Ruta**: `/login`
- **Endpoint API**: `POST /auth/login`
- **Funcionalidad**: 
  - Formulario de email y password
  - Guarda token JWT en localStorage
  - Redirige a `/dashboard` tras login exitoso

### Registro
- **Ruta**: `/register`
- **Endpoint API**: `POST /auth/registro`
- **Funcionalidad**:
  - Formulario con nombre, email y password
  - Validación de contraseñas coincidentes
  - Auto-login después de registro

### Zustand Store
El store de autenticación (`store/authStore.ts`) maneja:
- Estado del usuario actual
- Token JWT
- Login/Logout
- Registro
- Persistencia en localStorage

## 🛡️ Protección de Rutas

El middleware (`middleware.ts`) protege automáticamente las rutas del dashboard:
- `/dashboard` - Dashboard principal
- `/profile` - Perfil de usuario
- `/transactions` - Transacciones
- `/services` - Servicios
- `/transport` - Tarjetas de transporte

Si no hay token, redirige automáticamente a `/login`.

## 🎨 Componentes UI

### Sidebar
- Navegación principal
- Información del usuario
- Saldo actual
- Responsive (mobile menu)

### Navbar
- Barra de búsqueda
- Notificaciones
- Botón de perfil

### Dashboard
- Tarjetas con estadísticas:
  - Saldo actual
  - Total de transacciones
  - Servicios activos
  - Tarjetas registradas
- Transacciones recientes
- Botones de acción rápida

## 🔧 Configuración

### Variables de Entorno (`.env.local`)
```env
NEXT_PUBLIC_API_URL=https://back-wallet-20.vercel.app
```

### Axios Interceptors
- **Request**: Añade automáticamente el token JWT en el header `Authorization`
- **Response**: Maneja errores 401 y redirige a login

## 📡 Endpoints Utilizados

### Autenticación
- `POST /auth/login` - Iniciar sesión
- `POST /auth/registro` - Registrar usuario

### Usuario
- `GET /profile` - Obtener perfil
- `GET /saldo` - Obtener saldo

### Transacciones
- `GET /transacciones` - Listar transacciones

### Wallet
- `GET /wallet/estado` - Estadísticas del wallet

## 🎯 Próximos Pasos

Para completar el frontend, puedes agregar:

1. **Página de Perfil** (`/profile`)
   - Ver y editar datos del usuario
   - Cambiar contraseña

2. **Página de Transacciones** (`/transactions`)
   - Lista completa de transacciones
   - Filtros y búsqueda
   - Paginación

3. **Página de Servicios** (`/services`)
   - Lista de servicios
   - Pagar servicios
   - Agregar nuevo servicio

4. **Página de Transporte** (`/transport`)
   - Tarjetas de transporte
   - Recargar tarjetas
   - Ver saldo de tarjetas

5. **Funcionalidades adicionales**
   - Transferir dinero
   - Recargar saldo
   - Buscar usuarios
   - Notificaciones
   - Gráficos y estadísticas

## 🧪 Testing

Para probar la aplicación:

1. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

2. Abre http://localhost:3000

3. Prueba el login con un usuario registrado en la API

4. Navega por el dashboard y verifica las funcionalidades

## 📚 Documentación de la API

Ver archivo adjunto: `API_DOCUMENTATION.md` con todas las rutas disponibles.

## 🎨 Personalización

### Colores (Tailwind)
Los colores principales están configurados en `app/globals.css`:
- Primary: Azul (`blue-600`)
- Success: Verde (`green-600`)
- Danger: Rojo (`red-600`)
- Sidebar: Slate oscuro (`slate-900`)

### Componentes shadcn/ui
Para agregar más componentes:
```bash
npx shadcn@latest add [component-name]
```

Ejemplos:
```bash
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add toast
npx shadcn@latest add table
```

## 🐛 Troubleshooting

### Error: "Unable to acquire lock"
Si obtienes este error, cierra todas las instancias de `npm run dev` y vuelve a ejecutar.

### Error: Token no válido
Verifica que la URL de la API en `.env.local` sea correcta y que el backend esté funcionando.

### Componentes no se ven
Asegúrate de que Tailwind esté correctamente configurado y que `globals.css` esté importado en el layout.

## 📞 Contacto

- **Backend API**: https://back-wallet-20.vercel.app
- **Repositorio Backend**: https://github.com/ramollino912/back-wallet

---

**Estado**: ✅ Setup Inicial Completo  
**Última actualización**: 29 de Octubre, 2025
