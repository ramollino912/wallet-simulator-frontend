'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Search, User, CheckCircle, AlertCircle } from 'lucide-react';
import api from '@/lib/axios';

interface Usuario {
  id: number;
  nombre: string;
  email: string;
}

export default function TransferirPage() {
  const router = useRouter();
  const { user, updateUser } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Usuario[]>([]);
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');

  // Cargar saldo actualizado del backend
  useEffect(() => {
    const fetchSaldo = async () => {
      try {
        const response = await api.get('/saldo');
        if (response.data && response.data.saldo) {
          const saldo = typeof response.data.saldo === 'string' 
            ? parseFloat(response.data.saldo) 
            : response.data.saldo;
          updateUser({ saldo });
        }
      } catch (error) {
        console.error('Error al obtener saldo:', error);
      }
    };

    fetchSaldo();
  }, [updateUser]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError('Ingresa un nombre o email para buscar');
      return;
    }

    setIsSearching(true);
    setError('');
    setSearchResults([]);

    try {
      const response = await api.get('/buscar-usuario', {
        params: { query: searchQuery }
      });

      if (response.data.success && response.data.usuarios) {
        setSearchResults(response.data.usuarios);
        if (response.data.usuarios.length === 0) {
          setError('No se encontraron usuarios con ese nombre o email');
        }
      }
    } catch (error: any) {
      console.error('Error al buscar usuario:', error);
      // El interceptor de axios reformatea el error
      setError(error.data?.message || error.message || 'Error al buscar usuario');
    } finally {
      setIsSearching(false);
    }
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log('=== INICIO TRANSFERENCIA ===');
    console.log('Usuario seleccionado:', selectedUser);
    console.log('Amount (string):', amount);
    console.log('Description:', description);

    if (!selectedUser) {
      setError('Selecciona un destinatario');
      return;
    }

    const monto = parseFloat(amount);
    console.log('Monto parseado:', monto, 'Type:', typeof monto);
    
    if (isNaN(monto) || monto <= 0) {
      setError('Ingresa un monto válido');
      return;
    }

    const saldoActual = typeof user?.saldo === 'number' 
      ? user.saldo 
      : Number(user?.saldo || 0);

    console.log('Saldo actual:', saldoActual, 'Type:', typeof saldoActual);

    if (monto > saldoActual) {
      setError('Saldo insuficiente');
      return;
    }

    setIsTransferring(true);
    setError('');

    try {
      // IMPORTANTE: Verificar que no se esté transfiriendo a sí mismo
      if (user && selectedUser.id === user.id) {
        setError('No puedes transferir dinero a ti mismo');
        setIsTransferring(false);
        return;
      }
      
      // Asegurar que todos los valores sean del tipo correcto
      const destinatarioId = parseInt(selectedUser.id.toString(), 10);
      const montoFinal = parseFloat(monto.toFixed(2));
      
      // La descripcion es OBLIGATORIA según el backend
      const descripcionFinal = description?.trim() || 'Transferencia';
      
      // IMPORTANTE: El backend espera camelCase (destinatarioId), no snake_case (destinatario_id)
      const payload = {
        destinatarioId: destinatarioId,  // ✅ camelCase
        monto: montoFinal,
        descripcion: descripcionFinal
      };
      
      console.log('=== INICIO DEBUG TRANSFERENCIA ===');
      console.log('Usuario logueado ID:', user?.id, 'Type:', typeof user?.id);
      console.log('Destinatario seleccionado ID:', selectedUser.id, 'Type:', typeof selectedUser.id);
      console.log('¿Son diferentes?', user?.id !== selectedUser.id);
      console.log('=== PAYLOAD FINAL ===');
      console.log('Payload:', JSON.stringify(payload, null, 2));
      console.log('Tipos detallados:', {
        destinatarioId: {
          value: payload.destinatarioId,
          type: typeof payload.destinatarioId,
          isInteger: Number.isInteger(payload.destinatarioId)
        },
        monto: {
          value: payload.monto,
          type: typeof payload.monto,
          isFinite: Number.isFinite(payload.monto)
        },
        descripcion: {
          value: payload.descripcion,
          type: typeof payload.descripcion,
          length: payload.descripcion.length
        }
      });
      
      console.log('Enviando POST a /transferir...');
      const response = await api.post('/transferir', payload);
      console.log('=== RESPUESTA EXITOSA ===');
      console.log('Response:', response.data);
      
      console.log('Respuesta de transferencia:', response.data);

      if (response.data.success) {
        // Actualizar saldo con el nuevo saldo del backend
        const nuevoSaldo = typeof response.data.saldoActual === 'string'
          ? parseFloat(response.data.saldoActual)
          : response.data.saldoActual;

        updateUser({ saldo: nuevoSaldo });
        
        setShowSuccess(true);
        
        // Redirigir a home después de 2 segundos
        setTimeout(() => {
          router.push('/home');
        }, 2000);
      }
    } catch (error: any) {
      console.error('=== ERROR EN TRANSFERENCIA ===');
      console.error('Error completo:', error);
      console.error('Error.response:', error.response);
      console.error('Error.response.data:', error.response?.data);
      console.error('Error.data:', error.data);
      console.error('Error.message:', error.message);
      
      // El backend devuelve el error en error.data (después del interceptor)
      // pero también puede estar en error.response.data
      let errorMsg = 'Error al realizar la transferencia';
      
      if (error.data?.error) {
        errorMsg = error.data.error;
      } else if (error.data?.message) {
        errorMsg = error.data.message;
      } else if (error.response?.data?.error) {
        errorMsg = error.response.data.error;
      } else if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      } else if (error.message) {
        errorMsg = error.message;
      }
      
      console.error('Mensaje de error final:', errorMsg);
      setError(errorMsg);
    } finally {
      setIsTransferring(false);
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
            ¡Transferencia Exitosa!
          </h1>
          <p className="text-2xl text-slate-600 mb-2">
            Enviaste ${parseFloat(amount).toFixed(2)} a
          </p>
          <p className="text-3xl font-bold text-slate-800">
            {selectedUser?.nombre}
          </p>
        </Card>
      </div>
    );
  }

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
        <h1 className="text-4xl font-bold text-slate-800">Transferir Dinero</h1>
      </div>

      {/* Saldo Actual */}
      <Card className="mb-8 p-6 bg-blue-50 border-blue-200">
        <div className="text-center">
          <p className="text-xl text-slate-600 mb-2">Saldo Disponible</p>
          <p className="text-5xl font-bold text-blue-600">${saldoActual}</p>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Buscar Usuario */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">
            Buscar Destinatario
          </h2>
          
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Nombre o email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="text-lg h-12"
                disabled={isSearching}
              />
              <Button
                onClick={handleSearch}
                disabled={isSearching}
                className="h-12 px-6"
              >
                <Search className="h-5 w-5" />
              </Button>
            </div>

            {/* Resultados de búsqueda */}
            {searchResults.length > 0 && (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {searchResults.map((usuario) => (
                  <div
                    key={usuario.id}
                    onClick={() => setSelectedUser(usuario)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedUser?.id === usuario.id
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-slate-200 hover:border-blue-400'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-600 rounded-full p-2">
                        <User className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-slate-800">
                          {usuario.nombre}
                        </p>
                        <p className="text-sm text-slate-500">{usuario.email}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Formulario de Transferencia */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">
            Datos de Transferencia
          </h2>

          {selectedUser ? (
            <form onSubmit={handleTransfer} className="space-y-4">
              {/* Destinatario seleccionado */}
              <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                <p className="text-sm text-slate-600 mb-1">Para:</p>
                <p className="text-xl font-bold text-slate-800">{selectedUser.nombre}</p>
                <p className="text-sm text-slate-500">{selectedUser.email}</p>
              </div>

              {/* Monto */}
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-xl font-semibold">
                  Monto
                </Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="text-3xl h-16 text-center font-bold"
                  required
                  disabled={isTransferring}
                  min="0.01"
                />
              </div>

              {/* Descripción */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-xl font-semibold">
                  Descripción (opcional)
                </Label>
                <Input
                  id="description"
                  type="text"
                  placeholder="Ej: Pago de préstamo"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="text-lg h-12"
                  disabled={isTransferring}
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  <span className="text-base">{error}</span>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-16 text-2xl font-bold bg-blue-600 hover:bg-blue-700"
                disabled={isTransferring || !amount || parseFloat(amount) <= 0}
              >
                {isTransferring ? 'Procesando...' : 'Transferir'}
              </Button>
            </form>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400">
              <User className="h-20 w-20 mb-4" />
              <p className="text-xl">Busca y selecciona un destinatario</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
