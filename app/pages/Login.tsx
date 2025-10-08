import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, useLocation } from "react-router";
import { apiRequest, ApiError } from "../config/api";
import type { LoginDto, LoginResponseDto } from "../types/auth";
import styles from "./Login.module.css";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const role = (location.state as { role?: string })?.role;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  // Validación básica de formato de email
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validación del formulario
  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = "El email es requerido";
    } else if (!validateEmail(email)) {
      newErrors.email = "El formato del email no es válido";
    }

    if (!password) {
      newErrors.password = "La contraseña es requerida";
    } else if (password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Función de login integrada con backend
  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validar formulario
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Preparar datos para enviar al backend
      const loginData: LoginDto = {
        email,
        password,
      };

      // Llamada al endpoint de login
      const response = await apiRequest<LoginResponseDto>("/auth/login", {
        method: "POST",
        body: JSON.stringify(loginData),
      });

      // Guardar token en localStorage
      localStorage.setItem("access_token", response.accessToken);
      
      // Guardar datos del usuario
      localStorage.setItem("user", JSON.stringify(response.user));

      console.log("Login exitoso:", response.message);
      console.log("Usuario:", response.user);

      // Redirigir al dashboard después del login exitoso
      navigate("/dashboard");
    } catch (error) {
      console.error("Error en login:", error);
      
      if (error instanceof ApiError) {
        // Manejo específico según el código de estado
        switch (error.statusCode) {
          case 401: // Unauthorized - Credenciales inválidas
            setErrors({ 
              email: "Credenciales inválidas. Verifica tu email y contraseña." 
            });
            break;
          
          case 400: // Bad Request - Error de validación
            const validationMessage = error.messages.join(", ");
            setErrors({ 
              email: validationMessage 
            });
            break;
          
          case 500: // Internal Server Error
            setErrors({ 
              email: "Error interno del servidor. Por favor, intenta más tarde." 
            });
            break;
          
          default:
            setErrors({ 
              email: error.message || "Ocurrió un error. Por favor, intenta nuevamente." 
            });
        }
      } else {
        // Error de red u otro tipo de error
        setErrors({ 
          email: "Error de conexión. Verifica tu conexión a internet." 
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginCard}>
        <div className={styles.header}>
          <h1 className={styles.title}>Iniciar sesión</h1>
          <p className={styles.subtitle}>
            {role 
              ? `Ingresa tus credenciales de ${role} para continuar`
              : "Ingresa tus credenciales para continuar"}
          </p>
        </div>

        <form onSubmit={handleLogin} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                // Limpiar error al escribir
                if (errors.email) {
                  setErrors({ ...errors, email: undefined });
                }
              }}
              className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
              placeholder="tu@email.com"
              disabled={isLoading}
            />
            {errors.email && (
              <span className={styles.errorMessage}>{errors.email}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                // Limpiar error al escribir
                if (errors.password) {
                  setErrors({ ...errors, password: undefined });
                }
              }}
              className={`${styles.input} ${errors.password ? styles.inputError : ""}`}
              placeholder="••••••••"
              disabled={isLoading}
            />
            {errors.password && (
              <span className={styles.errorMessage}>{errors.password}</span>
            )}
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
          </button>
        </form>

        <div className={styles.footer}>
          {role && (
            <p className={styles.footerText}>
              <a href="/" className={styles.link}>
                ← Cambiar rol
              </a>
            </p>
          )}
          <p className={styles.footerText}>
            ¿No tienes cuenta?{" "}
            <a href="/register" className={styles.link}>
              Regístrate aquí
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

