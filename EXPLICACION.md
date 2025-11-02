# 📱 Wallet Simulator - Explicación Completa del Proyecto

## 🎯 ¿Qué es este proyecto?

**Wallet Simulator** es una aplicación web de **billetera virtual** (como Mercado Pago o Ualá) donde los usuarios pueden:

- 💰 Tener dinero virtual en su cuenta
- 💸 Transferir dinero a otros usuarios
- 🚌 Cargar tarjetas de transporte (SUBE, MOVE, etc.)
- 💡 Pagar servicios (luz, agua, gas, celular)
- 📊 Ver el historial de todas sus transacciones
- 👤 Gestionar su perfil

Es como un banco en tu navegador, pero todo es virtual y para aprender/practicar.

---

## 🏗️ Arquitectura: ¿Cómo está construido?

### **Frontend + Backend separados**

```
┌─────────────────┐         ┌─────────────────┐
│   NAVEGADOR     │ ←──→    │   SERVIDOR      │
│   (Frontend)    │  Internet│   (Backend)     │
│   React/Next.js │         │   Node.js       │
└─────────────────┘         └─────────────────┘
      📱 Lo que ves             💾 Base de datos
```

**Frontend** (este proyecto):
- Es lo que ves en tu navegador
- Los botones, formularios, colores
- Se comunica con el backend para obtener/guardar datos
- URL: Se despliega en Vercel

**Backend** (otro proyecto separado):
- Es el servidor que guarda los datos
- Base de datos con usuarios, transacciones, tarjetas
- Verifica contraseñas, permisos, etc.
- URL: `https://back-wallet-20.vercel.app`

---

## 🛠️ Tecnologías Usadas (Explicadas Simple)

### **1. Next.js 16**
**¿Qué es?** Un framework (conjunto de herramientas) para crear aplicaciones web con React.

**¿Por qué se usa?**
- Hace que tu sitio web cargue rápido
- Organiza el código en carpetas (cada carpeta = una página)
- Optimiza todo automáticamente para producción

**Analogía:** Es como usar WordPress en lugar de crear un sitio desde cero con HTML puro.

**Ejemplo práctico:**
```
app/
  login/
    page.tsx  ← Esto crea la página /login
  home/
    page.tsx  ← Esto crea la página /home
```

Cada carpeta dentro de `app/` es una ruta (URL) de tu sitio.

---

### **2. TypeScript**
**¿Qué es?** JavaScript con "tipos" - le dices al código qué tipo de dato esperas.

**Sin TypeScript (JavaScript):**
```javascript
function sumar(a, b) {
  return a + b;
}
sumar(5, "hola");  // ❌ Esto NO da error pero está mal
```

**Con TypeScript:**
```typescript
function sumar(a: number, b: number): number {
  return a + b;
}
sumar(5, "hola");  // ✅ Error: "hola" no es un número
```

**¿Por qué se usa?**
- Detecta errores ANTES de ejecutar el código
- Te ayuda con sugerencias mientras escribes (autocompletado)
- Hace el código más fácil de entender

---

### **3. React**
**¿Qué es?** Librería para crear interfaces de usuario con "componentes" reutilizables.

**Componente = Bloque de Lego:**

Imagina que tienes estas piezas:
```tsx
// Componente "Botón"
<Button>Pagar</Button>

// Componente "Tarjeta"
<Card>
  <h2>Servicio de Luz</h2>
  <Button>Pagar</Button>
</Card>
```

Puedes reutilizar `<Button>` en muchos lugares sin copiar código.

**Cómo funciona:**
1. Cuando cambias algo (ej: presionas un botón)
2. React actualiza SOLO esa parte de la página
3. No necesita recargar todo el navegador

---

### **4. Zustand (Estado Global)**
**¿Qué es?** Un "almacén" para guardar datos que muchas partes de la app necesitan.

**El problema que resuelve:**

```
Sidebar (muestra saldo) ─┐
                          ├─ Necesitan saber el saldo del usuario
Home (muestra saldo)     ─┤
                          │
Perfil (muestra saldo)   ─┘
```

**Sin Zustand:**
- Cada componente pide el saldo al backend (3 llamadas)
- Si recargas saldo, hay que actualizar 3 lugares

**Con Zustand:**
```typescript
// store/authStore.ts
const useAuthStore = create((set) => ({
  user: { nombre: "Juan", saldo: 1000 },
  
  actualizarSaldo: (nuevoSaldo) => {
    set({ user: { ...user, saldo: nuevoSaldo } });
  }
}));

// En cualquier componente:
const { user } = useAuthStore();
console.log(user.saldo);  // ← Todos ven el mismo dato
```

**Analogía:** Es como tener un pizarrón donde todos miran los mismos datos en lugar de que cada uno tenga su propia nota.

---

### **5. Axios (Cliente HTTP)**
**¿Qué es?** Librería para hacer llamadas al backend (pedir/enviar datos).

**Cómo funciona la comunicación:**

```
Frontend                     Backend
  │                            │
  │──── "Dame el saldo" ───────>│
  │         (GET /saldo)        │
  │                             │
  │<─── { saldo: 1000 } ────────│
  │                             │
```

**Código:**
```typescript
// Obtener datos (GET)
const response = await api.get('/saldo');
console.log(response.data.saldo);  // 1000

// Enviar datos (POST)
await api.post('/transporte/tarjetas/recargar', {
  monto: 500
});
```

**Ventajas sobre fetch (método nativo):**
- Interceptors: Puedes agregar el token JWT automáticamente a todas las llamadas
- Manejo de errores más fácil
- Sintaxis más limpia

---

### **6. Tailwind CSS**
**¿Qué es?** Framework de CSS con clases pre-hechas para estilos.

**CSS tradicional:**
```css
/* archivo.css */
.mi-boton {
  background-color: blue;
  color: white;
  padding: 10px;
  border-radius: 5px;
}
```
```html
<button class="mi-boton">Click</button>
```

**Con Tailwind:**
```html
<button class="bg-blue-500 text-white p-2 rounded">
  Click
</button>
```

**Ventajas:**
- No necesitas escribir archivos CSS separados
- Clases descriptivas: `bg-blue-500` = fondo azul
- Responsive fácil: `md:flex-row` = en pantallas medianas, orientación horizontal

**Clases comunes:**
- `flex` = Flexbox (alinear elementos)
- `grid` = Grid layout (cuadrícula)
- `p-4` = padding de 1rem (16px)
- `text-xl` = texto extra grande
- `bg-blue-500` = fondo azul
- `rounded-lg` = bordes redondeados

---

### **7. shadcn/ui (Componentes UI)**
**¿Qué es?** Librería de componentes visuales pre-diseñados.

**Componentes disponibles:**
```tsx
<Button variant="default">Guardar</Button>
<Card>Contenido de tarjeta</Card>
<Input type="text" placeholder="Email" />
<Dialog>Modal/Popup</Dialog>
```

**¿Por qué se usa?**
- Ya tienen estilos bonitos
- Accesibles (funcionan con teclado, lectores de pantalla)
- Personalizables con Tailwind

**Diferencia con otras librerías:**
- Material-UI / Chakra: Instalas un paquete npm
- shadcn/ui: Copias el código a tu proyecto (lo posees)

---

## 🗂️ Estructura de Carpetas Explicada

```
wallet-simulator-frontend/
│
├── app/                          ← Todas las páginas
│   ├── (auth)/                   ← Grupo: Autenticación
│   │   ├── login/page.tsx        ← Página /login
│   │   └── register/page.tsx     ← Página /register
│   │
│   ├── (dashboard)/              ← Grupo: Rutas protegidas
│   │   ├── home/page.tsx         ← Página /home
│   │   ├── transferir/page.tsx   ← Página /transferir
│   │   ├── sube/page.tsx         ← Página /sube
│   │   ├── servicios/page.tsx    ← Página /servicios
│   │   ├── historial/page.tsx    ← Página /historial
│   │   └── perfil/page.tsx       ← Página /perfil
│   │
│   ├── layout.tsx                ← Layout principal (navbar, metadata)
│   ├── page.tsx                  ← Página raíz /
│   └── globals.css               ← Estilos globales
│
├── components/                   ← Componentes reutilizables
│   ├── layout/
│   │   ├── Navbar.tsx            ← Barra superior
│   │   └── Sidebar.tsx           ← Menú lateral
│   │
│   ├── transporte/               ← Componentes para SUBE/tarjetas
│   │   ├── TarjetaCard.tsx       ← Muestra una tarjeta
│   │   ├── ModalRegistrarTarjeta.tsx
│   │   ├── ModalRecargar.tsx
│   │   └── EstadisticasPanel.tsx
│   │
│   ├── servicios/                ← Componentes para servicios
│   │   ├── ServicioCard.tsx
│   │   ├── ModalCrearServicio.tsx
│   │   └── ResumenServicios.tsx
│   │
│   └── ui/                       ← Componentes base (shadcn/ui)
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       └── label.tsx
│
├── lib/                          ← Utilidades y servicios
│   ├── axios.ts                  ← Configuración de Axios
│   ├── transporteService.ts      ← Llamadas API de transporte
│   ├── serviciosService.ts       ← Llamadas API de servicios
│   └── utils.ts                  ← Funciones auxiliares
│
├── store/                        ← Estado global (Zustand)
│   ├── authStore.ts              ← Login, usuario, saldo
│   ├── transporteStore.ts        ← Tarjetas de transporte
│   └── serviciosStore.ts         ← Servicios (luz, agua, gas)
│
├── middleware.ts                 ← Protección de rutas
├── vercel.json                   ← Configuración de deployment
├── .env.example                  ← Variables de entorno (ejemplo)
└── package.json                  ← Dependencias del proyecto
```

---

## 🔐 Sistema de Autenticación (JWT)

### **¿Qué es JWT (JSON Web Token)?**

Es como un **pase VIP digital** que prueba quién eres sin necesidad de verificar tu contraseña cada vez.

**Flujo completo de autenticación:**

```
┌──────────────────────────────────────────────────────────┐
│ 1. REGISTRO                                              │
└──────────────────────────────────────────────────────────┘

Usuario                Frontend              Backend
  │                       │                      │
  │─ Completa formulario ─>│                     │
  │  (nombre, email, pass) │                     │
  │                        │                     │
  │                        │─ POST /auth/register >│
  │                        │  { email, password } │
  │                        │                      │
  │                        │<─── { token, usuario }│
  │                        │                      │
  │<─ Redirige a /home ────│                     │


┌──────────────────────────────────────────────────────────┐
│ 2. LOGIN                                                 │
└──────────────────────────────────────────────────────────┘

Usuario                Frontend              Backend
  │                       │                      │
  │─ Ingresa credenciales >│                     │
  │                        │                     │
  │                        │─ POST /auth/login ──>│
  │                        │  { email, password } │
  │                        │                      │
  │                        │<─── { token, usuario }│
  │                        │                      │
  │                        │─ Guarda token en     │
  │                        │   localStorage       │
  │                        │                      │
  │<─ Redirige a /home ────│                     │


┌──────────────────────────────────────────────────────────┐
│ 3. PETICIÓN PROTEGIDA (obtener saldo)                   │
└──────────────────────────────────────────────────────────┘

Usuario                Frontend              Backend
  │                       │                      │
  │─ Entra a /home ───────>│                     │
  │                        │                     │
  │                        │─ GET /saldo ────────>│
  │                        │  Headers:            │
  │                        │   Authorization:     │
  │                        │   Bearer eyJhbGc...  │
  │                        │                      │
  │                        │<─── { saldo: 1000 }──│
  │                        │                      │
  │<─ Muestra: $1000.00 ───│                     │


┌──────────────────────────────────────────────────────────┐
│ 4. TOKEN EXPIRADO                                        │
└──────────────────────────────────────────────────────────┘

Usuario                Frontend              Backend
  │                       │                      │
  │─ Intenta hacer algo ──>│                     │
  │                        │                     │
  │                        │─ GET /saldo ────────>│
  │                        │  Token: eyJhbGc...   │
  │                        │                      │
  │                        │<─── 401 Unauthorized │
  │                        │                      │
  │                        │─ Elimina token       │
  │                        │   de localStorage    │
  │                        │                      │
  │<─ Redirige a /login ───│                     │
```

### **¿Cómo funciona el token?**

**El token se ve así:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTIzLCJlbWFpbCI6Imp1YW5AZXhhbXBsZS5jb20ifQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

**Se divide en 3 partes:**
1. **Header** (configuración): `eyJhbGc...`
2. **Payload** (datos del usuario): `eyJpZCI6MTIz...` → `{ id: 123, email: "juan@example.com" }`
3. **Signature** (firma de seguridad): `SflKxwRJ...`

**Ventajas:**
- El backend NO necesita guardar sesiones
- El token contiene info del usuario (id, email)
- Si alguien modifica el token, la firma no coincide → Rechazado

---

## 📡 API del Backend - Todas las Rutas

### **Base URL:** `https://back-wallet-20.vercel.app`

---

### **🔐 Autenticación**

#### **POST /auth/register**
Registra un nuevo usuario.

**Request:**
```json
{
  "nombre": "Juan",
  "apellido": "Pérez",
  "email": "juan@example.com",
  "password": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": 1,
    "nombre": "Juan",
    "apellido": "Pérez",
    "email": "juan@example.com",
    "saldo": 0.00
  }
}
```

---

#### **POST /auth/login**
Inicia sesión.

**Request:**
```json
{
  "email": "juan@example.com",
  "password": "123456"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": 1,
    "nombre": "Juan",
    "apellido": "Pérez",
    "email": "juan@example.com",
    "saldo": 1000.50
  }
}
```

---

### **💰 Saldo**

#### **GET /saldo**
Obtiene el saldo actual del usuario.

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**
```json
{
  "saldo": "1000.50"
}
```

---

#### **POST /saldo/recargar**
Recarga saldo en la cuenta.

**Request:**
```json
{
  "monto": 500
}
```

**Response:**
```json
{
  "success": true,
  "message": "Saldo recargado exitosamente",
  "saldoAnterior": "1000.50",
  "saldoNuevo": "1500.50"
}
```

---

### **💸 Transferencias**

#### **GET /transferencias**
Obtiene todas las transferencias (enviadas y recibidas).

**Response:**
```json
{
  "transferencias": [
    {
      "id": 1,
      "emisorId": 1,
      "receptorId": 2,
      "monto": "100.00",
      "fecha": "2025-11-02T15:30:00Z",
      "emisor": {
        "nombre": "Juan",
        "apellido": "Pérez"
      },
      "receptor": {
        "nombre": "María",
        "apellido": "García"
      }
    }
  ]
}
```

---

#### **POST /transferencias**
Realiza una transferencia a otro usuario.

**Request:**
```json
{
  "emailReceptor": "maria@example.com",
  "monto": 100
}
```

**Response:**
```json
{
  "success": true,
  "message": "Transferencia realizada exitosamente",
  "transferencia": {
    "id": 1,
    "monto": "100.00",
    "fecha": "2025-11-02T15:30:00Z"
  },
}
```

---

### **🚌 Transporte (Tarjetas SUBE, MOVE, etc.)**

#### **GET /transporte/empresas**
Obtiene todas las empresas de transporte disponibles.

**Response:**
```json
{
  "empresas": [
    {
      "id": 1,
      "nombre": "SUBE",
      "descripcion": "Sistema Único de Boleto Electrónico"
    },
    {
      "id": 2,
      "nombre": "MOVE",
      "descripcion": "Tarjeta de transporte provincial"
    },
    {
      "id": 3,
      "nombre": "DIPLOMATICO",
      "descripcion": "Sistema de transporte diplomático"
    },
    {
      "id": 4,
      "nombre": "BONDICARD",
      "descripcion": "Tarjeta de transporte urbano"
    }
  ]
}
```

---

#### **GET /transporte/tarjetas**
Obtiene todas las tarjetas activas del usuario.

**Response:**
```json
{
  "tarjetas": [
    {
      "id": 1,
      "usuarioId": 1,
      "empresaId": 1,
      "numeroTarjeta": "1234-5678-9012-3456",
      "saldo": "150.00",
      "activa": true,
      "empresa": {
        "id": 1,
        "nombre": "SUBE"
      }
    }
  ]
}
```

---

#### **GET /transporte/tarjetas/desactivadas**
Obtiene tarjetas desactivadas (eliminadas).

**Response:**
```json
{
  "tarjetas": [
    {
      "id": 2,
      "numeroTarjeta": "9876-5432-1098-7654",
      "saldo": "50.00",
      "activa": false,
      "empresa": {
        "nombre": "MOVE"
      }
    }
  ]
}
```

---

#### **POST /transporte/tarjetas**
Registra una nueva tarjeta de transporte.

**Request:**
```json
{
  "empresaId": 1,
  "numeroTarjeta": "1234-5678-9012-3456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Tarjeta registrada exitosamente",
  "tarjeta": {
    "id": 1,
    "numeroTarjeta": "1234-5678-9012-3456",
    "saldo": "0.00",
    "activa": true,
    "empresa": {
      "nombre": "SUBE"
    }
  }
}
```

---

#### **POST /transporte/tarjetas/:id/recargar**
Recarga saldo en una tarjeta.

**Request:**
```json
{
  "monto": 500
}
```

**Response:**
```json
{
  "success": true,
  "message": "Tarjeta recargada exitosamente",
  "saldoAnterior": "150.00",
  "saldoNuevo": "650.00",
  "saldoUsuario": "500.50"
}
```

---

#### **DELETE /transporte/tarjetas/:id**
Elimina (desactiva) una tarjeta.

**Response:**
```json
{
  "success": true,
  "message": "Tarjeta eliminada exitosamente"
}
```

---

#### **POST /transporte/tarjetas/:id/reactivar**
Reactiva una tarjeta desactivada.

**Response:**
```json
{
  "success": true,
  "message": "Tarjeta reactivada exitosamente",
  "tarjeta": {
    "id": 1,
    "activa": true
  }
}
```

---

#### **GET /transporte/tarjetas/:id/saldo**
Obtiene el saldo de una tarjeta específica.

**Response:**
```json
{
  "saldo": "650.00"
}
```

---

#### **GET /transporte/estadisticas**
Obtiene estadísticas de las tarjetas del usuario.

**Response:**
```json
{
  "totalTarjetas": 3,
  "saldoTotal": "800.00",
  "tarjetasPorEmpresa": {
    "SUBE": 2,
    "MOVE": 1
  },
  "tarjetas": [
    {
      "id": 1,
      "numeroTarjeta": "1234-5678-9012-3456",
      "saldo": "650.00",
      "empresa": {
        "nombre": "SUBE"
      }
    }
  ]
}
```

---

### **💡 Servicios (Luz, Agua, Gas, Celular)**

#### **GET /servicios/proveedores**
Obtiene todos los proveedores de servicios por tipo.

**Response:**
```json
{
  "proveedores": {
    "luz": [
      { "id": 1, "nombre": "Edenor", "tipo": "luz" },
      { "id": 2, "nombre": "Edesur", "tipo": "luz" }
    ],
    "agua": [
      { "id": 3, "nombre": "AySA", "tipo": "agua" },
      { "id": 4, "nombre": "ABSA", "tipo": "agua" }
    ],
    "gas": [
      { "id": 5, "nombre": "MetroGAS", "tipo": "gas" },
      { "id": 6, "nombre": "Camuzzi", "tipo": "gas" }
    ],
    "celular": [
      { "id": 7, "nombre": "Personal", "tipo": "celular" },
      { "id": 8, "nombre": "Movistar", "tipo": "celular" },
      { "id": 9, "nombre": "Claro", "tipo": "celular" }
    ]
  }
}
```

---

#### **GET /servicios**
Obtiene todos los servicios del usuario.

**Response:**
```json
{
  "servicios": [
    {
      "id": 1,
      "usuarioId": 1,
      "proveedorId": 1,
      "numeroCliente": "123456789",
      "monto": "5000.00",
      "fechaVencimiento": "2025-11-15",
      "pagado": false,
      "proveedor": {
        "id": 1,
        "nombre": "Edenor",
        "tipo": "luz"
      }
    }
  ]
}
```

---

#### **POST /servicios**
Crea un nuevo servicio para pagar.

**Request:**
```json
{
  "proveedorId": 1,
  "numeroCliente": "123456789",
  "monto": 5000,
  "fechaVencimiento": "2025-11-15"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Servicio creado exitosamente",
  "servicio": {
    "id": 1,
    "numeroCliente": "123456789",
    "monto": "5000.00",
    "fechaVencimiento": "2025-11-15",
    "pagado": false,
    "proveedor": {
      "nombre": "Edenor",
      "tipo": "luz"
    }
  }
}
```

---

#### **POST /servicios/:id/pagar**
Paga un servicio específico.

**Response:**
```json
{
  "success": true,
  "message": "Servicio pagado exitosamente",
  "servicio": {
    "id": 1,
    "pagado": true
  },
  "saldoNuevo": "3000.00"
}
```

---

#### **POST /servicios/pagar-todos**
Paga todos los servicios pendientes de una vez.

**Response:**
```json
{
  "success": true,
  "message": "Todos los servicios fueron pagados exitosamente",
  "cantidadPagados": 3,
  "totalPagado": "15000.00",
  "saldoNuevo": "500.00"
}
```

---

#### **DELETE /servicios/:id**
Elimina un servicio.

**Response:**
```json
{
  "success": true,
  "message": "Servicio eliminado exitosamente"
}
```

---

#### **PUT /servicios/celular/:id**
Cambia el servicio de celular (solo puede haber 1 activo).

**Request:**
```json
{
  "nuevoProveedorId": 8
}
```

**Response:**
```json
{
  "success": true,
  "message": "Servicio de celular cambiado exitosamente",
  "servicio": {
    "id": 2,
    "proveedor": {
      "nombre": "Movistar"
    }
  }
}
```

---

#### **DELETE /servicios/celular/limpiar**
Elimina todos los servicios de celular (útil para resetear).

**Response:**
```json
{
  "success": true,
  "message": "Servicios de celular eliminados",
  "cantidadEliminados": 2
}
```

---

## 🔄 Flujos Completos de Uso

### **Flujo 1: Usuario se registra y hace su primera recarga**

```
┌─────────────────────────────────────────────────────────────┐
│ PASO 1: Registro                                            │
└─────────────────────────────────────────────────────────────┘

1. Usuario va a /register
2. Completa formulario:
   - Nombre: "Juan"
   - Apellido: "Pérez"
   - Email: "juan@example.com"
   - Password: "123456"
3. Click en "Registrarse"

🔹 Frontend:
   - Valida que todos los campos estén llenos
   - Llama a authStore.register()

🔹 Store (authStore.ts):
   - Llama a api.post('/auth/register', datos)
   - Guarda token en localStorage
   - Guarda usuario en el estado
   - Redirige a /home

🔹 Backend:
   - Verifica que el email no exista
   - Hashea la contraseña (bcrypt)
   - Crea usuario en la base de datos
   - Genera token JWT
   - Retorna token + datos del usuario


┌─────────────────────────────────────────────────────────────┐
│ PASO 2: Ver saldo inicial                                   │
└─────────────────────────────────────────────────────────────┘

1. Usuario llega a /home
2. Página se carga

🔹 Frontend (home/page.tsx):
   - useEffect se ejecuta al montar
   - Llama a api.get('/saldo')

🔹 Backend:
   - Verifica token JWT
   - Obtiene usuario de la base de datos
   - Retorna { saldo: "0.00" }

🔹 Frontend:
   - Actualiza store: updateUser({ saldo: 0 })
   - Muestra: "Tu saldo: $0.00"


┌─────────────────────────────────────────────────────────────┐
│ PASO 3: Recarga de saldo                                    │
└─────────────────────────────────────────────────────────────┘

1. Usuario click en botón "Ingresar"
2. Va a /ingresar
3. Ingresa monto: $1000
4. Click en "Recargar"

🔹 Frontend (ingresar/page.tsx):
   - Valida que monto > 0
   - Llama a api.post('/saldo/recargar', { monto: 1000 })

🔹 Backend:
   - Verifica token
   - Suma 1000 al saldo del usuario
   - Actualiza base de datos
   - Retorna { saldoNuevo: "1000.00" }

🔹 Frontend:
   - Actualiza store: updateUser({ saldo: 1000 })
   - Muestra mensaje: "¡Saldo recargado exitosamente!"
   - Redirige a /home después de 2 segundos
   - Sidebar ahora muestra: "$1000.00"
```

---

### **Flujo 2: Usuario registra y recarga tarjeta SUBE**

```
┌─────────────────────────────────────────────────────────────┐
│ PASO 1: Ir a página SUBE                                    │
└─────────────────────────────────────────────────────────────┘

1. Usuario click en "SUBE" en el sidebar
2. Va a /sube
3. Página se carga

🔹 Frontend (sube/page.tsx):
   - useEffect ejecuta:
     * cargarEmpresas() → GET /transporte/empresas
     * cargarTarjetas() → GET /transporte/tarjetas
     * cargarEstadisticas() → GET /transporte/estadisticas

🔹 Store (transporteStore.ts):
   - Guarda empresas: [SUBE, MOVE, DIPLOMATICO, BONDICARD]
   - Guarda tarjetas: [] (vacío porque es nuevo usuario)
   - Guarda estadísticas: { totalTarjetas: 0, saldoTotal: 0 }

🔹 Frontend:
   - Muestra mensaje: "No tienes tarjetas registradas"
   - Muestra botón: "Registrar Nueva Tarjeta"


┌─────────────────────────────────────────────────────────────┐
│ PASO 2: Registrar tarjeta                                   │
└─────────────────────────────────────────────────────────────┘

1. Usuario click en "Registrar Nueva Tarjeta"
2. Se abre modal (ModalRegistrarTarjeta)
3. Usuario selecciona:
   - Empresa: "SUBE"
   - Número: "1234-5678-9012-3456"
4. Click en "Registrar"

🔹 Frontend (ModalRegistrarTarjeta.tsx):
   - Valida formato de número (16 dígitos)
   - Llama a transporteStore.registrarTarjeta()

🔹 Store (transporteStore.ts):
   - Llama a transporteService.registrarTarjeta()
   - Servicio llama: POST /transporte/tarjetas

🔹 Backend:
   - Verifica que el número no esté en uso
   - Crea tarjeta con saldo 0
   - Retorna tarjeta creada

🔹 Frontend:
   - Cierra modal
   - Recarga lista de tarjetas
   - Muestra: "Tarjeta registrada exitosamente"
   - Ahora se ve la TarjetaCard con saldo $0.00


┌─────────────────────────────────────────────────────────────┐
│ PASO 3: Recargar tarjeta                                    │
└─────────────────────────────────────────────────────────────┘

1. Usuario ve su tarjeta SUBE con saldo $0.00
2. Click en botón "Recargar"
3. Se abre modal (ModalRecargar)
4. Usuario selecciona:
   - Monto rápido: $500
   - O ingresa monto custom: $300
5. Ve preview:
   - "Tu saldo quedará en: $700.00"
   - "Saldo de la tarjeta quedará en: $300.00"
6. Click en "Confirmar Recarga"

🔹 Frontend (ModalRecargar.tsx):
   - Valida que user.saldo >= monto
   - Si no alcanza → muestra: "Saldo insuficiente"
   - Si alcanza → llama a transporteStore.recargarTarjeta()

🔹 Store (transporteStore.ts):
   - Llama a transporteService.recargarTarjeta(tarjetaId, 300)
   - Servicio llama: POST /transporte/tarjetas/1/recargar

🔹 Backend:
   - Verifica que usuario tenga saldo suficiente
   - Descuenta $300 del saldo del usuario
   - Suma $300 al saldo de la tarjeta
   - Actualiza base de datos
   - Retorna nuevos saldos

🔹 Frontend:
   - Cierra modal
   - Actualiza saldo usuario: authStore.updateUser({ saldo: 700 })
   - Recarga tarjetas (ahora muestra $300.00)
   - Recarga estadísticas
   - Muestra: "Tarjeta recargada exitosamente"
   - Sidebar ahora muestra: "$700.00"
```

---

### **Flujo 3: Usuario crea y paga servicio de luz**

```
┌─────────────────────────────────────────────────────────────┐
│ PASO 1: Ir a página Servicios                               │
└─────────────────────────────────────────────────────────────┘

1. Usuario click en "Servicios"
2. Va a /servicios
3. Página se carga

🔹 Frontend (servicios/page.tsx):
   - useEffect ejecuta:
     * cargarProveedores() → GET /servicios/proveedores
     * cargarServicios() → GET /servicios

🔹 Store (serviciosStore.ts):
   - Guarda proveedores por tipo:
     * luz: [Edenor, Edesur]
     * agua: [AySA, ABSA]
     * gas: [MetroGAS, Camuzzi]
     * celular: [Personal, Movistar, Claro]
   - Guarda servicios: [] (vacío porque no hay servicios creados)

🔹 Frontend:
   - Muestra ResumenServicios:
     * Total servicios: 0
     * Total pendiente: $0.00
     * Total pagado: $0.00
   - Muestra: "No tienes servicios registrados"
   - Muestra botón: "Crear Nuevo Servicio"


┌─────────────────────────────────────────────────────────────┐
│ PASO 2: Crear servicio                                      │
└─────────────────────────────────────────────────────────────┘

1. Usuario click en "Crear Nuevo Servicio"
2. Se abre modal (ModalCrearServicio)
3. Usuario selecciona:
   - Tipo: "Luz"
   - Proveedor: "Edenor" (se filtra según el tipo)
   - Número de cliente: "123456789"
   - Monto: $5000
   - Fecha vencimiento: "15/11/2025"
4. Click en "Crear Servicio"

🔹 Frontend (ModalCrearServicio.tsx):
   - Valida campos obligatorios
   - Valida que monto > 0
   - Valida que fecha sea futura
   - Si tipo es "celular" → verifica que no haya otro celular activo
   - Llama a serviciosStore.crearServicio()

🔹 Store (serviciosStore.ts):
   - Llama a serviciosService.crearServicio()
   - Servicio llama: POST /servicios

🔹 Backend:
   - Verifica que el proveedor exista
   - Si es celular → verifica que no haya otro servicio celular activo
   - Crea servicio con estado pagado: false
   - Retorna servicio creado

🔹 Frontend:
   - Cierra modal
   - Recarga lista de servicios
   - Muestra: "Servicio creado exitosamente"
   - Ahora se ve la ServicioCard:
     * 💡 Edenor
     * Cliente: 123456789
     * Monto: $5000.00
     * Vence: 15/11/2025
     * Estado: PENDIENTE (badge amarillo)


┌─────────────────────────────────────────────────────────────┐
│ PASO 3: Pagar servicio                                      │
└─────────────────────────────────────────────────────────────┘

1. Usuario ve su servicio de luz pendiente
2. Click en botón "Pagar" en la ServicioCard
3. Se abre confirmación:
   "¿Confirmas que quieres pagar el servicio de Edenor por $5000.00?"
4. Click en "Confirmar"

🔹 Frontend (servicios/page.tsx):
   - Verifica que user.saldo >= 5000
   - Si no alcanza → muestra: "Saldo insuficiente"
   - Si alcanza → llama a serviciosStore.pagarServicio(servicioId)

🔹 Store (serviciosStore.ts):
   - Llama a serviciosService.pagarServicio(servicioId)
   - Servicio llama: POST /servicios/1/pagar

🔹 Backend:
   - Verifica que servicio exista y esté pendiente
   - Verifica que usuario tenga saldo suficiente
   - Descuenta $5000 del saldo del usuario
   - Marca servicio como pagado: true
   - Actualiza base de datos
   - Retorna servicio actualizado y nuevo saldo

🔹 Frontend:
   - Actualiza saldo: authStore.updateUser({ saldo: 2000 })
   - Recarga lista de servicios
   - Muestra: "Servicio pagado exitosamente"
   - ServicioCard ahora muestra:
     * Estado: PAGADO (badge verde)
     * Botón "Pagar" desaparece
   - ResumenServicios actualiza:
     * Total pagado: $5000.00
   - Sidebar muestra nuevo saldo: "$2000.00"
```

---

### **Flujo 4: Usuario hace transferencia a otro usuario**

```
┌─────────────────────────────────────────────────────────────┐
│ Transferencia completa                                      │
└─────────────────────────────────────────────────────────────┘

1. Usuario (Juan) va a /transferir
2. Completa formulario:
   - Email destinatario: "maria@example.com"
   - Monto: $500
   - Concepto: "Préstamo"
3. Click en "Transferir"

🔹 Frontend (transferir/page.tsx):
   - Valida que monto > 0
   - Valida que monto <= user.saldo
   - Valida formato de email
   - Muestra confirmación:
     "¿Confirmas la transferencia de $500.00 a maria@example.com?"
4. Usuario confirma

🔹 Frontend:
   - Llama a api.post('/transferencias', datos)

🔹 Backend:
   - Verifica que emisor tenga saldo suficiente
   - Busca receptor por email
   - Si no existe → Error: "Usuario no encontrado"
   - Descuenta $500 de Juan
   - Suma $500 a María
   - Crea registro de transferencia
   - Actualiza base de datos (transacción SQL)
   - Retorna transferencia creada

🔹 Frontend:
   - Actualiza saldo: updateUser({ saldo: 1500 })
   - Muestra: "Transferencia realizada exitosamente"
   - Limpia formulario
   - Sidebar muestra: "$1500.00"

┌─────────────────────────────────────────────────────────────┐
│ María recibe notificación (si estuviera conectada)          │
└─────────────────────────────────────────────────────────────┘

🔹 Cuando María inicie sesión:
   - Su saldo se actualiza automáticamente
   - Ve en /historial la transferencia recibida:
     * "Recibido de Juan Pérez"
     * Monto: +$500.00
     * Concepto: "Préstamo"
```

---

## 🎨 Componentes y Su Función

### **Componentes de Layout**

#### **Navbar.tsx**
Barra superior de navegación.

**Funciones:**
- Muestra logo de la app
- Botón de logout
- En mobile: botón hamburguesa para abrir sidebar

**Tecnologías:**
- Lucide Icons (Menu, LogOut)
- Tailwind: `sticky top-0` (se queda arriba al scrollear)

---

#### **Sidebar.tsx**
Menú lateral con navegación y saldo.

**Funciones:**
- Muestra nombre y email del usuario
- Muestra saldo actual (se actualiza automáticamente)
- Links a todas las páginas:
  * Home, Transferir, Ingresar, SUBE, Servicios, Historial, Perfil
- Botón de logout
- En mobile: se oculta y se abre con el botón hamburguesa

**Cómo obtiene el saldo:**
```typescript
const { user } = useAuthStore();  // ← Lee del store global
const saldo = user?.saldo || 0;
```

**Responsive:**
- Desktop: Siempre visible a la izquierda
- Mobile: Se abre/cierra con botón

---

### **Componentes de Transporte**

#### **TarjetaCard.tsx**
Muestra una tarjeta de transporte.

**Props:**
```typescript
{
  tarjeta: {
    id: 1,
    numeroTarjeta: "1234-5678-9012-3456",
    saldo: 150,
    empresa: { nombre: "SUBE" }
  },
  onRecargar: (id) => {},    // Función para recargar
  onEliminar: (id) => {}     // Función para eliminar
}
```

**Visualización:**
- Color según empresa:
  * SUBE → Azul (`bg-blue-500`)
  * MOVE → Verde (`bg-green-500`)
  * DIPLOMATICO → Púrpura (`bg-purple-500`)
  * BONDICARD → Naranja (`bg-orange-500`)
- Muestra número de tarjeta formateado
- Muestra saldo con 2 decimales
- Botones: "Recargar" y "Eliminar"

---

#### **ModalRegistrarTarjeta.tsx**
Modal para registrar nueva tarjeta.

**Campos:**
- Select de empresa (SUBE, MOVE, etc.)
- Input de número de tarjeta
- Validación de 16 dígitos

**Flujo:**
1. Usuario selecciona empresa
2. Ingresa número
3. Click en "Registrar"
4. Valida → Llama al store → Cierra modal

---

#### **ModalRecargar.tsx**
Modal para recargar saldo de tarjeta.

**Funcionalidades:**
- Botones de montos rápidos: $100, $500, $1000, $2000
- Input para monto personalizado
- Preview en tiempo real:
  * "Tu saldo quedará en: $X"
  * "Saldo de tarjeta quedará en: $Y"
- Validación de saldo insuficiente
- Botón "Confirmar" deshabilitado si no alcanza

**Cálculos:**
```typescript
const nuevoSaldoUsuario = user.saldo - monto;
const nuevoSaldoTarjeta = tarjeta.saldo + monto;
const insufficient = monto > user.saldo;
```

---

#### **EstadisticasPanel.tsx**
Panel de estadísticas de tarjetas.

**Muestra:**
- Total de tarjetas activas
- Saldo total en todas las tarjetas
- Promedio de saldo por tarjeta
- Distribución por empresa (barras de progreso):
  * SUBE: 2 tarjetas (66%)
  * MOVE: 1 tarjeta (33%)

**Cálculos:**
```typescript
const totalTarjetas = estadisticas.totalTarjetas;
const saldoTotal = estadisticas.tarjetas.reduce((sum, t) => sum + t.saldo, 0);
const promedio = saldoTotal / totalTarjetas;
```

---

### **Componentes de Servicios**

#### **ServicioCard.tsx**
Muestra un servicio a pagar.

**Props:**
```typescript
{
  servicio: {
    id: 1,
    numeroCliente: "123456789",
    monto: 5000,
    fechaVencimiento: "2025-11-15",
    pagado: false,
    proveedor: { nombre: "Edenor", tipo: "luz" }
  },
  onPagar: (id) => {},
  onEliminar: (id) => {}
}
```

**Visualización:**
- Icono según tipo:
  * 💡 Luz
  * 💧 Agua
  * 🔥 Gas
  * 📱 Celular
- Badge de estado:
  * PENDIENTE → Amarillo
  * PAGADO → Verde
  * VENCIDO → Rojo (si fecha < hoy)
- Alerta si vence en menos de 7 días
- Fecha formateada: "15 de noviembre de 2025"
- Botones: "Pagar" (si pendiente) y "Eliminar"

---

#### **ModalCrearServicio.tsx**
Modal para crear nuevo servicio.

**Campos:**
- Select de tipo (luz, agua, gas, celular)
- Select de proveedor (se filtra según tipo)
- Input de número de cliente
- Input de monto
- Date picker de fecha de vencimiento

**Validaciones:**
- Todos los campos obligatorios
- Monto > 0
- Fecha debe ser futura
- Si es celular → verifica que no haya otro activo

**Flujo dinámico:**
```typescript
// Cuando cambias el tipo:
const handleTipoChange = (tipo) => {
  setTipo(tipo);
  setProveedor('');  // Reset proveedor
  // Proveedores se filtran automáticamente
  const proveedoresFiltrados = proveedores[tipo];
};
```

---

#### **ResumenServicios.tsx**
Panel de resumen y pago masivo.

**Muestra:**
- **Total servicios:** 5
- **Total pendiente:** $15,000.00
- **Total pagado:** $20,000.00
- Botón "Pagar Todos los Pendientes"
  * Se deshabilita si saldo insuficiente
  * Muestra cuánto falta si no alcanza
- Distribución por tipo:
  * 💡 Luz: 2 servicios
  * 💧 Agua: 1 servicio
  * 🔥 Gas: 1 servicio
  * 📱 Celular: 1 servicio

**Cálculos:**
```typescript
const totalPendiente = servicios
  .filter(s => !s.pagado)
  .reduce((sum, s) => sum + s.monto, 0);

const totalPagado = servicios
  .filter(s => s.pagado)
  .reduce((sum, s) => sum + s.monto, 0);

const insufficient = totalPendiente > user.saldo;
```

---

## 🔒 Seguridad y Protección

### **1. Protección de Rutas (middleware.ts)**

**Problema:** ¿Cómo evitar que usuarios no autenticados accedan a /home?

**Solución:** Middleware que verifica el token antes de permitir acceso.

```typescript
export function middleware(request: NextRequest) {
  const token = request.cookies.get('token');
  const pathname = request.nextUrl.pathname;
  
  // Rutas públicas (sin protección)
  const publicRoutes = ['/login', '/register', '/'];
  
  // Si es ruta pública → Permitir
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }
  
  // Si no hay token → Redirigir a login
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // Si hay token → Permitir acceso
  return NextResponse.next();
}

// Aplicar middleware a rutas protegidas
export const config = {
  matcher: [
    '/home',
    '/transferir',
    '/ingresar',
    '/sube',
    '/servicios',
    '/historial',
    '/perfil'
  ]
};
```

**Flujo:**
```
Usuario intenta acceder a /home
    ↓
¿Tiene token en cookies?
    ↓
NO → Redirige a /login
SÍ → Permite acceso
```

---

### **2. Interceptor de Axios (JWT Automático)**

**Problema:** Cada llamada al backend necesita el token JWT en los headers.

**Solución:** Interceptor que agrega el token automáticamente.

```typescript
// lib/axios.ts
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

**Antes del interceptor:**
```typescript
// Tenías que hacer esto en cada llamada:
await axios.get('/saldo', {
  headers: {
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }
});
```

**Después del interceptor:**
```typescript
// Ahora simplemente:
await api.get('/saldo');  // ← Token se agrega automático
```

---

### **3. Manejo de Token Expirado (401)**

**Problema:** El token JWT expira después de X horas. ¿Qué hacer?

**Solución:** Interceptor de respuesta que detecta 401 y redirige a login.

```typescript
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token inválido o expirado
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

**Flujo:**
```
Usuario hace acción → GET /saldo
    ↓
Backend verifica token
    ↓
Token expirado → 401 Unauthorized
    ↓
Interceptor detecta 401
    ↓
Limpia localStorage
    ↓
Redirige a /login
    ↓
Usuario debe hacer login nuevamente
```

---

### **4. Validaciones del Backend**

**Transferencias:**
```javascript
// El backend verifica:
- ¿El emisor existe?
- ¿El receptor existe?
- ¿El emisor tiene saldo suficiente?
- ¿El monto es válido (> 0)?
- ¿No es una transferencia a sí mismo?
```

**Servicios:**
```javascript
// El backend verifica:
- ¿El proveedor existe?
- ¿Si es celular, no hay otro activo?
- ¿La fecha de vencimiento es válida?
- ¿Al pagar, el usuario tiene saldo?
```

**Tarjetas:**
```javascript
// El backend verifica:
- ¿El número de tarjeta es único?
- ¿La empresa existe?
- ¿Al recargar, el usuario tiene saldo?
```

---

## 🚀 Deployment y Producción

### **Variables de Entorno**

**Local (.env.local):**
```bash
NEXT_PUBLIC_API_URL=https://back-wallet-20.vercel.app
```

**Producción (Vercel Dashboard):**
```
NEXT_PUBLIC_API_URL = https://back-wallet-20.vercel.app
```

**¿Por qué NEXT_PUBLIC_?**
- Variables con este prefijo son accesibles en el navegador
- Variables sin prefijo solo están en el servidor

---

### **Proceso de Build**

```bash
npm run build
```

**Lo que hace:**
1. Compila TypeScript → JavaScript
2. Optimiza imágenes
3. Minifica CSS y JS
4. Genera páginas estáticas
5. Crea carpeta `.next/` con todo optimizado

**Output:**
```
Route (app)                Size
┌ ○ /                      1.5 kB
├ ○ /login                 2.3 kB
├ ○ /register              2.8 kB
├ ○ /home                  3.1 kB
├ ○ /transferir            2.9 kB
├ ○ /sube                  4.2 kB
└ ○ /servicios             4.5 kB

○ (Static) - Prerendered
```

---

### **Deploy en Vercel**

**Opción 1: Dashboard**
1. Conectar repo de GitHub
2. Vercel detecta Next.js automáticamente
3. Configura variables de entorno
4. Click en "Deploy"

**Opción 2: CLI**
```bash
npm i -g vercel
vercel login
vercel --prod
```

**Vercel automáticamente:**
- Ejecuta `npm run build`
- Sube archivos a CDN global
- Configura HTTPS
- Crea preview deployments para cada PR
- Rollback si hay errores

---

## 📚 Comandos Útiles

### **Desarrollo:**
```bash
npm run dev           # Inicia servidor de desarrollo (localhost:3000)
npm run build         # Compila para producción
npm run start         # Inicia servidor de producción
npm run lint          # Verifica errores de código
```

### **Git:**
```bash
git add .
git commit -m "feat: nueva funcionalidad"
git push origin main
```

### **Vercel:**
```bash
vercel                # Deploy a preview
vercel --prod         # Deploy a producción
vercel logs           # Ver logs
vercel domains        # Gestionar dominios
```

---

## 🐛 Debugging y Solución de Problemas

### **Problema: "No se actualiza el saldo"**

**Causa:** El store no está sincronizado.

**Solución:**
```typescript
// Después de cada operación que cambie el saldo:
const response = await api.post('/saldo/recargar', { monto });
updateUser({ saldo: response.data.saldoNuevo });  // ← Actualizar store
```

---

### **Problema: "Error 401 en todas las llamadas"**

**Causa:** Token expirado o inválido.

**Solución:**
1. Abre DevTools → Application → localStorage
2. Elimina "token"
3. Vuelve a hacer login

---

### **Problema: "No se ven los cambios en el navegador"**

**Causa:** Caché del navegador.

**Solución:**
```bash
# Limpiar caché de Next.js:
rm -rf .next
npm run dev
```

O en el navegador: `Ctrl + Shift + R` (hard refresh)

---

## 🎓 Conceptos Clave Para Aprender

### **1. Estado vs Props**

**Props:**
- Datos que un componente padre pasa a un hijo
- Solo lectura (no se pueden modificar)

```typescript
// Padre:
<TarjetaCard tarjeta={miTarjeta} />

// Hijo:
function TarjetaCard({ tarjeta }) {
  return <p>{tarjeta.numero}</p>;
}
```

**Estado:**
- Datos que el componente gestiona internamente
- Se pueden modificar con `setState`

```typescript
function Contador() {
  const [count, setCount] = useState(0);
  
  return (
    <button onClick={() => setCount(count + 1)}>
      Clicks: {count}
    </button>
  );
}
```

---

### **2. Hooks Principales**

**useState:** Gestiona estado local
```typescript
const [saldo, setSaldo] = useState(0);
setSaldo(1000);  // Actualiza saldo
```

**useEffect:** Ejecuta código cuando algo cambia
```typescript
useEffect(() => {
  // Se ejecuta al montar el componente
  fetchSaldo();
}, []);  // Array vacío = solo 1 vez
```

**useStore (Zustand):** Lee estado global
```typescript
const { user, login } = useAuthStore();
```

---

### **3. Async/Await**

**Promesas:**
```typescript
// Antiguo:
api.get('/saldo')
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error(error);
  });
```

**Async/Await:**
```typescript
// Moderno:
try {
  const response = await api.get('/saldo');
  console.log(response.data);
} catch (error) {
  console.error(error);
}
```

---

## 🎯 Próximos Pasos Recomendados

### **Features Adicionales:**
1. **Notificaciones Push** cuando recibes transferencias
2. **Gráficos** de gastos con Chart.js
3. **Exportar historial** a PDF
4. **Modo oscuro** (ya preparado en globals.css)
5. **Pago con QR** (generar QR para cobrar)
6. **Límites diarios** de transferencias

### **Mejoras de Seguridad:**
1. **2FA (Two-Factor Authentication)**
2. **Rate limiting** (limitar requests por IP)
3. **Encriptación** de datos sensibles
4. **Logs de auditoría** de transacciones

### **Optimizaciones:**
1. **React Query** para caché de peticiones
2. **Lazy loading** de componentes pesados
3. **PWA** (Progressive Web App) para offline
4. **WebSockets** para updates en tiempo real

---

## 📖 Recursos Para Seguir Aprendiendo

**Documentación Oficial:**
- Next.js: https://nextjs.org/docs
- React: https://react.dev
- TypeScript: https://www.typescriptlang.org/docs
- Tailwind CSS: https://tailwindcss.com/docs
- Zustand: https://zustand-demo.pmnd.rs

**Tutoriales:**
- Next.js Tutorial: https://nextjs.org/learn
- React Tutorial: https://react.dev/learn
- TypeScript Handbook: https://www.typescriptlang.org/docs/handbook

**Comunidades:**
- Stack Overflow: Para preguntas técnicas
- Reddit r/reactjs: Comunidad de React
- Discord de Next.js: Soporte en tiempo real

---

**¡Éxito con el proyecto! 🚀**

Si tienes dudas sobre alguna parte específica, busca el archivo correspondiente en la estructura de carpetas y revisa el código paso a paso.
