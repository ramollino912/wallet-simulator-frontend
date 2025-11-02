"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EstadisticasTransporte } from '@/lib/transporteService';
import { TrendingUp, CreditCard, DollarSign, BarChart3 } from 'lucide-react';

interface EstadisticasPanelProps {
  estadisticas: EstadisticasTransporte;
}

export default function EstadisticasPanel({ estadisticas }: EstadisticasPanelProps) {
  // Obtener array de empresas con datos
  const empresasData = Object.entries(estadisticas.tarjetas_por_empresa || {});

  return (
    <div className="space-y-6">
      {/* Estadísticas generales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total tarjetas */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Tarjetas
              </CardTitle>
              <CreditCard className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">
              {estadisticas.total_tarjetas}
            </p>
          </CardContent>
        </Card>

        {/* Saldo total */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">
                Saldo Total
              </CardTitle>
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">
              ${estadisticas.total_saldo.toFixed(2)}
            </p>
          </CardContent>
        </Card>

        {/* Promedio */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">
                Promedio por Tarjeta
              </CardTitle>
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-purple-600">
              ${estadisticas.promedio_saldo.toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Distribución por empresa */}
      {empresasData.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-gray-600" />
              <CardTitle>Distribución por Empresa</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {empresasData.map(([empresa, datos]) => {
                const porcentajeCantidad = (datos.cantidad / estadisticas.total_tarjetas) * 100;
                const porcentajeSaldo = (datos.saldo_total / estadisticas.total_saldo) * 100;

                return (
                  <div key={empresa} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-800">{empresa}</p>
                        <p className="text-sm text-gray-600">
                          {datos.cantidad} tarjeta{datos.cantidad !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">
                          ${datos.saldo_total.toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {porcentajeSaldo.toFixed(1)}% del total
                        </p>
                      </div>
                    </div>
                    
                    {/* Barra de progreso */}
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${porcentajeSaldo}%` }}
                      ></div>
                    </div>
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
