'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DollarSign, ArrowLeft, CheckCircle } from 'lucide-react';
import api from '@/lib/axios';

export default function IngresarPage() {
  const router = useRouter();
  const { user, updateUser } = useAuthStore();
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');

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
          
          updateUser({ saldo });
        }
      } catch (error) {
        // Error silencioso en producción
      }
    };

    fetchSaldo();
  }, [updateUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const montoIngreso = parseFloat(amount);
    
    if (isNaN(montoIngreso) || montoIngreso <= 0) {
      setError('Por favor ingresa un monto válido');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Llamar al endpoint de recarga del backend
      const response = await api.post('/saldo/recargar', {
        monto: montoIngreso
      });

      if (response.data.success) {
        // Convertir saldo a número si viene como string
        const nuevoSaldo = typeof response.data.saldoNuevo === 'string'
          ? parseFloat(response.data.saldoNuevo)
          : response.data.saldoNuevo;
        
        updateUser({ saldo: nuevoSaldo });
        
        setShowSuccess(true);
        
        // Redirigir a home después de 2 segundos
        setTimeout(() => {
          router.push('/home');
        }, 2000);
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error al procesar la recarga');
    } finally {
      setIsLoading(false);
    }
  };

  const saldoActual = typeof user?.saldo === 'number' 
    ? user.saldo.toFixed(2) 
    : Number(user?.saldo || 0).toFixed(2);

  if (showSuccess) {
    return (
      <div className="max-w-2xl mx-auto flex items-center justify-center min-h-[60vh]">
        <Card className="p-12 text-center">
          <CheckCircle className="h-24 w-24 text-green-500 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-green-600 mb-4">
            ¡Ingreso Exitoso!
          </h1>
          <p className="text-2xl text-slate-600">
            Se ha agregado ${parseFloat(amount).toFixed(2)} a tu cuenta
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
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
        <h1 className="text-4xl font-bold text-slate-800">Ingresar Dinero</h1>
      </div>

      {/* Saldo Actual */}
      <Card className="mb-8 p-6 bg-blue-50 border-blue-200">
        <div className="text-center">
          <p className="text-xl text-slate-600 mb-2">Saldo Actual</p>
          <p className="text-5xl font-bold text-blue-600">${saldoActual}</p>
        </div>
      </Card>

      {/* Form */}
      <Card className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="amount" className="text-2xl font-semibold">
              Monto a Ingresar
            </Label>
            <div className="relative">
              <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 h-8 w-8 text-slate-400" />
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-16 text-4xl h-20 text-center font-bold"
                required
                disabled={isLoading}
                min="0.01"
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-lg">
              {error}
            </div>
          )}

          {/* Preview */}
          {amount && parseFloat(amount) > 0 && (
            <Card className="p-6 bg-green-50 border-green-200">
              <div className="text-center">
                <p className="text-xl text-slate-600 mb-2">Nuevo Saldo</p>
                <p className="text-4xl font-bold text-green-600">
                  ${(parseFloat(saldoActual) + parseFloat(amount)).toFixed(2)}
                </p>
              </div>
            </Card>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-20 text-3xl font-bold bg-green-600 hover:bg-green-700"
            disabled={isLoading || !amount || parseFloat(amount) <= 0}
          >
            {isLoading ? 'Procesando...' : 'Aceptar'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
