'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Filter, 
  Calendar,
  ChevronLeft,
  ChevronRight,
  Receipt
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import api from '@/lib/axios';

interface Transaccion {
  id: number;
  tipo: string;
  monto: number;
  descripcion: string;
  fecha: string;
  estado?: string;
  categoria?: string | {
    id: number;
    nombre: string;
  };
  esEnvio?: boolean;
  origen?: {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
  } | null;
  destino?: {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
  } | null;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function HistorialPage() {
  const router = useRouter();
  const [transacciones, setTransacciones] = useState<Transaccion[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('todos');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadTransacciones();
  }, [currentPage]);

  const loadTransacciones = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get(`/actividades?page=${currentPage}&limit=10`);
      
      if (response.data.success) {
        setTransacciones(response.data.actividades || []);
        setPagination({
          page: response.data.pagina || currentPage,
          limit: 10,
          total: response.data.total || 0,
          totalPages: response.data.totalPaginas || 0
        });
      } else {
        setError('No se pudieron cargar las transacciones');
      }
    } catch (error: any) {
      console.error('Error al cargar transacciones:', error);
      setError(error.data?.message || error.message || 'Error al cargar transacciones');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getTipoDisplay = (tipo: string, transaccion?: Transaccion): string => {
    if (!tipo) return 'Sin tipo';
    
    const tipoLower = tipo.toLowerCase();
    
    // Si es transferencia, determinar si es enviada o recibida
    if (tipoLower === 'transferencia') {
      if (transaccion?.esEnvio) {
        return 'Transferencia Enviada';
      } else {
        return 'Transferencia Recibida';
      }
    }
    
    // Todas las variaciones de recarga se muestran como "Ingreso"
    if (tipoLower.includes('recarga') || tipoLower === 'ingreso') {
      return 'Ingreso';
    }
    
    // Capitalizar primera letra
    return tipo.charAt(0).toUpperCase() + tipo.slice(1);
  };

  const getTransactionIcon = (tipo: string, esEnvio?: boolean) => {
    if (!tipo) return <Receipt className="h-5 w-5 text-slate-600" />;
    
    const tipoLower = tipo.toLowerCase();
    
    // Transferencias: verde si recibida, roja si enviada
    if (tipoLower === 'transferencia') {
      if (esEnvio) {
        return <ArrowUpRight className="h-5 w-5 text-red-600" />;
      } else {
        return <ArrowDownRight className="h-5 w-5 text-green-600" />;
      }
    }
    
    // Todas las variaciones de recarga e ingresos siempre verde
    if (tipoLower.includes('recarga') || tipoLower === 'ingreso') {
      return <ArrowDownRight className="h-5 w-5 text-green-600" />;
    }
    
    // Otros (pagos, etc) en rojo
    return <ArrowUpRight className="h-5 w-5 text-red-600" />;
  };

  const getTransactionColor = (tipo: string, esEnvio?: boolean) => {
    if (!tipo) return 'text-slate-600';
    
    const tipoLower = tipo.toLowerCase();
    
    // Transferencias: verde si recibida, roja si enviada
    if (tipoLower === 'transferencia') {
      return esEnvio ? 'text-red-600' : 'text-green-600';
    }
    
    // Todas las variaciones de recarga e ingresos siempre verde
    if (tipoLower.includes('recarga') || tipoLower === 'ingreso') {
      return 'text-green-600';
    }
    
    // Otros en rojo
    return 'text-red-600';
  };

  const getTransactionSign = (tipo: string, esEnvio?: boolean) => {
    if (!tipo) return '';
    
    const tipoLower = tipo.toLowerCase();
    
    // Transferencias: - si enviada, + si recibida
    if (tipoLower === 'transferencia') {
      return esEnvio ? '-' : '+';
    }
    
    // Todas las variaciones de recarga e ingresos siempre +
    if (tipoLower.includes('recarga') || tipoLower === 'ingreso') {
      return '+';
    }
    
    // Otros -
    return '-';
  };

  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return 'Fecha no disponible';
      
      const date = new Date(dateString);
      
      // Verificar si la fecha es válida
      if (isNaN(date.getTime())) {
        return 'Fecha inválida';
      }
      
      return new Intl.DateTimeFormat('es-AR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (error) {
      console.error('Error al formatear fecha:', error);
      return 'Fecha no disponible';
    }
  };

  const formatMonto = (monto: any): string => {
    try {
      const montoNumber = typeof monto === 'string' ? parseFloat(monto) : Number(monto);
      if (isNaN(montoNumber)) return '0.00';
      return montoNumber.toFixed(2);
    } catch (error) {
      console.error('Error al formatear monto:', error);
      return '0.00';
    }
  };

  const filteredTransacciones = filterType === 'todos' 
    ? transacciones 
    : transacciones.filter(t => {
        const tipoLower = t.tipo.toLowerCase();
        
        if (filterType === 'recarga') {
          // Incluir cualquier tipo que contenga 'recarga' o sea 'ingreso'
          return tipoLower.includes('recarga') || tipoLower === 'ingreso';
        }
        return tipoLower === filterType.toLowerCase();
      });

  if (loading && transacciones.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-slate-600">Cargando historial...</p>
        </div>
      </div>
    );
  }

  if (error && transacciones.length === 0) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold text-slate-800">Historial de Transacciones</h1>
          <Button
            variant="outline"
            onClick={() => router.push('/home')}
            className="text-lg"
          >
            Volver
          </Button>
        </div>
        <Card className="p-12 text-center">
          <div className="bg-red-100 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <Receipt className="h-10 w-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error al cargar transacciones</h2>
          <p className="text-slate-600 mb-4">{error}</p>
          <Button onClick={loadTransacciones}>
            Reintentar
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-800">Historial de Transacciones</h1>
          <p className="text-slate-600 mt-2">
            {pagination?.total || 0} transacciones registradas
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push('/home')}
          className="text-lg"
        >
          Volver
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-slate-600" />
            <span className="font-semibold text-slate-700">Filtrar por:</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={filterType === 'todos' ? 'default' : 'outline'}
              onClick={() => setFilterType('todos')}
              size="sm"
            >
              Todas
            </Button>
            <Button
              variant={filterType === 'recarga' ? 'default' : 'outline'}
              onClick={() => setFilterType('recarga')}
              size="sm"
              className="bg-green-600 hover:bg-green-700"
            >
              Ingresos
            </Button>
            <Button
              variant={filterType === 'transferencia' ? 'default' : 'outline'}
              onClick={() => setFilterType('transferencia')}
              size="sm"
              className="bg-red-600 hover:bg-red-700"
            >
              Transferencias
            </Button>
            <Button
              variant={filterType === 'pago' ? 'default' : 'outline'}
              onClick={() => setFilterType('pago')}
              size="sm"
              className="bg-purple-600 hover:bg-purple-700"
            >
              Pagos
            </Button>
          </div>
        </div>
      </Card>

      {/* Transactions List */}
      <Card className="p-6">
        {filteredTransacciones.length === 0 ? (
          <div className="text-center py-12">
            <Receipt className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <p className="text-xl text-slate-500">No hay transacciones para mostrar</p>
            <p className="text-slate-400 mt-2">
              {filterType !== 'todos' 
                ? 'Prueba con otro filtro' 
                : 'Realiza tu primera transacción'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTransacciones.map((transaccion) => (
              <div
                key={transaccion.id}
                className="flex items-center justify-between p-4 border-2 border-slate-200 rounded-lg hover:border-blue-400 hover:shadow-md transition-all cursor-pointer"
              >
                {/* Left side - Icon and details */}
                <div className="flex items-center gap-4 flex-1">
                  <div className="bg-slate-100 p-3 rounded-full">
                    {getTransactionIcon(transaccion.tipo, transaccion.esEnvio)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <p className="text-lg font-semibold text-slate-800">
                        {getTipoDisplay(transaccion.tipo, transaccion)}
                      </p>
                      {transaccion.categoria && (
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                          {typeof transaccion.categoria === 'string' 
                            ? transaccion.categoria 
                            : transaccion.categoria.nombre}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 mt-1">
                      {transaccion.descripcion || 'Sin descripción'}
                    </p>
                    {/* Mostrar origen/destino para transferencias */}
                    {transaccion.tipo.toLowerCase() === 'transferencia' && (
                      <p className="text-xs text-slate-500 mt-1">
                        {transaccion.esEnvio 
                          ? `Para: ${transaccion.destino?.nombre} ${transaccion.destino?.apellido || ''}`
                          : `De: ${transaccion.origen?.nombre} ${transaccion.origen?.apellido || ''}`
                        }
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(transaccion.fecha)}</span>
                    </div>
                  </div>
                </div>

                {/* Right side - Amount */}
                <div className="text-right">
                  <p className={`text-2xl font-bold ${getTransactionColor(transaccion.tipo, transaccion.esEnvio)}`}>
                    {getTransactionSign(transaccion.tipo, transaccion.esEnvio)}${formatMonto(transaccion.monto)}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    ID: #{transaccion.id}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-600">
              Página {currentPage} de {pagination.totalPages}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Anterior
              </Button>
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === pagination.totalPages}
              >
                Siguiente
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
