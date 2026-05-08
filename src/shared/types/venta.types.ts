export interface VentaRevendedor {
  id: number;
  revendedor_id: number;
  revendedor_nombre?: string;
  fecha: string;
  subtotal: number;
  ganancia: number;
  items: VentaRevendedorItem[];
}

export interface VentaRevendedorItem {
  producto_id: number;
  producto_nombre?: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

export interface CreateVentaRevendedorDto {
  revendedor_id: number;
  items: Array<{
    producto_id: number;
    cantidad: number;
    precio_unitario: number;
  }>;
}
