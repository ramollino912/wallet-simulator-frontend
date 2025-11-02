import api from './axios';

// Tipos
export interface TarjetaTransporte {
  id: number;
  numero_tarjeta: string;
  empresa: string;
  saldo: string;
  activo: boolean;
  usuario_id: number;
}

export interface EstadisticasTransporte {
  total_tarjetas: number;
  total_saldo: number;
  promedio_saldo: number;
  tarjetas_por_empresa: {
    [key: string]: {
      cantidad: number;
      saldo_total: number;
    };
  };
}

export interface RecargaResponse {
  message: string;
  saldo_tarjeta: number;
  saldo_usuario: number;
}

// Servicio de API de Transporte
class TransporteService {
  /**
   * Obtener lista de empresas disponibles (público)
   */
  async obtenerEmpresas(): Promise<string[]> {
    const response = await api.get('/transporte/empresas');
    return response.data;
  }

  /**
   * Obtener todas las tarjetas activas del usuario autenticado
   */
  async obtenerTarjetas(): Promise<TarjetaTransporte[]> {
    const response = await api.get('/transporte/tarjetas');
    return response.data;
  }

  /**
   * Obtener tarjetas desactivadas del usuario
   */
  async obtenerTarjetasDesactivadas(): Promise<TarjetaTransporte[]> {
    const response = await api.get('/transporte/tarjetas/desactivadas');
    return response.data;
  }

  /**
   * Registrar una nueva tarjeta de transporte
   */
  async registrarTarjeta(numeroTarjeta: string, empresa: string): Promise<TarjetaTransporte> {
    const response = await api.post('/transporte/tarjetas', {
      numero_tarjeta: numeroTarjeta,
      empresa: empresa
    });
    return response.data.tarjeta;
  }

  /**
   * Recargar saldo en una tarjeta
   */
  async recargarTarjeta(tarjetaId: number, monto: number): Promise<RecargaResponse> {
    const response = await api.post('/transporte/recargar', {
      tarjeta_id: tarjetaId,
      monto: monto
    });
    return response.data;
  }

  /**
   * Eliminar (desactivar) una tarjeta
   */
  async eliminarTarjeta(tarjetaId: number): Promise<{ message: string }> {
    const response = await api.delete(`/transporte/tarjetas/${tarjetaId}`);
    return response.data;
  }

  /**
   * Reactivar una tarjeta desactivada
   */
  async reactivarTarjeta(tarjetaId: number): Promise<TarjetaTransporte> {
    const response = await api.put(`/transporte/tarjetas/${tarjetaId}/reactivar`);
    return response.data.tarjeta;
  }

  /**
   * Consultar saldo de una tarjeta específica
   */
  async obtenerSaldoTarjeta(tarjetaId: number): Promise<{
    saldo: string;
    empresa: string;
    numero_tarjeta: string;
  }> {
    const response = await api.get(`/transporte/tarjetas/${tarjetaId}/saldo`);
    return response.data;
  }

  /**
   * Obtener estadísticas de transporte del usuario
   */
  async obtenerEstadisticas(): Promise<EstadisticasTransporte> {
    const response = await api.get('/transporte/estadisticas');
    return response.data;
  }
}

// Exportar instancia única
const transporteService = new TransporteService();
export default transporteService;
