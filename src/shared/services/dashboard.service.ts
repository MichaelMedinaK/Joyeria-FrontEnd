import { DashboardStats } from '@shared/types';
import { authService } from './auth.service';

const BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || 'http://localhost:8080/api';
const API_URL = BASE_URL;

export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    try {
      const token = authService.getToken();
      
      if (!token) {
        throw new Error('No hay sesión activa');
      }

      const response = await fetch(`${API_URL}/dashboard/stats`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener estadísticas');
      }

      const result = await response.json();
      return result.data || result;
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
      // Retornar datos mock en caso de error
      return {
        ventasDelDia: 0,
        gananciaDelDia: 0,
        pedidosPendientes: 0
      };
    }
  }
};
