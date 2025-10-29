import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/axios';

// Tipos
export interface User {
  id: number;
  nombre: string;
  email: string;
  saldo: number;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Acciones
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (token: string) => Promise<void>;
  register: (nombre: string, apellido: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post('/auth/login', { email, password });
          
          const { token, usuario } = response.data;
          
          // Guardar token en localStorage
          localStorage.setItem('token', token);
          
          set({
            user: usuario,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          const errorMessage = error.message || 'Error al iniciar sesión';
          set({ 
            error: errorMessage,
            isLoading: false,
            isAuthenticated: false 
          });
          throw error;
        }
      },

      loginWithGoogle: async (googleToken: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post('/auth/google', { token: googleToken });
          
          const { token, usuario } = response.data;
          
          localStorage.setItem('token', token);
          
          set({
            user: usuario,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          const errorMessage = error.message || 'Error al iniciar sesión con Google';
          set({ 
            error: errorMessage,
            isLoading: false,
            isAuthenticated: false 
          });
          throw error;
        }
      },

      register: async (nombre: string, apellido: string, email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post('/auth/registro', { 
            nombre,
            apellido,
            email, 
            password 
          });
          
          const { token, usuario } = response.data;
          
          localStorage.setItem('token', token);
          
          set({
            user: usuario,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          const errorMessage = error.message || 'Error al registrar usuario';
          set({ 
            error: errorMessage,
            isLoading: false,
            isAuthenticated: false 
          });
          throw error;
        }
      },

      logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },

      clearError: () => {
        set({ error: null });
      },

      updateUser: (userData: Partial<User>) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        }));
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
