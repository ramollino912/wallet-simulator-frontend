"use client";

import { TarjetaTransporte } from '@/lib/transporteService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, Trash2, Plus } from 'lucide-react';

interface TarjetaCardProps {
  tarjeta: TarjetaTransporte;
  onRecargar: (tarjeta: TarjetaTransporte) => void;
  onEliminar: (tarjetaId: number) => void;
}

export default function TarjetaCard({ tarjeta, onRecargar, onEliminar }: TarjetaCardProps) {
  // Función para formatear número de tarjeta
  const formatearNumeroTarjeta = (numero: string) => {
    return numero.replace(/(\d{4})(?=\d)/g, '$1-');
  };

  // Colores según empresa
  const getColorEmpresa = (empresa: string) => {
    switch (empresa.toUpperCase()) {
      case 'SUBE':
        return 'bg-blue-600';
      case 'MOVE':
        return 'bg-green-600';
      case 'DIPLOMATICO':
        return 'bg-purple-600';
      case 'BONDICARD':
        return 'bg-orange-600';
      default:
        return 'bg-gray-600';
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow border-2">
      <CardHeader className={`${getColorEmpresa(tarjeta.empresa)} text-white rounded-t-lg`}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl font-bold">{tarjeta.empresa}</CardTitle>
            <p className="text-white/80 text-sm mt-1 font-mono">
              {formatearNumeroTarjeta(tarjeta.numero_tarjeta)}
            </p>
          </div>
          <CreditCard className="h-10 w-10 opacity-90" />
        </div>
      </CardHeader>
      
      <CardContent className="pt-6 space-y-4">
        {/* Saldo */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-lg">
          <p className="text-xs text-gray-600 mb-1 font-medium">Saldo disponible</p>
          <p className="text-3xl font-bold text-green-600">
            ${parseFloat(tarjeta.saldo).toFixed(2)}
          </p>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-2">
          <Button
            onClick={() => onRecargar(tarjeta)}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Recargar
          </Button>
          
          <Button
            onClick={() => onEliminar(tarjeta.id)}
            variant="outline"
            className="border-red-300 text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Estado */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">Estado</span>
          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium">
            Activa
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
