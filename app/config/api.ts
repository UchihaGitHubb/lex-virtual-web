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

  try {
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

      // Extraer mensajes de validación si están disponibles
      const errorMessages = error.message 
        ? (Array.isArray(error.message) ? error.message : [error.message])
        : error.messages || ["Error en la petición"];

      throw new ApiError(
        error.statusCode || response.status,
        errorMessages,
        error.error
      );
    }

    return response.json();
  } catch (error) {
    // Si es un ApiError, re-lanzarlo
    if (error instanceof ApiError) {
      throw error;
    }
    // Si es un error de red, lanzar un Error con mensaje descriptivo
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error(`Error de conexión: No se pudo conectar al servidor en ${url}. Verifica que el backend esté corriendo.`);
    }
    // Cualquier otro error, re-lanzarlo
    throw error;
  }
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

// Helper para subir archivos (audio, imágenes, etc.)
export async function uploadFile(
  file: Blob,
  fileName: string,
  endpoint: string = "/upload/audio"
): Promise<{ url: string }> {
  const token = localStorage.getItem("access_token");

  if (!token) {
    throw new Error("No hay token de autenticación");
  }

  const formData = new FormData();
  formData.append("file", file, fileName);

  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: "Error al subir el archivo",
      statusCode: response.status,
    }));

    // Extraer mensajes de validación si están disponibles
    const errorMessages = error.message 
      ? (Array.isArray(error.message) ? error.message : [error.message])
      : error.messages || ["Error al subir el archivo"];

    throw new ApiError(
      error.statusCode || response.status,
      errorMessages,
      error.error
    );
  }

  return response.json();
}