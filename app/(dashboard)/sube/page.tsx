
"use client";
import { CreditCard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SubePage() {
  const tarjetas = [
    {
      id: 1,
      empresa: 'SUBE',
      numero: '6061234567890123',
      alias: 'Mi SUBE',
      saldo: 350.75,
      activa: true,
    },
    {
      id: 2,
      empresa: 'MOVE',
      numero: '6069876543210000',
      alias: 'Tarjeta MOVE',
      saldo: 120.0,
      activa: true,
    },
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tarjetas de Transporte</h1>
          <p className="text-gray-600 mt-1">
            Ejemplo de tarjetas SUBE y MOVE
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tarjetas.map((tarjeta) => (
          <Card key={tarjeta.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="bg-blue-600 text-white rounded-t-lg">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{tarjeta.alias}</CardTitle>
                  <p className="text-blue-100 text-sm mt-1">{tarjeta.empresa}</p>
                </div>
                <CreditCard className="h-8 w-8 opacity-80" />
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Número de tarjeta</p>
                <p className="font-mono text-sm">
                  {tarjeta.numero.replace(/(\d{4})/g, '$1 ').trim()}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Saldo disponible</p>
                <p className="text-2xl font-bold text-green-600">
                  ${tarjeta.saldo.toFixed(2)}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

    </div>
  );
}