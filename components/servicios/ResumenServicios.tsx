"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Servicio } from '@/lib/serviciosService';
import { DollarSign, AlertCircle, CheckCircle } from 'lucide-react';

interface ResumenServiciosProps {
  servicios: Servicio[];
  onPagarTodos: () => void;
  isLoading: boolean;
  saldoUsuario: number;
}

export default function ResumenServicios({
  servicios,
  onPagarTodos,
  isLoading,
  saldoUsuario,
}: ResumenServiciosProps) {
  const serviciosPendientes = servicios.filter((s) => s.estado === 'pendiente');
  const serviciosPagados = servicios.filter((s) => s.estado === 'pagado');

  const totalPendiente = serviciosPendientes.reduce(
    (sum, s) => sum + parseFloat(s.monto_mensual),
    0
  );

  const totalPagado = serviciosPagados.reduce(
    (sum, s) => sum + parseFloat(s.monto_mensual),
    0
  );

  const saldoInsuficiente = totalPendiente > saldoUsuario;

  // Servicios por tipo
  const serviciosPorTipo = servicios.reduce((acc, servicio) => {
    acc[servicio.tipo] = (acc[servicio.tipo] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-4">
      {/* Resumen principal */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total servicios */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Servicios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">{servicios.length}</p>
            <p className="text-xs text-gray-500 mt-1">
              {serviciosPendientes.length} pendientes • {serviciosPagados.length} pagados
            </p>
          </CardContent>
        </Card>

        {/* Total pendiente */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Pendiente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-orange-600">
              ${totalPendiente.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {serviciosPendientes.length} servicio{serviciosPendientes.length !== 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>

        {/* Total pagado este mes */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Pagado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">
              ${totalPagado.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {serviciosPagados.length} servicio{serviciosPagados.length !== 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Botón pagar todos */}
      {serviciosPendientes.length > 0 && (
        <Card className={saldoInsuficiente ? 'border-red-300' : 'border-green-300'}>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {saldoInsuficiente ? (
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  ) : (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  )}
                  <h3 className="font-bold text-lg">Pagar Todos los Servicios</h3>
                </div>
                <p className="text-sm text-gray-600">
                  {serviciosPendientes.length} servicio{serviciosPendientes.length !== 1 ? 's' : ''} pendiente{serviciosPendientes.length !== 1 ? 's' : ''} • 
                  Total: <span className="font-bold">${totalPendiente.toFixed(2)}</span>
                </p>
                {saldoInsuficiente && (
                  <p className="text-sm text-red-600 mt-1 font-medium">
                    ⚠️ Saldo insuficiente. Necesitas ${(totalPendiente - saldoUsuario).toFixed(2)} más
                  </p>
                )}
              </div>

              <Button
                onClick={onPagarTodos}
                disabled={isLoading || saldoInsuficiente}
                className="bg-green-600 hover:bg-green-700 text-white px-6"
              >
                <DollarSign className="h-4 w-4 mr-2" />
                {isLoading ? 'Pagando...' : 'Pagar Todos'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Distribución por tipo */}
      {Object.keys(serviciosPorTipo).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Servicios por Tipo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {Object.entries(serviciosPorTipo).map(([tipo, cantidad]) => {
                const emojis: Record<string, string> = {
                  luz: '💡',
                  agua: '💧',
                  gas: '🔥',
                  celular: '📱',
                };
                return (
                  <div
                    key={tipo}
                    className="px-3 py-2 bg-gray-100 rounded-lg flex items-center gap-2"
                  >
                    <span>{emojis[tipo]}</span>
                    <span className="font-medium capitalize">{tipo}</span>
                    <span className="text-sm text-gray-600">({cantidad})</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
