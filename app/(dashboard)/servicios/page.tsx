"use client";

import { useEffect, useState } from 'react';
import { useServiciosStore } from '@/store/serviciosStore';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ServicioCard from '@/components/servicios/ServicioCard';
import ModalCrearServicio from '@/components/servicios/ModalCrearServicio';
import ResumenServicios from '@/components/servicios/ResumenServicios';
import { Servicio } from '@/lib/serviciosService';
import {
  Plus,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Loader2,
  FileText,
  Filter,
} from 'lucide-react';

export default function ServiciosPage() {
  // Estados
  const [modalCrearOpen, setModalCrearOpen] = useState(false);
  const [confirmEliminar, setConfirmEliminar] = useState<number | null>(null);
  const [confirmPagar, setConfirmPagar] = useState<Servicio | null>(null);
  const [filtroEstado, setFiltroEstado] = useState<'todos' | 'pendiente' | 'pagado'>('todos');

  // Stores
  const {
    servicios,
    proveedores,
    isLoading,
    error,
    successMessage,
    cargarProveedores,
    cargarServicios,
    crearServicio,
    pagarServicio,
    pagarTodos,
    eliminarServicio,
    clearError,
    clearSuccess,
  } = useServiciosStore();

  const { user } = useAuthStore();

  // Cargar datos iniciales
  useEffect(() => {
    cargarProveedores();
    cargarServicios();
  }, []);

  // Auto-limpiar mensajes
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => clearSuccess(), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, clearSuccess]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => clearError(), 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  // Handlers
  const handleCrear = async (
    nombre: string,
    tipo: 'luz' | 'agua' | 'gas' | 'celular',
    proveedor: string,
    numero_servicio: string,
    monto_mensual: number,
    fecha_vencimiento: string
  ) => {
    await crearServicio(nombre, tipo, proveedor, numero_servicio, monto_mensual, fecha_vencimiento);
  };

  const handlePagarClick = (servicio: Servicio) => {
    setConfirmPagar(servicio);
  };

  const handleConfirmarPagar = async () => {
    if (!confirmPagar) return;
    try {
      await pagarServicio(confirmPagar.id);
      setConfirmPagar(null);
    } catch (error) {
      // El error ya se maneja en el store
    }
  };

  const handleCancelarPagar = () => {
    setConfirmPagar(null);
  };

  const handlePagarTodos = async () => {
    if (!window.confirm('¿Estás seguro de pagar todos los servicios pendientes?')) {
      return;
    }
    try {
      await pagarTodos();
    } catch (error) {
      // El error ya se maneja en el store
    }
  };

  const handleEliminarClick = (servicioId: number) => {
    setConfirmEliminar(servicioId);
  };

  const handleConfirmarEliminar = async (servicioId: number) => {
    try {
      await eliminarServicio(servicioId);
      setConfirmEliminar(null);
    } catch (error) {
      // El error ya se maneja en el store
    }
  };

  const handleCancelarEliminar = () => {
    setConfirmEliminar(null);
  };

  const handleRefresh = () => {
    cargarServicios();
  };

  // Filtrar servicios
  const serviciosFiltrados = servicios.filter((servicio) => {
    if (filtroEstado === 'todos') return true;
    return servicio.estado === filtroEstado;
  });

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mis Servicios</h1>
          <p className="text-gray-600 mt-1">
            Administra tus servicios de luz, agua, gas y celular
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleRefresh}
            variant="outline"
            className="flex items-center gap-2"
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>

          <Button
            onClick={() => setModalCrearOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Nuevo Servicio
          </Button>
        </div>
      </div>

      {/* Alertas */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium text-red-900">Error</p>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
          <button onClick={clearError} className="text-red-600 hover:text-red-800">
            ×
          </button>
        </div>
      )}

      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
          <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium text-green-900">Éxito</p>
            <p className="text-green-700 text-sm">{successMessage}</p>
          </div>
          <button onClick={clearSuccess} className="text-green-600 hover:text-green-800">
            ×
          </button>
        </div>
      )}

      {/* Información del saldo del usuario */}
      {user && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700 font-medium">Saldo disponible en Wallet</p>
                <p className="text-2xl font-bold text-blue-900">${user.saldo.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resumen */}
      {servicios.length > 0 && user && (
        <ResumenServicios
          servicios={servicios}
          onPagarTodos={handlePagarTodos}
          isLoading={isLoading}
          saldoUsuario={user.saldo}
        />
      )}

      {/* Filtros */}
      {servicios.length > 0 && (
        <div className="flex items-center gap-3">
          <Filter className="h-5 w-5 text-gray-500" />
          <div className="flex gap-2">
            <Button
              onClick={() => setFiltroEstado('todos')}
              variant={filtroEstado === 'todos' ? 'default' : 'outline'}
              size="sm"
            >
              Todos ({servicios.length})
            </Button>
            <Button
              onClick={() => setFiltroEstado('pendiente')}
              variant={filtroEstado === 'pendiente' ? 'default' : 'outline'}
              size="sm"
            >
              Pendientes ({servicios.filter((s) => s.estado === 'pendiente').length})
            </Button>
            <Button
              onClick={() => setFiltroEstado('pagado')}
              variant={filtroEstado === 'pagado' ? 'default' : 'outline'}
              size="sm"
            >
              Pagados ({servicios.filter((s) => s.estado === 'pagado').length})
            </Button>
          </div>
        </div>
      )}

      {/* Lista de servicios */}
      {isLoading && servicios.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Cargando servicios...</p>
          </div>
        </div>
      ) : serviciosFiltrados.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 font-medium mb-2">
              {servicios.length === 0
                ? 'No tienes servicios registrados'
                : `No hay servicios ${filtroEstado === 'todos' ? '' : filtroEstado + 's'}`}
            </p>
            {servicios.length === 0 && (
              <>
                <p className="text-gray-500 text-sm mb-6">
                  Crea tu primer servicio para comenzar a administrar tus pagos
                </p>
                <Button
                  onClick={() => setModalCrearOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Mi Primer Servicio
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        <div>
          <h2 className="text-xl font-bold mb-4">
            {filtroEstado === 'todos' ? 'Todos los Servicios' : `Servicios ${filtroEstado === 'pendiente' ? 'Pendientes' : 'Pagados'}`}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviciosFiltrados.map((servicio) => (
              <div key={servicio.id} className="relative">
                {/* Modal de confirmación eliminar */}
                {confirmEliminar === servicio.id && (
                  <div className="absolute inset-0 bg-black/50 rounded-lg z-10 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full">
                      <h3 className="font-bold text-lg mb-2">¿Eliminar servicio?</h3>
                      <p className="text-gray-600 text-sm mb-4">
                        El servicio será eliminado permanentemente.
                      </p>
                      <div className="flex gap-2">
                        <Button
                          onClick={handleCancelarEliminar}
                          variant="outline"
                          className="flex-1"
                        >
                          Cancelar
                        </Button>
                        <Button
                          onClick={() => handleConfirmarEliminar(servicio.id)}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                        >
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Modal de confirmación pagar */}
                {confirmPagar?.id === servicio.id && (
                  <div className="absolute inset-0 bg-black/50 rounded-lg z-10 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full">
                      <h3 className="font-bold text-lg mb-2">Confirmar Pago</h3>
                      <p className="text-gray-600 text-sm mb-2">
                        {confirmPagar.nombre} - {confirmPagar.proveedor}
                      </p>
                      <p className="text-2xl font-bold text-green-600 mb-4">
                        ${parseFloat(confirmPagar.monto_mensual).toFixed(2)}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          onClick={handleCancelarPagar}
                          variant="outline"
                          className="flex-1"
                        >
                          Cancelar
                        </Button>
                        <Button
                          onClick={handleConfirmarPagar}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                        >
                          Confirmar Pago
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                <ServicioCard
                  servicio={servicio}
                  onPagar={handlePagarClick}
                  onEliminar={handleEliminarClick}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modales */}
      <ModalCrearServicio
        isOpen={modalCrearOpen}
        onClose={() => setModalCrearOpen(false)}
        proveedores={proveedores}
        onCrear={handleCrear}
      />
    </div>
  );
}
