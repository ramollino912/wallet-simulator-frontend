"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { X } from 'lucide-react';

interface ModalRegistrarTarjetaProps {
  isOpen: boolean;
  onClose: () => void;
  empresas: string[];
  onRegistrar: (numeroTarjeta: string, empresa: string) => Promise<void>;
}

export default function ModalRegistrarTarjeta({
  isOpen,
  onClose,
  empresas,
  onRegistrar,
}: ModalRegistrarTarjetaProps) {
  const [numeroTarjeta, setNumeroTarjeta] = useState('');
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validaciones
    if (!numeroTarjeta.trim()) {
      setError('El número de tarjeta es requerido');
      return;
    }

    if (!empresaSeleccionada) {
      setError('Debe seleccionar una empresa');
      return;
    }

    setIsLoading(true);
    try {
      await onRegistrar(numeroTarjeta, empresaSeleccionada);
      // Limpiar formulario
      setNumeroTarjeta('');
      setEmpresaSeleccionada('');
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al registrar tarjeta');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setNumeroTarjeta('');
    setEmpresaSeleccionada('');
    setError('');
    onClose();
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
        <h2 className="text-2xl font-bold mb-6">Registrar Nueva Tarjeta</h2>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Empresa */}
          <div>
            <Label htmlFor="empresa">Empresa de Transporte</Label>
            <select
              id="empresa"
              value={empresaSeleccionada}
              onChange={(e) => setEmpresaSeleccionada(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            >
              <option value="">Seleccionar empresa...</option>
              {empresas.map((empresa) => (
                <option key={empresa} value={empresa}>
                  {empresa}
                </option>
              ))}
            </select>
          </div>

          {/* Número de tarjeta */}
          <div>
            <Label htmlFor="numero">Número de Tarjeta</Label>
            <Input
              id="numero"
              type="text"
              value={numeroTarjeta}
              onChange={(e) => setNumeroTarjeta(e.target.value)}
              placeholder="0000-0000-0000-0000"
              disabled={isLoading}
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              Ingrese el número de su tarjeta sin espacios ni guiones
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Información */}
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded text-sm">
            <p className="font-medium">ℹ️ Información:</p>
            <p className="mt-1">La tarjeta se registrará con saldo inicial de $0.00</p>
          </div>

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
              disabled={isLoading}
            >
              {isLoading ? 'Registrando...' : 'Registrar Tarjeta'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
