import api from './axios';

// Tipos
export interface Servicio {
  id: number;
  nombre: string;
  tipo: 'luz' | 'agua' | 'gas' | 'celular';
  proveedor: string;
  numero_servicio: string;
  monto_mensual: string;
  fecha_vencimiento: string;
  estado: 'pendiente' | 'pagado' | 'vencido';
  activo: boolean;
  usuarioid: number;
}

export interface Proveedores {
  luz: string[];
  agua: string[];
  gas: string[];
  celular: string[];
}

export interface PagarServicioResponse {
  message: string;
  saldo_actual: number;
}

export interface PagarTodosResponse {
  message: string;
  servicios_pagados: number;
  total_pagado: number;
  saldo_actual: number;
}

// Servicio de API de Servicios
class ServiciosService {
  /**
   * Obtener lista de proveedores por tipo de servicio (público)
   */
  async obtenerProveedores(): Promise<Proveedores> {
    const response = await api.get('/servicios/proveedores');
    return response.data;
  }

  /**
   * Obtener todos los servicios activos del usuario
   */
  async obtenerServicios(): Promise<Servicio[]> {
    const response = await api.get('/servicios');
    return response.data;
  }

  /**
   * Crear un nuevo servicio
   */
  async crearServicio(
    nombre: string,
    tipo: 'luz' | 'agua' | 'gas' | 'celular',
    proveedor: string,
    numero_servicio: string,
    monto_mensual: number,
    fecha_vencimiento: string
  ): Promise<Servicio> {
    const response = await api.post('/servicios', {
      nombre,
      tipo,
      proveedor,
      numero_servicio,
      monto_mensual,
      fecha_vencimiento,
    });
    return response.data.servicio;
  }

  /**
   * Pagar un servicio específico
   */
  async pagarServicio(servicioId: number): Promise<PagarServicioResponse> {
    const response = await api.post(`/servicios/${servicioId}/pagar`);
    return response.data;
  }

  /**
   * Pagar todos los servicios pendientes
   */
  async pagarTodosLosServicios(): Promise<PagarTodosResponse> {
    const response = await api.post('/servicios/pagar-todos');
    return response.data;
  }

  /**
   * Eliminar un servicio (eliminación lógica)
   */
  async eliminarServicio(servicioId: number): Promise<{ message: string }> {
    const response = await api.delete(`/servicios/${servicioId}`);
    return response.data;
  }

  /**
   * Cambiar proveedor y número de servicio celular
   */
  async cambiarServicioCelular(
    nuevoProveedor: string,
    nuevoNumero: string
  ): Promise<Servicio> {
    const response = await api.put('/servicios/celular/cambiar', {
      nuevo_proveedor: nuevoProveedor,
      nuevo_numero: nuevoNumero,
    });
    return response.data.servicio;
  }

  /**
   * Limpiar todos los servicios celulares
   */
  async limpiarServiciosCelulares(): Promise<{ message: string }> {
    const response = await api.post('/servicios/celular/limpiar');
    return response.data;
  }
}

// Exportar instancia única
const serviciosService = new ServiciosService();
export default serviciosService;
