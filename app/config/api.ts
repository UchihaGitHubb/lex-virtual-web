// Configuración de la API
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000";

// Clase de error personalizada para errores de la API
export class ApiError extends Error {
  statusCode: number;
  error?: string;
  messages: string[];

  constructor(statusCode: number, message: string | string[], error?: string) {
    const messageText = Array.isArray(message) ? message[0] : message;
    super(messageText);
    this.statusCode = statusCode;
    this.messages = Array.isArray(message) ? message : [message];
    this.error = error;
  }
}

// Helper para hacer peticiones a la API
export async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: "Ocurrió un error en el servidor",
      statusCode: response.status,
    }));

    throw new ApiError(
      error.statusCode || response.status,
      error.message || "Error en la petición",
      error.error
    );
  }

  return response.json();
}

// Helper para hacer peticiones autenticadas a la API
export async function authenticatedRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const token = localStorage.getItem("access_token");

  if (!token) {
    throw new Error("No hay token de autenticación");
  }

  return apiRequest<T>(endpoint, {
    ...options,
    headers: {
      ...options?.headers,
      Authorization: `Bearer ${token}`,
    },
  });
}
