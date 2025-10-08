// Tipos para autenticación

export interface LoginDto {
  email: string;
  password: string;
}

export interface LoginResponseDto {
  message: string;
  accessToken: string;
  user: {
    id: string;
    email: string;
    role: string | null;
    roleConfirmed: boolean;
  };
}

export interface RegisterDto {
  email: string;
  password: string;
  role: string; // El backend espera "role" no "rol"
}

// El registro exitoso devuelve la misma respuesta que login
export type RegisterResponseDto = LoginResponseDto;

// Tipos para errores del backend
export interface ApiErrorResponse {
  message: string | string[];
  error?: string;
  statusCode: number;
}

// Respuesta de confirmación de rol
export interface ConfirmRoleResponseDto {
  message: string;
  user: {
    id: string;
    createdAt: string;
    updatedAt: string;
    deleteAt: string | null;
    email: string;
    passwordHash: string;
    role: string;
    roleConfirmed: boolean;
    isActive: boolean;
  };
}

