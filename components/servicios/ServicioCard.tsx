"use client";

import { Servicio } from '@/lib/serviciosService';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Lightbulb, 
  Droplet, 
  Flame, 
  Smartphone, 
  Trash2, 
  DollarSign,
  Calendar,
  AlertCircle
} from 'lucide-react';

interface ServicioCardProps {
  servicio: Servicio;
  onPagar: (servicio: Servicio) => void;
  onEliminar: (servicioId: number) => void;
}

export default function ServicioCard({ servicio, onPagar, onEliminar }: ServicioCardProps) {
  // Función para obtener icono según tipo
  const getIconoTipo = (tipo: string) => {
    switch (tipo) {
      case 'luz':
        return <Lightbulb className="h-6 w-6" />;
      case 'agua':
        return <Droplet className="h-6 w-6" />;
      case 'gas':
        return <Flame className="h-6 w-6" />;
      case 'celular':
        return <Smartphone className="h-6 w-6" />;
      default:
        return <DollarSign className="h-6 w-6" />;
    }
  };

  // Color según tipo
  const getColorTipo = (tipo: string) => {
    switch (tipo) {
      case 'luz':
        return 'bg-yellow-500';
      case 'agua':
        return 'bg-blue-500';
      case 'gas':
        return 'bg-orange-500';
      case 'celular':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Color según estado
  const getColorEstado = (estado: string) => {
    switch (estado) {
      case 'pagado':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'vencido':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // Verificar si está próximo a vencer (menos de 7 días)
  const esProximoVencer = () => {
    const fechaVenc = new Date(servicio.fecha_vencimiento);
    const hoy = new Date();
    const diasRestantes = Math.ceil((fechaVenc.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
    return diasRestantes <= 7 && diasRestantes > 0 && servicio.estado === 'pendiente';
  };

  const isPendiente = servicio.estado === 'pendiente';
  const isPagado = servicio.estado === 'pagado';

  return (
    <Card className={`hover:shadow-lg transition-shadow border-2 ${isPagado ? 'opacity-75' : ''}`}>
      <CardHeader className={`${getColorTipo(servicio.tipo)} text-white rounded-t-lg p-4`}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1">
            {getIconoTipo(servicio.tipo)}
            <div>
              <h3 className="font-bold text-lg">{servicio.nombre}</h3>
              <p className="text-white/90 text-sm">{servicio.proveedor}</p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getColorEstado(servicio.estado)}`}>
            {servicio.estado.toUpperCase()}
          </span>
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-3">
        {/* Número de servicio */}
        <div>
          <p className="text-xs text-gray-500 mb-1">Número de servicio</p>
          <p className="font-mono text-sm font-medium">{servicio.numero_servicio}</p>
        </div>

        {/* Monto */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-xs text-gray-600 mb-1">Monto mensual</p>
          <p className="text-2xl font-bold text-gray-900">
            ${parseFloat(servicio.monto_mensual).toFixed(2)}
          </p>
        </div>

        {/* Fecha de vencimiento */}
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-gray-500" />
          <div>
            <p className="text-xs text-gray-500">Vence el</p>
            <p className="font-medium">
              {new Date(servicio.fecha_vencimiento).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>

        {/* Alerta si está próximo a vencer */}
        {esProximoVencer() && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-2 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-orange-600" />
            <p className="text-xs text-orange-700 font-medium">¡Próximo a vencer!</p>
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex gap-2 pt-2">
          {isPendiente && (
            <Button
              onClick={() => onPagar(servicio)}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              <DollarSign className="h-4 w-4 mr-2" />
              Pagar
            </Button>
          )}

          <Button
            onClick={() => onEliminar(servicio.id)}
            variant="outline"
            className={`border-red-300 text-red-600 hover:bg-red-50 ${isPendiente ? '' : 'flex-1'}`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
