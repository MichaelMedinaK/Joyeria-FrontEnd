export interface User {
  id: number;
  email: string;
  nombre: string;
  rol: 'ADMIN' | 'VENDEDOR' | 'REVENDEDOR';
}

export interface AuthResponse {
  token: string;
  tipo: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  nombre: string;
  email: string;
  password: string;
  rol: 'ADMIN' | 'VENDEDOR' | 'REVENDEDOR';
}

export interface UpdateUserData {
  nombre?: string;
  email?: string;
  password?: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface BackendAuthResponse {
  token: string;
  tipo: string;
  idUsuario: number;
  nombre: string;
  email: string;
  rol: string;
}
