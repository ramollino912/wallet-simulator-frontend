# 📘 Guía de Implementación - Páginas Adicionales

Esta guía te muestra cómo crear las páginas restantes del frontend.

---

## 1. Página de Perfil (`/profile`)

### Crear archivo: `app/(dashboard)/profile/page.tsx`

```tsx
'use client';

import { useEffect, useState } from 'react';
import { User, Mail, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/axios';

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await api.get('/profile');
      setProfile(response.data.usuario);
    } catch (error) {
      console.error('Error al cargar perfil:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Mi Perfil</h1>

      <Card>
        <CardHeader>
          <CardTitle>Información Personal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Nombre</Label>
            <Input value={profile?.nombre || ''} readOnly />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={profile?.email || ''} readOnly />
          </div>
          <div className="space-y-2">
            <Label>Saldo</Label>
            <Input value={`$${profile?.saldo?.toFixed(2) || '0.00'}`} readOnly />
          </div>
          <Button>Editar Perfil</Button>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## 2. Página de Transacciones (`/transactions`)

### Crear archivo: `app/(dashboard)/transactions/page.tsx`

```tsx
'use client';

import { useEffect, useState } from 'react';
import { ArrowUpRight, ArrowDownRight, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import api from '@/lib/axios';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadTransactions();
  }, [page]);

  const loadTransactions = async () => {
    try {
      const response = await api.get(`/transacciones?page=${page}&limit=10`);
      setTransactions(response.data.transacciones);
    } catch (error) {
      console.error('Error al cargar transacciones:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Transacciones</h1>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filtrar
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historial de Transacciones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions.map((transaction: any) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`p-2 rounded-full ${
                      transaction.tipo === 'recarga'
                        ? 'bg-green-100'
                        : 'bg-red-100'
                    }`}
                  >
                    {transaction.tipo === 'recarga' ? (
                      <ArrowDownRight className="h-5 w-5 text-green-600" />
                    ) : (
                      <ArrowUpRight className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{transaction.descripcion}</p>
                    <p className="text-sm text-slate-600">
                      {new Date(transaction.fecha).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div
                  className={`font-bold ${
                    transaction.tipo === 'recarga'
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {transaction.tipo === 'recarga' ? '+' : '-'}$
                  {transaction.monto.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## 3. Página de Servicios (`/services`)

### Crear archivo: `app/(dashboard)/services/page.tsx`

```tsx
'use client';

import { useEffect, useState } from 'react';
import { CreditCard, Plus, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import api from '@/lib/axios';

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const response = await api.get('/servicios');
      setServices(response.data.servicios);
    } catch (error) {
      console.error('Error al cargar servicios:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePay = async (serviceId: number) => {
    try {
      await api.post(`/servicios/${serviceId}/pagar`);
      alert('Servicio pagado exitosamente');
      loadServices();
    } catch (error) {
      console.error('Error al pagar servicio:', error);
    }
  };

  const handleDelete = async (serviceId: number) => {
    if (confirm('¿Estás seguro de eliminar este servicio?')) {
      try {
        await api.delete(`/servicios/${serviceId}`);
        loadServices();
      } catch (error) {
        console.error('Error al eliminar servicio:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Servicios</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Agregar Servicio
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service: any) => (
          <Card key={service.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                {service.proveedor}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-slate-600">Cuenta</p>
                <p className="font-medium">{service.numero_cuenta}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Monto</p>
                <p className="text-2xl font-bold text-green-600">
                  ${service.monto.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Vencimiento</p>
                <p className="font-medium">
                  {new Date(service.vencimiento).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  className="flex-1"
                  onClick={() => handlePay(service.id)}
                >
                  Pagar
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDelete(service.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

---

## 4. Página de Transporte (`/transport`)

### Crear archivo: `app/(dashboard)/transport/page.tsx`

```tsx
'use client';

import { useEffect, useState } from 'react';
import { Bus, Plus, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import api from '@/lib/axios';

export default function TransportPage() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    try {
      const response = await api.get('/transporte/tarjetas');
      setCards(response.data.tarjetas);
    } catch (error) {
      console.error('Error al cargar tarjetas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRecharge = async (cardId: number) => {
    const amount = prompt('Ingrese el monto a recargar:');
    if (amount) {
      try {
        await api.post(`/transporte/tarjetas/${cardId}/recargar`, {
          monto: parseFloat(amount),
        });
        alert('Recarga exitosa');
        loadCards();
      } catch (error) {
        console.error('Error al recargar:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Tarjetas de Transporte</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Agregar Tarjeta
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card: any) => (
          <Card key={card.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bus className="h-5 w-5" />
                {card.empresa}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-slate-600">Alias</p>
                <p className="font-medium">{card.alias}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Número</p>
                <p className="font-mono">{card.numero}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Saldo</p>
                <p className="text-2xl font-bold text-green-600">
                  ${card.saldo.toFixed(2)}
                </p>
              </div>
              <Button
                className="w-full"
                onClick={() => handleRecharge(card.id)}
              >
                <DollarSign className="mr-2 h-4 w-4" />
                Recargar
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

---

## 5. Funcionalidad de Recarga de Saldo

### Crear componente: `components/RechargeModal.tsx`

```tsx
'use client';

import { useState } from 'react';
import { DollarSign, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/authStore';

export function RechargeModal({ onClose }: { onClose: () => void }) {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const { updateUser } = useAuthStore();

  const handleRecharge = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/saldo/recargar', {
        monto: parseFloat(amount),
      });
      
      updateUser({ saldo: response.data.saldoNuevo });
      alert('Recarga exitosa');
      onClose();
    } catch (error) {
      console.error('Error al recargar:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Recargar Saldo</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRecharge} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Monto</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <DollarSign className="mr-2 h-4 w-4" />
                    Recargar
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## 6. Funcionalidad de Transferencia

### Crear archivo: `app/(dashboard)/transfer/page.tsx`

```tsx
'use client';

import { useState } from 'react';
import { Search, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import api from '@/lib/axios';

export default function TransferPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const searchUsers = async () => {
    try {
      const response = await api.get(`/buscar-usuario?query=${searchQuery}`);
      setUsers(response.data.usuarios);
    } catch (error) {
      console.error('Error al buscar usuarios:', error);
    }
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await api.post('/transferir', {
        destinatario_id: selectedUser.id,
        monto: parseFloat(amount),
        descripcion,
      });
      alert('Transferencia exitosa');
      setSelectedUser(null);
      setAmount('');
      setDescription('');
    } catch (error) {
      console.error('Error al transferir:', error);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Transferir Dinero</h1>

      {!selectedUser ? (
        <Card>
          <CardHeader>
            <CardTitle>Buscar Usuario</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="Nombre o email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button onClick={searchUsers}>
                <Search className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-4 space-y-2">
              {users.map((user: any) => (
                <div
                  key={user.id}
                  className="p-4 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100"
                  onClick={() => setSelectedUser(user)}
                >
                  <p className="font-medium">{user.nombre}</p>
                  <p className="text-sm text-slate-600">{user.email}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Transferir a {selectedUser.nombre}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleTransfer} className="space-y-4">
              <div className="space-y-2">
                <Label>Destinatario</Label>
                <Input value={selectedUser.email} readOnly />
              </div>
              <div className="space-y-2">
                <Label>Monto</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Descripción</Label>
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  <Send className="mr-2 h-4 w-4" />
                  Transferir
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSelectedUser(null)}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
```

---

## 🎯 Orden Recomendado de Implementación

1. ✅ Login y Registro (Ya implementado)
2. ✅ Dashboard (Ya implementado)
3. 📝 Página de Transacciones
4. 💳 Página de Servicios
5. 🚌 Página de Transporte
6. 👤 Página de Perfil
7. 💸 Funcionalidad de Recarga
8. 🔄 Funcionalidad de Transferencia

---

## 💡 Tips de Implementación

1. **Usar el mismo patrón** en todas las páginas para mantener consistencia
2. **Manejar errores** con try/catch y mostrar mensajes al usuario
3. **Loading states** para mejor UX mientras se cargan datos
4. **Validaciones** en los formularios antes de enviar a la API
5. **Actualizar estado** después de operaciones exitosas
6. **Usar componentes reutilizables** para modales y formularios

---

Cada página sigue el mismo patrón:
1. Estado para datos y loading
2. useEffect para cargar datos iniciales
3. Funciones para interactuar con la API
4. UI con componentes shadcn/ui
5. Manejo de errores y feedback al usuario
