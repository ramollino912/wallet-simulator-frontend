"use client";

import { useEffect, useState } from 'react';
import { useTransporteStore } from '@/store/transporteStore';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import TarjetaCard from '@/components/transporte/TarjetaCard';
import ModalRegistrarTarjeta from '@/components/transporte/ModalRegistrarTarjeta';
import ModalRecargar from '@/components/transporte/ModalRecargar';
import EstadisticasPanel from '@/components/transporte/EstadisticasPanel';
import { TarjetaTransporte } from '@/lib/transporteService';
import {
  CreditCard,
  Plus,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Loader2,
  Archive,
  RotateCcw,
} from 'lucide-react';

export default function SubePage() {
  const [modalRegistrarOpen, setModalRegistrarOpen] = useState(false);
  const [modalRecargarOpen, setModalRecargarOpen] = useState(false);
  const [tarjetaSeleccionada, setTarjetaSeleccionada] = useState<TarjetaTransporte | null>(null);
  const [verDesactivadas, setVerDesactivadas] = useState(false);
  const [confirmEliminar, setConfirmEliminar] = useState<number | null>(null);

  const {
    tarjetas,
    tarjetasDesactivadas,
    empresas,
    estadisticas,
    isLoading,
    error,
    successMessage,
    cargarEmpresas,
    cargarTarjetas,
    cargarTarjetasDesactivadas,
    cargarEstadisticas,
    registrarTarjeta,
    recargarTarjeta,
    eliminarTarjeta,
    reactivarTarjeta,
    clearError,
    clearSuccess,
  } = useTransporteStore();

  const { user } = useAuthStore();

  useEffect(() => {
    cargarEmpresas();
    cargarTarjetas();
    cargarEstadisticas();
    cargarTarjetasDesactivadas();
  }, []);

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

  const handleOpenModalRecargar = (tarjeta: TarjetaTransporte) => {
    setTarjetaSeleccionada(tarjeta);
    setModalRecargarOpen(true);
  };

  const handleCloseModalRecargar = () => {
    setModalRecargarOpen(false);
    setTarjetaSeleccionada(null);
  };

  const handleRegistrar = async (numeroTarjeta: string, empresa: string) => {
    await registrarTarjeta(numeroTarjeta, empresa);
  };

  const handleRecargar = async (tarjetaId: number, monto: number) => {
    await recargarTarjeta(tarjetaId, monto);
  };

  const handleEliminarClick = (tarjetaId: number) => {
    setConfirmEliminar(tarjetaId);
  };

  const handleConfirmarEliminar = async (tarjetaId: number) => {
    await eliminarTarjeta(tarjetaId);
    setConfirmEliminar(null);
  };

  const handleCancelarEliminar = () => {
    setConfirmEliminar(null);
  };

  const handleReactivar = async (tarjetaId: number) => {
    await reactivarTarjeta(tarjetaId);
  };

  const handleRefresh = () => {
    cargarTarjetas();
    cargarEstadisticas();
    cargarTarjetasDesactivadas();
  };

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tarjetas de Transporte</h1>
          <p className="text-gray-600 mt-1">
            Administra tus tarjetas SUBE, MOVE, DIPLOMATICO y BONDICARD
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
            onClick={() => setModalRegistrarOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Nueva Tarjeta
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
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
          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium text-green-900">Éxito</p>
            <p className="text-green-700 text-sm">{successMessage}</p>
          </div>
          <button onClick={clearSuccess} className="text-green-600 hover:text-green-800">
            ×
          </button>
        </div>
      )}

      {user && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700 font-medium">Saldo disponible en Wallet</p>
                <p className="text-2xl font-bold text-blue-900">${user.saldo.toFixed(2)}</p>
              </div>
              <div className="text-blue-600">
                <CreditCard className="h-8 w-8" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {estadisticas && estadisticas.total_tarjetas > 0 && (
        <EstadisticasPanel estadisticas={estadisticas} />
      )}

      {tarjetasDesactivadas.length > 0 && (
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setVerDesactivadas(!verDesactivadas)}
            variant="outline"
            className="flex items-center gap-2"
          >
            {verDesactivadas ? (
              <>
                <CreditCard className="h-4 w-4" />
                Ver Tarjetas Activas
              </>
            ) : (
              <>
                <Archive className="h-4 w-4" />
                Ver Tarjetas Desactivadas ({tarjetasDesactivadas.length})
              </>
            )}
          </Button>
        </div>
      )}

      {isLoading && tarjetas.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Cargando tarjetas...</p>
          </div>
        </div>
      ) : verDesactivadas ? (
        <div>
          <h2 className="text-xl font-bold mb-4">Tarjetas Desactivadas</h2>
          {tarjetasDesactivadas.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Archive className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">No tienes tarjetas desactivadas</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tarjetasDesactivadas.map((tarjeta) => (
                <Card key={tarjeta.id} className="opacity-75 border-2 border-gray-300">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-lg">{tarjeta.empresa}</h3>
                        <p className="text-sm text-gray-600 font-mono">
                          {tarjeta.numero_tarjeta.replace(/(\d{4})(?=\d)/g, '$1-')}
                        </p>
                      </div>
                      <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                        Inactiva
                      </span>
                    </div>
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <p className="text-xs text-gray-600">Saldo</p>
                      <p className="text-xl font-bold text-gray-700">
                        ${parseFloat(tarjeta.saldo).toFixed(2)}
                      </p>
                    </div>
                    <Button
                      onClick={() => handleReactivar(tarjeta.id)}
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reactivar Tarjeta
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-bold mb-4">Mis Tarjetas Activas</h2>
          {tarjetas.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <CreditCard className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 font-medium mb-2">No tienes tarjetas registradas</p>
                <p className="text-gray-500 text-sm mb-6">
                  Registra tu primera tarjeta de transporte para comenzar
                </p>
                <Button
                  onClick={() => setModalRegistrarOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Registrar Mi Primera Tarjeta
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tarjetas.map((tarjeta) => (
                <div key={tarjeta.id} className="relative">
                  {confirmEliminar === tarjeta.id && (
                    <div className="absolute inset-0 bg-black/50 rounded-lg z-10 flex items-center justify-center p-4">
                      <div className="bg-white rounded-lg p-6 max-w-sm w-full">
                        <h3 className="font-bold text-lg mb-2">¿Desactivar tarjeta?</h3>
                        <p className="text-gray-600 text-sm mb-4">
                          La tarjeta se desactivará pero mantendrá su saldo. Podrás reactivarla después.
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
                            onClick={() => handleConfirmarEliminar(tarjeta.id)}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                          >
                            Desactivar
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                  <TarjetaCard
                    tarjeta={tarjeta}
                    onRecargar={handleOpenModalRecargar}
                    onEliminar={handleEliminarClick}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <ModalRegistrarTarjeta
        isOpen={modalRegistrarOpen}
        onClose={() => setModalRegistrarOpen(false)}
        empresas={empresas}
        onRegistrar={handleRegistrar}
      />

      <ModalRecargar
        isOpen={modalRecargarOpen}
        onClose={handleCloseModalRecargar}
        tarjeta={tarjetaSeleccionada}
        onRecargar={handleRecargar}
      />
    </div>
  );
}
