import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router";
import { apiRequest, ApiError } from "../config/api";
import type { RegisterDto, RegisterResponseDto } from "../types/auth";
import Layout from "../components/Layout";
import styles from "./Register.module.css";

export default function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    role?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  // Validación básica de formato de email
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validación del formulario
  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string; role?: string } = {};

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

    if (!role) {
      newErrors.role = "Debes seleccionar un rol";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Función de registro integrada con backend
  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validar formulario
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Preparar datos para enviar al backend (normalizar email a minúsculas)
      const registerData: RegisterDto = {
        email: email.toLowerCase().trim(),
        password,
        role,
      };

      // Llamada al endpoint de registro
      const response = await apiRequest<RegisterResponseDto>("/auth/register", {
        method: "POST",
        body: JSON.stringify(registerData),
      });

      console.log("Registro exitoso:", response.message);

      // Guardar token en localStorage (auto-login)
      localStorage.setItem("access_token", response.accessToken);
      
      // Guardar datos del usuario
      localStorage.setItem("user", JSON.stringify(response.user));

      // Redirigir al dashboard después del registro exitoso
      navigate("/dashboard");
    } catch (error) {
      console.error("Error en registro:", error);
      
      if (error instanceof ApiError) {
        // Manejo específico según el código de estado
        switch (error.statusCode) {
          case 409: // Conflict - Usuario ya existe
            setErrors({ 
              email: "Ya existe un usuario con este email" 
            });
            break;
          
          case 400: // Bad Request - Error de validación
            // Si hay múltiples mensajes, mostrar el primero
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
    <Layout>
      <div className={styles.container}>
        <div className={styles.registerCard}>
          <div className={styles.header}>
          <h1 className={styles.title}>Crear cuenta de Docente</h1>
          <p className={styles.subtitle}>
            Completa el formulario para registrarte como docente
          </p>
        </div>

        <form onSubmit={handleRegister} className={styles.form}>
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
              onBlur={(e) => {
                // Normalizar a minúsculas cuando el usuario sale del campo
                const normalizedEmail = e.target.value.toLowerCase().trim();
                if (normalizedEmail !== email) {
                  setEmail(normalizedEmail);
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

          <div className={styles.formGroup}>
            <label htmlFor="role" className={styles.label}>
              Rol
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                // Limpiar error al seleccionar
                if (errors.role) {
                  setErrors({ ...errors, role: undefined });
                }
              }}
              className={`${styles.select} ${errors.role ? styles.inputError : ""}`}
              disabled={isLoading}
            >
              <option value="">Selecciona un rol</option>
              <option value="teacher">Docente</option>
            </select>
            {errors.role && (
              <span className={styles.errorMessage}>{errors.role}</span>
            )}
            <p className={styles.helpText}>
              Nota: Los estudiantes se registran desde la aplicación Unity
            </p>
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>

        <div className={styles.footer}>
          <p className={styles.footerText}>
            ¿Ya tienes cuenta?{" "}
            <a href="/" className={styles.link}>
              Inicia sesión aquí
            </a>
          </p>
        </div>
        </div>
      </div>
    </Layout>
  );
}

