'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { 
  ArrowLeftRight, 
  Wallet, 
  CreditCard, 
  Briefcase, 
  Clock, 
  UserCircle 
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { user, updateUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  // Cargar saldo actualizado del backend al cargar la página
  useEffect(() => {
    const fetchSaldo = async () => {
      try {
        const response = await api.get('/saldo');
        
        // El backend devuelve {saldo: "410.96"} sin el campo success
        if (response.data && response.data.saldo) {
          // Convertir saldo a número si viene como string
          const saldo = typeof response.data.saldo === 'string' 
            ? parseFloat(response.data.saldo) 
            : response.data.saldo;
          
          // Actualizar usando set completo para asegurar que se guarde
          updateUser({ saldo: saldo });
        }
      } catch (error) {
        // Error silencioso en producción
      } finally {
        setIsLoading(false);
      }
    };

    fetchSaldo();
  }, [updateUser]);

  const buttons = [
    { 
      name: 'Transferir', 
      href: '/transferir', 
      icon: ArrowLeftRight,
    },
    { 
      name: 'Ingresar', 
      href: '/ingresar', 
      icon: Wallet,
    },
    { 
      name: 'SUBE', 
      href: '/sube', 
      icon: CreditCard,
    },
    { 
      name: 'Servicios', 
      href: '/servicios', 
      icon: Briefcase,
    },
    { 
      name: 'Historial', 
      href: '/historial', 
      icon: Clock,
    },
    { 
      name: 'Perfil', 
      href: '/perfil', 
      icon: UserCircle,
    },
  ];

  const saldo = typeof user?.saldo === 'number' 
    ? user.saldo.toFixed(2) 
    : Number(user?.saldo || 0).toFixed(2);

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto flex items-center justify-center min-h-[60vh]">
        <p className="text-2xl text-slate-600">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Saldo Card */}
      <Card className="mb-8 p-8 bg-white shadow-lg">
        <div className="flex items-center justify-between">
          {/* Left: User Info */}
          <div>
            {user && (
              <>
                <p className="text-3xl font-bold text-slate-800">
                  {user.nombre}
                </p>
                <p className="text-lg text-slate-500 mt-1">
                  {user.email}
                </p>
              </>
            )}
          </div>

          {/* Right: Saldo */}
          <div className="text-right">
            <p className="text-xl font-medium text-slate-600 mb-1">Tu Saldo</p>
            <p className="text-6xl font-bold text-green-500">${saldo}</p>
          </div>
        </div>
      </Card>

      {/* Buttons Grid 3x2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {buttons.map((button) => (
          <Button
            key={button.name}
            onClick={() => router.push(button.href)}
            className="h-44 text-2xl font-bold bg-blue-600 hover:bg-blue-700 text-white transition-all hover:scale-105 shadow-lg"
          >
            <div className="flex flex-col items-center gap-3">
              <button.icon className="h-28 w-28 stroke-[1.5]" />
              <span>{button.name}</span>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}
