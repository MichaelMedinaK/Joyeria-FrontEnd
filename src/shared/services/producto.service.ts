import { Producto } from '@shared/types';
import { authService } from './auth.service';

const API_URL = `${import.meta.env.VITE_API_URL}/productos`;

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface BackendProductoResponse {
  idProducto: number;
  nombre: string;
  descripcion: string;
  precioCompra: number;
  precioVenta: number;
  activo: boolean;
  fechaCreacion: string;
}

export const productoService = {
  getAll: async (): Promise<Producto[]> => {
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
        throw new Error('Error al obtener productos');
      }

      const result: ApiResponse<BackendProductoResponse[]> = await response.json();
      
      // Mapear respuesta del backend al formato del frontend
      return result.data.map(producto => ({
        id: producto.idProducto,
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        precio_compra: producto.precioCompra,
        precio_venta: producto.precioVenta,
        activo: producto.activo
      }));
    } catch (error) {
      console.error('Error al cargar productos:', error);
      return [];
    }
  },

  getActivos: async (): Promise<Producto[]> => {
    try {
      const token = authService.getToken();
      
      if (!token) {
        throw new Error('No hay sesión activa');
      }

      const response = await fetch(`${API_URL}/activos`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener productos activos');
      }

      const result: ApiResponse<BackendProductoResponse[]> = await response.json();
      
      return result.data.map(producto => ({
        id: producto.idProducto,
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        precio_compra: producto.precioCompra,
        precio_venta: producto.precioVenta,
        activo: producto.activo
      }));
    } catch (error) {
      console.error('Error al cargar productos activos:', error);
      return [];
    }
  },

  getById: async (id: number): Promise<Producto | null> => {
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
        throw new Error('Error al obtener producto');
      }

      const result: ApiResponse<BackendProductoResponse> = await response.json();
      
      return {
        id: result.data.idProducto,
        nombre: result.data.nombre,
        descripcion: result.data.descripcion,
        precio_compra: result.data.precioCompra,
        precio_venta: result.data.precioVenta,
        activo: result.data.activo
      };
    } catch (error) {
      console.error('Error al cargar producto:', error);
      return null;
    }
  },

  crear: async (data: {
    nombre: string;
    descripcion: string;
    precioCompra: number;
    precioVenta: number;
    activo: boolean;
  }): Promise<Producto | null> => {
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
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al crear producto');
      }

      const result: ApiResponse<BackendProductoResponse> = await response.json();
      
      return {
        id: result.data.idProducto,
        nombre: result.data.nombre,
        descripcion: result.data.descripcion,
        precio_compra: result.data.precioCompra,
        precio_venta: result.data.precioVenta,
        activo: result.data.activo
      };
    } catch (error: any) {
      console.error('Error al crear producto:', error);
      throw error;
    }
  },

  actualizar: async (id: number, data: {
    nombre: string;
    descripcion: string;
    precioCompra: number;
    precioVenta: number;
    activo: boolean;
  }): Promise<Producto | null> => {
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
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al actualizar producto');
      }

      const result: ApiResponse<BackendProductoResponse> = await response.json();
      
      return {
        id: result.data.idProducto,
        nombre: result.data.nombre,
        descripcion: result.data.descripcion,
        precio_compra: result.data.precioCompra,
        precio_venta: result.data.precioVenta,
        activo: result.data.activo
      };
    } catch (error: any) {
      console.error('Error al actualizar producto:', error);
      throw error;
    }
  }
};
