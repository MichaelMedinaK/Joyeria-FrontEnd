import { authService } from './auth.service';
import { Revendedor } from '@shared/types';

const BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || 'http://localhost:8080/api';
const API_URL = `${BASE_URL}/revendedores`;

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const revendedorService = {
  getAll: async (): Promise<Revendedor[]> => {
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
        throw new Error('Error al obtener revendedores');
      }

      const result: ApiResponse<Revendedor[]> = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error al cargar revendedores:', error);
      return [];
    }
  }
};
