'use client';

import { useEffect, useState } from 'react';
import { ArrowUpRight, ArrowDownRight, Wallet, Receipt, CreditCard, Bus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/axios';

interface WalletStats {
  totalTransacciones: number;
  totalServicios: number;
  totalTarjetas: number;
}

interface Transaction {
  id: number;
  tipo: string;
  monto: number;
  descripcion: string;
  fecha: string;
}

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<WalletStats | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Cargar estadísticas del wallet
      const walletResponse = await api.get('/wallet/estado');
      setStats(walletResponse.data.estadisticas);

      // Cargar transacciones recientes
      const transactionsResponse = await api.get('/transacciones?limit=5');
      setRecentTransactions(transactionsResponse.data.transacciones);
      
    } catch (error) {
      console.error('Error al cargar datos del dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600 mt-1">
          Bienvenido de vuelta, {user?.nombre}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Saldo */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Saldo Actual
            </CardTitle>
            <Wallet className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              ${user?.saldo?.toFixed(2) || '0.00'}
            </div>
            <p className="text-xs text-slate-600 mt-1">
              +12.5% desde el mes pasado
            </p>
          </CardContent>
        </Card>

        {/* Transacciones */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Transacciones
            </CardTitle>
            <Receipt className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {stats?.totalTransacciones || 0}
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Total de operaciones
            </p>
          </CardContent>
        </Card>

        {/* Servicios */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Servicios
            </CardTitle>
            <CreditCard className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {stats?.totalServicios || 0}
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Servicios activos
            </p>
          </CardContent>
        </Card>

        {/* Tarjetas */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Tarjetas
            </CardTitle>
            <Bus className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {stats?.totalTarjetas || 0}
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Tarjetas registradas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Transacciones Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTransactions.length === 0 ? (
              <p className="text-slate-600 text-center py-8">
                No hay transacciones recientes
              </p>
            ) : (
              recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-2 rounded-full ${
                        transaction.tipo === 'recarga'
                          ? 'bg-green-100'
                          : 'bg-red-100'
                      }`}
                    >
                      {transaction.tipo === 'recarga' ? (
                        <ArrowDownRight className="h-5 w-5 text-green-600" />
                      ) : (
                        <ArrowUpRight className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">
                        {transaction.descripcion}
                      </p>
                      <p className="text-sm text-slate-600">
                        {new Date(transaction.fecha).toLocaleDateString('es-AR', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`font-bold ${
                      transaction.tipo === 'recarga'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {transaction.tipo === 'recarga' ? '+' : '-'}$
                    {transaction.monto.toFixed(2)}
                  </div>
                </div>
              ))
            )}
          </div>
          {recentTransactions.length > 0 && (
            <div className="mt-4">
              <Button variant="outline" className="w-full">
                Ver Todas las Transacciones
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button className="h-20 text-lg">
          <ArrowDownRight className="mr-2 h-6 w-6" />
          Recargar Saldo
        </Button>
        <Button variant="outline" className="h-20 text-lg">
          <ArrowUpRight className="mr-2 h-6 w-6" />
          Transferir
        </Button>
        <Button variant="outline" className="h-20 text-lg">
          <CreditCard className="mr-2 h-6 w-6" />
          Pagar Servicios
        </Button>
      </div>
    </div>
  );
}
