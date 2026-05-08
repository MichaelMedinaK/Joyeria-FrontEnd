import { authService } from './auth.service';
import { Stock, CreateStockDto, TransferirStockDto } from '@shared/types';

const BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || 'http://localhost:8080/api';
const API_URL = `${BASE_URL}/stock`;

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const stockService = {
  getStockDueno: async (): Promise<Stock[]> => {
    try {
      const token = authService.getToken();
      
      if (!token) {
        throw new Error('No hay sesión activa');
      }

      const response = await fetch(`${API_URL}/dueno`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener stock del dueño');
      }

      const result: ApiResponse<Stock[]> = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error al cargar stock del dueño:', error);
      return [];
    }
  },

  getStockRevendedor: async (idRevendedor: number): Promise<Stock[]> => {
    try {
      const token = authService.getToken();
      
      if (!token) {
        throw new Error('No hay sesión activa');
      }

      const response = await fetch(`${API_URL}/revendedor/${idRevendedor}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener stock del revendedor');
      }

      const result: ApiResponse<Stock[]> = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error al cargar stock del revendedor:', error);
      return [];
    }
  },

  getStockBajo: async (): Promise<Stock[]> => {
    try {
      const token = authService.getToken();
      
      if (!token) {
        throw new Error('No hay sesión activa');
      }

      const response = await fetch(`${API_URL}/bajo`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener stock bajo');
      }

      const result: ApiResponse<Stock[]> = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error al cargar stock bajo:', error);
      return [];
    }
  },

  createOrUpdate: async (data: CreateStockDto): Promise<Stock> => {
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
        throw new Error(errorData.message || 'Error al guardar stock');
      }

      const result: ApiResponse<Stock> = await response.json();
      return result.data;
    } catch (error: any) {
      console.error('Error al guardar stock:', error);
      throw error;
    }
  },

  transferir: async (data: TransferirStockDto): Promise<void> => {
    try {
      const token = authService.getToken();
      
      if (!token) {
        throw new Error('No hay sesión activa');
      }

      const response = await fetch(`${API_URL}/transferir?idProducto=${data.idProducto}&idRevendedor=${data.idRevendedor}&cantidad=${data.cantidad}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al transferir stock');
      }
    } catch (error: any) {
      console.error('Error al transferir stock:', error);
      throw error;
    }
  }
};
