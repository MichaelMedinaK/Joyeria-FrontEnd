export interface Cliente {
  id: number;
  nombre: string;
  telefono: string;
  direccion: string;
  activo: boolean;
}

export interface CreateClienteDto {
  nombre: string;
  telefono: string;
  direccion: string;
}

export interface UpdateClienteDto extends Partial<CreateClienteDto> {}
