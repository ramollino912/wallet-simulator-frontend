import { create } from 'zustand';
import transporteService, { TarjetaTransporte, EstadisticasTransporte } from '@/lib/transporteService';

interface TransporteState {
  // Estado
  tarjetas: TarjetaTransporte[];
  tarjetasDesactivadas: TarjetaTransporte[];
  empresas: string[];
  estadisticas: EstadisticasTransporte | null;
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;

  // Acciones
  cargarEmpresas: () => Promise<void>;
  cargarTarjetas: () => Promise<void>;
  cargarTarjetasDesactivadas: () => Promise<void>;
  cargarEstadisticas: () => Promise<void>;
  registrarTarjeta: (numeroTarjeta: string, empresa: string) => Promise<void>;
  recargarTarjeta: (tarjetaId: number, monto: number) => Promise<{ saldo_tarjeta: number; saldo_usuario: number }>;
  eliminarTarjeta: (tarjetaId: number) => Promise<void>;
  reactivarTarjeta: (tarjetaId: number) => Promise<void>;
  consultarSaldo: (tarjetaId: number) => Promise<{ saldo: string; empresa: string; numero_tarjeta: string }>;
  clearError: () => void;
  clearSuccess: () => void;
}

export const useTransporteStore = create<TransporteState>((set, get) => ({
  // Estado inicial
  tarjetas: [],
  tarjetasDesactivadas: [],
  empresas: [],
  estadisticas: null,
  isLoading: false,
  error: null,
  successMessage: null,

  // Limpiar errores
  clearError: () => set({ error: null }),

  // Limpiar mensaje de éxito
  clearSuccess: () => set({ successMessage: null }),

  // Cargar empresas disponibles
  cargarEmpresas: async () => {
    set({ isLoading: true, error: null });
    try {
      const empresas = await transporteService.obtenerEmpresas();
      set({ empresas, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Error al cargar empresas',
        isLoading: false,
      });
    }
  },

  // Cargar tarjetas activas
  cargarTarjetas: async () => {
    set({ isLoading: true, error: null });
    try {
      const tarjetas = await transporteService.obtenerTarjetas();
      set({ tarjetas, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Error al cargar tarjetas',
        isLoading: false,
      });
    }
  },

  // Cargar tarjetas desactivadas
  cargarTarjetasDesactivadas: async () => {
    set({ isLoading: true, error: null });
    try {
      const tarjetasDesactivadas = await transporteService.obtenerTarjetasDesactivadas();
      set({ tarjetasDesactivadas, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Error al cargar tarjetas desactivadas',
        isLoading: false,
      });
    }
  },

  // Cargar estadísticas
  cargarEstadisticas: async () => {
    set({ isLoading: true, error: null });
    try {
      const estadisticas = await transporteService.obtenerEstadisticas();
      set({ estadisticas, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Error al cargar estadísticas',
        isLoading: false,
      });
    }
  },

  // Registrar nueva tarjeta
  registrarTarjeta: async (numeroTarjeta: string, empresa: string) => {
    set({ isLoading: true, error: null, successMessage: null });
    try {
      const nuevaTarjeta = await transporteService.registrarTarjeta(numeroTarjeta, empresa);
      
      // Agregar la nueva tarjeta al estado
      set((state) => ({
        tarjetas: [...state.tarjetas, nuevaTarjeta],
        isLoading: false,
        successMessage: 'Tarjeta registrada exitosamente',
      }));

      // Recargar tarjetas y estadísticas
      get().cargarTarjetas();
      get().cargarEstadisticas();
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Error al registrar tarjeta',
        isLoading: false,
      });
      throw error;
    }
  },

  // Recargar tarjeta
  recargarTarjeta: async (tarjetaId: number, monto: number) => {
    set({ isLoading: true, error: null, successMessage: null });
    try {
      const resultado = await transporteService.recargarTarjeta(tarjetaId, monto);
      
      // Actualizar el saldo de la tarjeta en el estado local
      set((state) => ({
        tarjetas: state.tarjetas.map((t) =>
          t.id === tarjetaId ? { ...t, saldo: resultado.saldo_tarjeta.toString() } : t
        ),
        isLoading: false,
        successMessage: `Tarjeta recargada exitosamente. Nuevo saldo: $${resultado.saldo_tarjeta.toFixed(2)}`,
      }));

      // Recargar tarjetas y estadísticas
      get().cargarTarjetas();
      get().cargarEstadisticas();

      return resultado;
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Error al recargar tarjeta',
        isLoading: false,
      });
      throw error;
    }
  },

  // Eliminar (desactivar) tarjeta
  eliminarTarjeta: async (tarjetaId: number) => {
    set({ isLoading: true, error: null, successMessage: null });
    try {
      await transporteService.eliminarTarjeta(tarjetaId);
      
      // Mover la tarjeta de activas a desactivadas
      set((state) => {
        const tarjetaEliminada = state.tarjetas.find((t) => t.id === tarjetaId);
        return {
          tarjetas: state.tarjetas.filter((t) => t.id !== tarjetaId),
          tarjetasDesactivadas: tarjetaEliminada
            ? [...state.tarjetasDesactivadas, { ...tarjetaEliminada, activo: false }]
            : state.tarjetasDesactivadas,
          isLoading: false,
          successMessage: 'Tarjeta desactivada exitosamente',
        };
      });

      // Recargar estadísticas
      get().cargarEstadisticas();
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Error al eliminar tarjeta',
        isLoading: false,
      });
      throw error;
    }
  },

  // Reactivar tarjeta
  reactivarTarjeta: async (tarjetaId: number) => {
    set({ isLoading: true, error: null, successMessage: null });
    try {
      const tarjetaReactivada = await transporteService.reactivarTarjeta(tarjetaId);
      
      // Mover la tarjeta de desactivadas a activas
      set((state) => ({
        tarjetas: [...state.tarjetas, tarjetaReactivada],
        tarjetasDesactivadas: state.tarjetasDesactivadas.filter((t) => t.id !== tarjetaId),
        isLoading: false,
        successMessage: 'Tarjeta reactivada exitosamente',
      }));

      // Recargar estadísticas
      get().cargarEstadisticas();
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Error al reactivar tarjeta',
        isLoading: false,
      });
      throw error;
    }
  },

  // Consultar saldo de una tarjeta
  consultarSaldo: async (tarjetaId: number) => {
    set({ isLoading: true, error: null });
    try {
      const saldoInfo = await transporteService.obtenerSaldoTarjeta(tarjetaId);
      set({ isLoading: false });
      return saldoInfo;
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Error al consultar saldo',
        isLoading: false,
      });
      throw error;
    }
  },
}));
