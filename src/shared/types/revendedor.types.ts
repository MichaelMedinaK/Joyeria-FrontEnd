export interface Revendedor {
  idRevendedor: number;
  nombre: string;
  telefono: string;
  email: string;
  activo: boolean;
  fechaCreacion?: string;
}

export interface CreateRevendedorDto {
  nombre: string;
  telefono: string;
  email: string;
}

export interface UpdateRevendedorDto extends Partial<CreateRevendedorDto> {}
