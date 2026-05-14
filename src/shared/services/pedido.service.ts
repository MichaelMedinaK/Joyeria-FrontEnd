import { authService } from './auth.service';
import { Pedido } from '@shared/types';

const BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || 'http://localhost:8080/api';
const API_URL = `${BASE_URL}/pedidos`;

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

/** Decodifica el payload de un JWT sin verificar firma (solo para debug) */
function debugDecodeJwt(token: string): Record<string, unknown> | null {
  try {
    const payload = token.split('.')[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

/** Loguea el estado del token actual */
function logTokenInfo(token: string | null, prefix: string) {
  if (!token) {
    console.warn(`${prefix} - Token: AUSENTE en localStorage`);
    return;
  }
  const payload = debugDecodeJwt(token);
  if (!payload) {
    console.warn(`${prefix} - Token presente pero NO se pudo decodificar`);
    return;
  }
  const exp = payload.exp as number | undefined;
  const iat = payload.iat as number | undefined;
  const ahora = Math.floor(Date.now() / 1000);
  const expirado = exp ? exp < ahora : 'desconocido';
  console.log(`${prefix} - Token payload:`, {
    sub: payload.sub,
    rol: payload.rol,
    iat: iat ? new Date(iat * 1000).toLocaleString() : 'N/A',
    exp: exp ? new Date(exp * 1000).toLocaleString() : 'N/A',
    expirado,
    segundosRestantes: exp ? exp - ahora : 'N/A',
  });
}

/** Fuerza logout y redirige a /login ante respuestas 401 o 403 */
function handleUnauthorized(status: number) {
  if (status === 401 || status === 403) {
    authService.clearAuth();
    window.location.replace('/login');
  }
}

/** Loguea el body de una respuesta de error */
async function logErrorResponse(response: Response, prefix: string) {
  try {
    const text = await response.clone().text();
    console.error(`${prefix} - Status ${response.status} | Body:`, text);
  } catch {
    console.error(`${prefix} - Status ${response.status} | No se pudo leer el body`);
  }
}

export const pedidoService = {
  getAll: async (): Promise<Pedido[]> => {
    try {
      const token = authService.getToken();
      
      if (!token) {
        throw new Error('No hay sesión activa');
      }

      console.log('[PedidoService] getAll - URL:', API_URL);
      logTokenInfo(token, '[PedidoService] getAll');

      const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('[PedidoService] getAll - Status:', response.status);

      if (!response.ok) {
        await logErrorResponse(response, '[PedidoService] getAll');
        handleUnauthorized(response.status);
        throw new Error(`Error al obtener pedidos (${response.status})`);
      }

      const result: ApiResponse<Pedido[]> = await response.json();
      const ahora = new Date();
      console.log('[PedidoService] getAll - Hora local del navegador:', ahora.toLocaleString());
      console.log('[PedidoService] getAll - Timezone:', Intl.DateTimeFormat().resolvedOptions().timeZone);
      console.log('[PedidoService] getAll - Fecha local (YYYY-MM-DD):', ahora.toLocaleDateString('sv-SE'));
      console.log('[PedidoService] getAll - Total pedidos recibidos:', result.data?.length);
      result.data?.forEach(p =>
        console.log(`[PedidoService] Pedido ID=${(p as any).idPedido ?? (p as any).id} | fechaPedido raw="${p.fechaPedido}" | fechaEntrega="${(p as any).fechaEntrega}" | estado="${(p as any).estadoPedido ?? (p as any).estado}"`)
      );
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
      console.log('[PedidoService] getByFechas - URL:', API_URL);
      logTokenInfo(token, '[PedidoService] getByFechas');

      const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('[PedidoService] getByFechas - Status:', response.status);

      if (!response.ok) {
        await logErrorResponse(response, '[PedidoService] getByFechas');
        handleUnauthorized(response.status);
        throw new Error(`Error al obtener pedidos (${response.status})`);
      }

      const result: ApiResponse<Pedido[]> = await response.json();
      const ahora = new Date();
      console.log('[PedidoService] getByFechas - Hora local del navegador:', ahora.toLocaleString());
      console.log('[PedidoService] getByFechas - Timezone:', Intl.DateTimeFormat().resolvedOptions().timeZone);
      console.log('[PedidoService] getByFechas - Fecha local (YYYY-MM-DD):', ahora.toLocaleDateString('sv-SE'));
      console.log('[PedidoService] getByFechas - Total pedidos recibidos:', result.data?.length);
      console.log('[PedidoService] getByFechas - Filtrando desde:', fechaDesde, 'hasta:', fechaHasta);
      
      // Filtrar por rango de fechas
      const pedidosFiltrados = result.data.filter(pedido => {
        const rawFecha = pedido.fechaPedido;
        // Parseo local (sin conversión UTC) para evitar problemas de timezone
        const fechaPedidoLocal = rawFecha
          ? new Date(rawFecha).toLocaleDateString('sv-SE')  // 'sv-SE' da formato YYYY-MM-DD en hora local
          : '';
        const fechaPedidoUTC = rawFecha
          ? new Date(rawFecha).toISOString().split('T')[0]
          : '';
        const incluidoLocal = fechaPedidoLocal >= fechaDesde && fechaPedidoLocal <= fechaHasta;
        const incluidoUTC   = fechaPedidoUTC   >= fechaDesde && fechaPedidoUTC   <= fechaHasta;
        const id = (pedido as any).idPedido ?? (pedido as any).id;
        console.log(
          `[PedidoService] Pedido ID=${id} | raw="${rawFecha}" | local="${fechaPedidoLocal}" | UTC="${fechaPedidoUTC}"` +
          ` | incluidoLocal=${incluidoLocal} | incluidoUTC=${incluidoUTC}`
        );
        return incluidoLocal;
      });
      
      console.log('[PedidoService] getByFechas - Pedidos filtrados (por hora local):', pedidosFiltrados.length);
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
