"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { X } from 'lucide-react';
import { TarjetaTransporte } from '@/lib/transporteService';
import { useAuthStore } from '@/store/authStore';

interface ModalRecargarProps {
  isOpen: boolean;
  onClose: () => void;
  tarjeta: TarjetaTransporte | null;
  onRecargar: (tarjetaId: number, monto: number) => Promise<void>;
}

export default function ModalRecargar({
  isOpen,
  onClose,
  tarjeta,
  onRecargar,
}: ModalRecargarProps) {
  const [monto, setMonto] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuthStore();

  // Resetear cuando se abre/cierra
  useEffect(() => {
    if (!isOpen) {
      setMonto('');
      setError('');
    }
  }, [isOpen]);

  if (!isOpen || !tarjeta) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validaciones
    const montoNumero = parseFloat(monto);
    
    if (!monto || isNaN(montoNumero)) {
      setError('Ingrese un monto válido');
      return;
    }

    if (montoNumero <= 0) {
      setError('El monto debe ser mayor a 0');
      return;
    }

    if (user && montoNumero > user.saldo) {
      setError('Saldo insuficiente en su wallet');
      return;
    }

    setIsLoading(true);
    try {
      await onRecargar(tarjeta.id, montoNumero);
      setMonto('');
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al recargar tarjeta');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setMonto('');
    setError('');
    onClose();
  };

  // Montos rápidos
  const montosRapidos = [100, 500, 1000, 2000];

  const formatearNumeroTarjeta = (numero: string) => {
    return numero.replace(/(\d{4})(?=\d)/g, '$1-');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-white p-6 relative">
        {/* Botón cerrar */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Título */}
        <h2 className="text-2xl font-bold mb-2">Recargar Tarjeta</h2>
        <p className="text-gray-600 text-sm mb-6">
          {tarjeta.empresa} • {formatearNumeroTarjeta(tarjeta.numero_tarjeta)}
        </p>

        {/* Información de saldos */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-xs text-blue-600 font-medium">Saldo Tarjeta</p>
            <p className="text-xl font-bold text-blue-700">
              ${parseFloat(tarjeta.saldo).toFixed(2)}
            </p>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <p className="text-xs text-green-600 font-medium">Saldo Wallet</p>
            <p className="text-xl font-bold text-green-700">
              ${user?.saldo.toFixed(2) || '0.00'}
            </p>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Monto */}
          <div>
            <Label htmlFor="monto">Monto a Recargar</Label>
            <Input
              id="monto"
              type="number"
              step="0.01"
              min="0"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              placeholder="0.00"
              disabled={isLoading}
              className="mt-1 text-lg"
            />
          </div>

          {/* Montos rápidos */}
          <div>
            <p className="text-sm text-gray-600 mb-2">Montos rápidos:</p>
            <div className="grid grid-cols-4 gap-2">
              {montosRapidos.map((montoRapido) => (
                <Button
                  key={montoRapido}
                  type="button"
                  onClick={() => setMonto(montoRapido.toString())}
                  variant="outline"
                  className="text-sm"
                  disabled={isLoading || (user ? montoRapido > user.saldo : false)}
                >
                  ${montoRapido}
                </Button>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Vista previa */}
          {monto && !isNaN(parseFloat(monto)) && parseFloat(monto) > 0 && (
            <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg space-y-2">
              <p className="font-medium text-sm">Vista previa:</p>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Nuevo saldo tarjeta:</span>
                <span className="font-bold text-green-600">
                  ${(parseFloat(tarjeta.saldo) + parseFloat(monto)).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Nuevo saldo wallet:</span>
                <span className="font-bold text-blue-600">
                  ${user ? (user.saldo - parseFloat(monto)).toFixed(2) : '0.00'}
                </span>
              </div>
            </div>
          )}

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={handleClose}
              variant="outline"
              className="flex-1"
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isLoading || !monto || parseFloat(monto) <= 0}
            >
              {isLoading ? 'Recargando...' : 'Confirmar Recarga'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
