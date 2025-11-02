"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { X } from 'lucide-react';
import { Proveedores } from '@/lib/serviciosService';

interface ModalCrearServicioProps {
  isOpen: boolean;
  onClose: () => void;
  proveedores: Proveedores | null;
  onCrear: (
    nombre: string,
    tipo: 'luz' | 'agua' | 'gas' | 'celular',
    proveedor: string,
    numero_servicio: string,
    monto_mensual: number,
    fecha_vencimiento: string
  ) => Promise<void>;
}

export default function ModalCrearServicio({
  isOpen,
  onClose,
  proveedores,
  onCrear,
}: ModalCrearServicioProps) {
  const [nombre, setNombre] = useState('');
  const [tipo, setTipo] = useState<'luz' | 'agua' | 'gas' | 'celular'>('luz');
  const [proveedor, setProveedor] = useState('');
  const [numeroServicio, setNumeroServicio] = useState('');
  const [montoMensual, setMontoMensual] = useState('');
  const [fechaVencimiento, setFechaVencimiento] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Resetear cuando cambia el tipo
  useEffect(() => {
    setProveedor('');
  }, [tipo]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validaciones
    if (!nombre.trim()) {
      setError('El nombre es requerido');
      return;
    }

    if (!proveedor) {
      setError('Debe seleccionar un proveedor');
      return;
    }

    if (!numeroServicio.trim()) {
      setError('El número de servicio es requerido');
      return;
    }

    const monto = parseFloat(montoMensual);
    if (!montoMensual || isNaN(monto) || monto <= 0) {
      setError('El monto debe ser mayor a 0');
      return;
    }

    if (!fechaVencimiento) {
      setError('La fecha de vencimiento es requerida');
      return;
    }

    setIsLoading(true);
    try {
      await onCrear(nombre, tipo, proveedor, numeroServicio, monto, fechaVencimiento);
      // Limpiar formulario
      setNombre('');
      setTipo('luz');
      setProveedor('');
      setNumeroServicio('');
      setMontoMensual('');
      setFechaVencimiento('');
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al crear servicio');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setNombre('');
    setTipo('luz');
    setProveedor('');
    setNumeroServicio('');
    setMontoMensual('');
    setFechaVencimiento('');
    setError('');
    onClose();
  };

  const proveedoresDisponibles = proveedores?.[tipo] || [];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <Card className="w-full max-w-md bg-white p-6 relative my-8">
        {/* Botón cerrar */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Título */}
        <h2 className="text-2xl font-bold mb-6">Crear Nuevo Servicio</h2>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre */}
          <div>
            <Label htmlFor="nombre">Nombre del Servicio</Label>
            <Input
              id="nombre"
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Luz Casa, Celular Personal"
              disabled={isLoading}
              className="mt-1"
            />
          </div>

          {/* Tipo de Servicio */}
          <div>
            <Label htmlFor="tipo">Tipo de Servicio</Label>
            <select
              id="tipo"
              value={tipo}
              onChange={(e) => setTipo(e.target.value as any)}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            >
              <option value="luz">💡 Luz (Electricidad)</option>
              <option value="agua">💧 Agua</option>
              <option value="gas">🔥 Gas</option>
              <option value="celular">📱 Celular</option>
            </select>
          </div>

          {/* Proveedor */}
          <div>
            <Label htmlFor="proveedor">Proveedor</Label>
            <select
              id="proveedor"
              value={proveedor}
              onChange={(e) => setProveedor(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            >
              <option value="">Seleccionar proveedor...</option>
              {proveedoresDisponibles.map((prov) => (
                <option key={prov} value={prov}>
                  {prov}
                </option>
              ))}
            </select>
          </div>

          {/* Número de Servicio */}
          <div>
            <Label htmlFor="numeroServicio">Número de Servicio/Cuenta</Label>
            <Input
              id="numeroServicio"
              type="text"
              value={numeroServicio}
              onChange={(e) => setNumeroServicio(e.target.value)}
              placeholder="Número de cuenta o teléfono"
              disabled={isLoading}
              className="mt-1"
            />
          </div>

          {/* Monto Mensual */}
          <div>
            <Label htmlFor="monto">Monto Mensual</Label>
            <Input
              id="monto"
              type="number"
              step="0.01"
              min="0"
              value={montoMensual}
              onChange={(e) => setMontoMensual(e.target.value)}
              placeholder="0.00"
              disabled={isLoading}
              className="mt-1"
            />
          </div>

          {/* Fecha de Vencimiento */}
          <div>
            <Label htmlFor="fecha">Fecha de Vencimiento</Label>
            <Input
              id="fecha"
              type="date"
              value={fechaVencimiento}
              onChange={(e) => setFechaVencimiento(e.target.value)}
              disabled={isLoading}
              className="mt-1"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Información para servicios celulares */}
          {tipo === 'celular' && (
            <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded text-sm">
              <p className="font-medium">ℹ️ Importante:</p>
              <p className="mt-1">Solo puedes tener un servicio celular activo</p>
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
              disabled={isLoading}
            >
              {isLoading ? 'Creando...' : 'Crear Servicio'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
