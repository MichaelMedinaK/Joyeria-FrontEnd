export interface PedidoDetalle {
  idPedidoDetalle: number;
  idProducto: number;
  nombreProducto: string;
  cantidad: number;
  precioUnitario: number;
  precioCompraUnitario: number;
  subtotal: number;
  ganancia: number;
}

export interface Pedido {
  idPedido: number;
  idCliente: number;
  nombreCliente: string;
  idUsuario: number;
  nombreUsuario: string;
  estado: string;
  kilometros: number;
  subtotal: number;
  costoDelivery: number;
  total: number;
  gananciaTotal: number;
  fechaPedido: string;
  fechaEntrega?: string;
  rangoHorario?: string;
  tipoPago?: string;
  efectivo?: number;
  transferencia?: number;
  detalles: PedidoDetalle[];
}

export interface CreatePedidoDto {
  idCliente: number;
  kilometros: number;
  fechaEntrega: string;
  rangoHorario: string;
  tipoPago: string;
  detalles: Array<{
    idProducto: number;
    cantidad: number;
  }>;
}
