'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, User, Mail, CreditCard, DollarSign, Calendar } from 'lucide-react';
import api from '@/lib/axios';

export default function PerfilPage() {
  const router = useRouter();
  const { user, updateUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  // Cargar datos completos del perfil del backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/profile');
        if (response.data && response.data.usuario) {
          const usuario = response.data.usuario;
          // Convertir saldo a número si viene como string
          const saldo = typeof usuario.saldo === 'string' 
            ? parseFloat(usuario.saldo) 
            : usuario.saldo;
          
          updateUser({ 
            ...usuario,
            saldo: saldo 
          });
        }
      } catch (error) {
        console.error('Error al obtener perfil:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [updateUser]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto flex items-center justify-center min-h-[60vh]">
        <p className="text-2xl text-slate-600">Cargando perfil...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto flex items-center justify-center min-h-[60vh]">
        <p className="text-2xl text-slate-600">No hay datos de usuario</p>
      </div>
    );
  }

  const saldo = typeof user.saldo === 'number' 
    ? user.saldo.toFixed(2) 
    : Number(user.saldo || 0).toFixed(2);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => router.push('/home')}
          className="mb-4 text-lg"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Volver
        </Button>
        <h1 className="text-4xl font-bold text-slate-800">Mi Perfil</h1>
      </div>

      {/* Profile Card */}
      <Card className="p-8 mb-6">
        <div className="flex items-center gap-6 mb-8">
          <div className="bg-blue-600 rounded-full p-8">
            <User className="h-24 w-24 text-white" />
          </div>
          <div>
            <h2 className="text-4xl font-bold text-slate-800">
              {user.nombre} {(user as any).apellido || ''}
            </h2>
            <p className="text-xl text-slate-500 mt-2">{user.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nombre */}
          <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
            <User className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-sm text-slate-500">Nombre</p>
              <p className="text-xl font-semibold text-slate-800">{user.nombre}</p>
            </div>
          </div>

          {/* Apellido */}
          {(user as any).apellido && (
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
              <User className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-slate-500">Apellido</p>
                <p className="text-xl font-semibold text-slate-800">{(user as any).apellido}</p>
              </div>
            </div>
          )}

          {/* Email */}
          <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
            <Mail className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-sm text-slate-500">Email</p>
              <p className="text-xl font-semibold text-slate-800">{user.email}</p>
            </div>
          </div>

          {/* ID */}
          <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
            <CreditCard className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-sm text-slate-500">ID de Usuario</p>
              <p className="text-xl font-semibold text-slate-800">{user.id}</p>
            </div>
          </div>

          {/* CVU */}
          {(user as any).cvu && (
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg md:col-span-2">
              <CreditCard className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-slate-500">CVU</p>
                <p className="text-xl font-semibold text-slate-800">{(user as any).cvu}</p>
              </div>
            </div>
          )}

          {/* Alias */}
          {(user as any).alias && (
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg md:col-span-2">
              <CreditCard className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-slate-500">Alias</p>
                <p className="text-xl font-semibold text-slate-800">{(user as any).alias}</p>
              </div>
            </div>
          )}

          {/* Fecha de Creación */}
          {(user as any).created_at && (
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg md:col-span-2">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-slate-500">Miembro desde</p>
                <p className="text-xl font-semibold text-slate-800">
                  {new Date((user as any).created_at).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Saldo Card */}
      <Card className="p-8 bg-gradient-to-br from-green-500 to-green-700 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <DollarSign className="h-16 w-16" />
            <div>
              <p className="text-2xl opacity-90">Saldo Disponible</p>
              <p className="text-6xl font-bold mt-2">${saldo}</p>
            </div>
          </div>
          <Button
            onClick={() => router.push('/ingresar')}
            className="bg-white text-green-700 hover:bg-slate-100 text-xl px-8 py-6 h-auto"
          >
            Ingresar Dinero
          </Button>
        </div>
      </Card>
    </div>
  );
}
