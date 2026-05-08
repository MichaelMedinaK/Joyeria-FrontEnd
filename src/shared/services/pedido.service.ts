import { authService } from './auth.service';
import { Pedido } from '@shared/types';

const API_URL = `${import.meta.env.VITE_API_URL}/pedidos`;

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface PedidoDetalleRequest {
  idProducto: number;
  cantidad: number;
}

interface CrearPedidoRequest {
  idCliente: number;
  idUsuario: number;
  estado: string;
  kilometros: number;
  fechaEntrega: string;
  rangoHorario: string;
  tipoPago: string;
  detalles: PedidoDetalleRequest[];
}

export const pedidoService = {
  getAll: async (): Promise<Pedido[]> => {
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
        throw new Error('Error al obtener pedidos');
      }

      const result: ApiResponse<Pedido[]> = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error al cargar pedidos:', error);
      return [];
    }
  },

  getByFechas: async (fechaDesde: string, fechaHasta: string): Promise<Pedido[]> => {
    try {
      const token = authService.getToken();
      
      if (!token) {
        throw new Error('No hay sesión activa');
      }

      // Obtener todos los pedidos y filtrar por fecha en el cliente
      const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener pedidos');
      }

      const result: ApiResponse<Pedido[]> = await response.json();
      
      // Filtrar por rango de fechas
      const pedidosFiltrados = result.data.filter(pedido => {
        const fechaPedido = new Date(pedido.fechaPedido).toISOString().split('T')[0];
        return fechaPedido >= fechaDesde && fechaPedido <= fechaHasta;
      });
      
      return pedidosFiltrados;
    } catch (error) {
      console.error('Error al cargar pedidos por fecha:', error);
      return [];
    }
  },

  crear: async (data: {
    idCliente: number;
    kilometros: number;
    fechaEntrega: string;
    rangoHorario: string;
    tipoPago: string;
    detalles: PedidoDetalleRequest[];
  }): Promise<Pedido | null> => {
    try {
      const token = authService.getToken();
      const usuario = authService.getCurrentUser();
      
      if (!token || !usuario) {
        throw new Error('No hay sesión activa');
      }

      const request: CrearPedidoRequest = {
        idCliente: data.idCliente,
        idUsuario: usuario.id,
        estado: 'PENDIENTE',
        kilometros: data.kilometros,
        fechaEntrega: data.fechaEntrega,
        rangoHorario: data.rangoHorario,
        tipoPago: data.tipoPago,
        detalles: data.detalles,
      };

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al crear pedido');
      }

      const result: ApiResponse<Pedido> = await response.json();
      return result.data;
    } catch (error: any) {
      console.error('Error al crear pedido:', error);
      throw error;
    }
  }
};
