export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio_compra: number;
  precio_venta: number;
  activo: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreateProductoDto {
  nombre: string;
  descripcion: string;
  precio_compra: number;
  precio_venta: number;
  activo: boolean;
}

export interface UpdateProductoDto extends Partial<CreateProductoDto> {}
