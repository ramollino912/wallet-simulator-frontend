import { create } from 'zustand';
import serviciosService, { Servicio, Proveedores } from '@/lib/serviciosService';

interface ServiciosState {
  // Estado
  servicios: Servicio[];
  proveedores: Proveedores | null;
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;

  // Acciones
  cargarProveedores: () => Promise<void>;
  cargarServicios: () => Promise<void>;
  crearServicio: (
    nombre: string,
    tipo: 'luz' | 'agua' | 'gas' | 'celular',
    proveedor: string,
    numero_servicio: string,
    monto_mensual: number,
    fecha_vencimiento: string
  ) => Promise<void>;
  pagarServicio: (servicioId: number) => Promise<{ saldo_actual: number }>;
  pagarTodos: () => Promise<{ servicios_pagados: number; total_pagado: number; saldo_actual: number }>;
  eliminarServicio: (servicioId: number) => Promise<void>;
  cambiarCelular: (nuevoProveedor: string, nuevoNumero: string) => Promise<void>;
  limpiarCelulares: () => Promise<void>;
  clearError: () => void;
  clearSuccess: () => void;
}

export const useServiciosStore = create<ServiciosState>((set, get) => ({
  // Estado inicial
  servicios: [],
  proveedores: null,
  isLoading: false,
  error: null,
  successMessage: null,

  // Limpiar errores
  clearError: () => set({ error: null }),

  // Limpiar mensaje de éxito
  clearSuccess: () => set({ successMessage: null }),

  // Cargar proveedores disponibles
  cargarProveedores: async () => {
    set({ isLoading: true, error: null });
    try {
      const proveedores = await serviciosService.obtenerProveedores();
      set({ proveedores, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Error al cargar proveedores',
        isLoading: false,
      });
    }
  },

  // Cargar servicios del usuario
  cargarServicios: async () => {
    set({ isLoading: true, error: null });
    try {
      const servicios = await serviciosService.obtenerServicios();
      set({ servicios, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Error al cargar servicios',
        isLoading: false,
      });
    }
  },

  // Crear nuevo servicio
  crearServicio: async (
    nombre: string,
    tipo: 'luz' | 'agua' | 'gas' | 'celular',
    proveedor: string,
    numero_servicio: string,
    monto_mensual: number,
    fecha_vencimiento: string
  ) => {
    set({ isLoading: true, error: null, successMessage: null });
    try {
      const nuevoServicio = await serviciosService.crearServicio(
        nombre,
        tipo,
        proveedor,
        numero_servicio,
        monto_mensual,
        fecha_vencimiento
      );

      // Agregar el nuevo servicio al estado
      set((state) => ({
        servicios: [...state.servicios, nuevoServicio],
        isLoading: false,
        successMessage: 'Servicio creado exitosamente',
      }));

      // Recargar servicios
      get().cargarServicios();
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Error al crear servicio',
        isLoading: false,
      });
      throw error;
    }
  },

  // Pagar servicio individual
  pagarServicio: async (servicioId: number) => {
    set({ isLoading: true, error: null, successMessage: null });
    try {
      const resultado = await serviciosService.pagarServicio(servicioId);

      // Actualizar el estado del servicio en el estado local
      set((state) => ({
        servicios: state.servicios.map((s) =>
          s.id === servicioId ? { ...s, estado: 'pagado' as const } : s
        ),
        isLoading: false,
        successMessage: `Servicio pagado exitosamente. Saldo actual: $${resultado.saldo_actual.toFixed(2)}`,
      }));

      // Recargar servicios
      get().cargarServicios();

      return resultado;
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Error al pagar servicio',
        isLoading: false,
      });
      throw error;
    }
  },

  // Pagar todos los servicios pendientes
  pagarTodos: async () => {
    set({ isLoading: true, error: null, successMessage: null });
    try {
      const resultado = await serviciosService.pagarTodosLosServicios();

      set({
        isLoading: false,
        successMessage: `${resultado.servicios_pagados} servicios pagados. Total: $${resultado.total_pagado.toFixed(2)}`,
      });

      // Recargar servicios
      get().cargarServicios();

      return resultado;
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Error al pagar servicios',
        isLoading: false,
      });
      throw error;
    }
  },

  // Eliminar servicio
  eliminarServicio: async (servicioId: number) => {
    set({ isLoading: true, error: null, successMessage: null });
    try {
      await serviciosService.eliminarServicio(servicioId);

      // Remover el servicio del estado
      set((state) => ({
        servicios: state.servicios.filter((s) => s.id !== servicioId),
        isLoading: false,
        successMessage: 'Servicio eliminado exitosamente',
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Error al eliminar servicio',
        isLoading: false,
      });
      throw error;
    }
  },

  // Cambiar servicio celular
  cambiarCelular: async (nuevoProveedor: string, nuevoNumero: string) => {
    set({ isLoading: true, error: null, successMessage: null });
    try {
      const servicioActualizado = await serviciosService.cambiarServicioCelular(
        nuevoProveedor,
        nuevoNumero
      );

      // Actualizar el servicio en el estado
      set((state) => ({
        servicios: state.servicios.map((s) =>
          s.id === servicioActualizado.id ? servicioActualizado : s
        ),
        isLoading: false,
        successMessage: 'Servicio celular actualizado exitosamente',
      }));

      // Recargar servicios
      get().cargarServicios();
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Error al cambiar servicio celular',
        isLoading: false,
      });
      throw error;
    }
  },

  // Limpiar servicios celulares
  limpiarCelulares: async () => {
    set({ isLoading: true, error: null, successMessage: null });
    try {
      await serviciosService.limpiarServiciosCelulares();

      set({
        isLoading: false,
        successMessage: 'Servicios celulares limpiados exitosamente',
      });

      // Recargar servicios
      get().cargarServicios();
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Error al limpiar servicios celulares',
        isLoading: false,
      });
      throw error;
    }
  },
}));
