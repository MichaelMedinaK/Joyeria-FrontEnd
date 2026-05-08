import { 
  AuthResponse, 
  LoginCredentials, 
  RegisterData, 
  UpdateUserData, 
  User, 
  ApiResponse, 
  BackendAuthResponse 
} from '@shared/types';

// Remover barra final si existe para evitar doble slash
const BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || 'http://localhost:8080/api';
const API_URL = `${BASE_URL}/auth`;

const mapBackendResponse = (backendResponse: BackendAuthResponse): AuthResponse => {
  return {
    token: backendResponse.token,
    tipo: backendResponse.tipo,
    user: {
      id: backendResponse.idUsuario,
      nombre: backendResponse.nombre,
      email: backendResponse.email,
      rol: backendResponse.rol as 'ADMIN' | 'VENDEDOR' | 'REVENDEDOR'
    }
  };
};

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      // Verificar que la respuesta es JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('El servidor no está disponible o la URL de la API es incorrecta. Verifica que el backend esté corriendo en: ' + API_URL);
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al iniciar sesión');
      }

      const result: ApiResponse<BackendAuthResponse> = await response.json();
      const authResponse = mapBackendResponse(result.data);
      
      // Guardar en localStorage
      authService.saveAuth(authResponse.token, authResponse.user);
      
      return authResponse;
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      // Verificar que la respuesta es JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('El servidor no está disponible o la URL de la API es incorrecta. Verifica que el backend esté corriendo en: ' + API_URL);
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al registrar usuario');
      }

      const result: ApiResponse<BackendAuthResponse> = await response.json();
      const authResponse = mapBackendResponse(result.data);
      
      // Guardar en localStorage
      authService.saveAuth(authResponse.token, authResponse.user);
      
      return authResponse;
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    }
  },

  updateUser: async (userId: number, data: UpdateUserData): Promise<AuthResponse> => {
    try {
      const token = authService.getToken();
      
      if (!token) {
        throw new Error('No hay sesión activa');
      }

      const response = await fetch(`${API_URL}/usuarios/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      // Verificar que la respuesta es JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('El servidor no está disponible o la URL de la API es incorrecta');
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al actualizar usuario');
      }

      const result: ApiResponse<BackendAuthResponse> = await response.json();
      const authResponse = mapBackendResponse(result.data);
      
      // Actualizar en localStorage con el nuevo token
      authService.saveAuth(authResponse.token, authResponse.user);
      
      return authResponse;
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      throw error;
    }
  },

  logout: async (): Promise<void> => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  getToken: (): string | null => {
    return localStorage.getItem('token');
  },

  saveAuth: (token: string, user: User): void => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  }
};
