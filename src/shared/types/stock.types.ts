export interface Stock {
  idStock: number;
  idProducto: number;
  nombreProducto: string;
  idRevendedor: number | null;
  nombreRevendedor: string | null;
  cantidadActual: number;
  stockMinimo: number;
  fechaActualizacion: string;
  stockBajo: boolean;
}

export interface CreateStockDto {
  idProducto: number;
  idRevendedor?: number | null;
  cantidadActual: number;
  stockMinimo?: number;
}

export interface TransferirStockDto {
  idProducto: number;
  idRevendedor: number;
  cantidad: number;
}
