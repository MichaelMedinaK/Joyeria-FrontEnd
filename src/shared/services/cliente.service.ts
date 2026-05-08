import { Cliente } from '@shared/types';
import { authService } from './auth.service';

const BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || 'http://localhost:8080/api';
const API_URL = `${BASE_URL}/clientes`;

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface BackendClienteResponse {
  idCliente: number;
  nombre: string;
  telefono: string;
  direccion: string;
  fechaCreacion: string;
}

export const clienteService = {
  getAll: async (): Promise<Cliente[]> => {
    try {
      const token = authService.getToken();
      
      if (!token) {
        throw new Error('No hay sesión activa');
      }

      const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener clientes');
      }

      const result: ApiResponse<BackendClienteResponse[]> = await response.json();
      
      // Mapear respuesta del backend al formato del frontend
      return result.data.map(cliente => ({
        id: cliente.idCliente,
        nombre: cliente.nombre,
        telefono: cliente.telefono,
        direccion: cliente.direccion,
        activo: true
      }));
    } catch (error) {
      console.error('Error al cargar clientes:', error);
      return [];
    }
  },

  getById: async (id: number): Promise<Cliente | null> => {
    try {
      const token = authService.getToken();
      
      if (!token) {
        throw new Error('No hay sesión activa');
      }

      const response = await fetch(`${API_URL}/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener cliente');
      }

      const result: ApiResponse<BackendClienteResponse> = await response.json();
      
      return {
        id: result.data.idCliente,
        nombre: result.data.nombre,
        telefono: result.data.telefono,
        direccion: result.data.direccion,
        activo: true
      };
    } catch (error) {
      console.error('Error al cargar cliente:', error);
      return null;
    }
  },

  create: async (data: { nombre: string; telefono: string; direccion: string }): Promise<Cliente | null> => {
    try {
      const token = authService.getToken();
      
      if (!token) {
        throw new Error('No hay sesión activa');
      }

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al crear cliente');
      }

      const result: ApiResponse<BackendClienteResponse> = await response.json();
      
      return {
        id: result.data.idCliente,
        nombre: result.data.nombre,
        telefono: result.data.telefono,
        direccion: result.data.direccion,
        activo: true
      };
    } catch (error: any) {
      console.error('Error al crear cliente:', error);
      throw error;
    }
  },

  update: async (id: number, data: { nombre: string; telefono: string; direccion: string }): Promise<Cliente | null> => {
    try {
      const token = authService.getToken();
      
      if (!token) {
        throw new Error('No hay sesión activa');
      }

      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al actualizar cliente');
      }

      const result: ApiResponse<BackendClienteResponse> = await response.json();
      
      return {
        id: result.data.idCliente,
        nombre: result.data.nombre,
        telefono: result.data.telefono,
        direccion: result.data.direccion,
        activo: true
      };
    } catch (error: any) {
      console.error('Error al actualizar cliente:', error);
      throw error;
    }
  }
};
