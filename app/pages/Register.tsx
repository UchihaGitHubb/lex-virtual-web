import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router";
import { apiRequest, ApiError } from "../config/api";
import type { RegisterDto, RegisterResponseDto } from "../types/auth";
import type { ValidateGroupCodeResponseDto } from "../types/groups";
import Layout from "../components/Layout";
import styles from "./Register.module.css";

export default function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [groupCode, setGroupCode] = useState("");
  const [validatingCode, setValidatingCode] = useState(false);
  const [codeValid, setCodeValid] = useState<boolean | null>(null);
  const [groupInfo, setGroupInfo] = useState<{ name: string; teacher: string } | null>(null);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    role?: string;
    groupCode?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  // Validación básica de formato de email
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validar código de grupo
  const validateGroupCode = async (code: string) => {
    if (!code || code.trim().length === 0) {
      setCodeValid(null);
      setGroupInfo(null);
      setErrors({ ...errors, groupCode: undefined });
      return;
    }

    // Validar formato: numérico de 6-8 caracteres
    if (!/^\d{6,8}$/.test(code)) {
      setCodeValid(false);
      setGroupInfo(null);
      setErrors({ ...errors, groupCode: "El código debe tener entre 6 y 8 dígitos numéricos" });
      return;
    }

    setValidatingCode(true);
    setErrors({ ...errors, groupCode: undefined });

    try {
      const response = await apiRequest<ValidateGroupCodeResponseDto>(
        `/groups/validate/${code}`
      );

      if (response.valid && response.group) {
        setCodeValid(true);
        setGroupInfo({
          name: response.group.name,
          teacher: response.group.teacher.email,
        });
        setErrors({ ...errors, groupCode: undefined });
      } else {
        setCodeValid(false);
        setGroupInfo(null);
        setErrors({ ...errors, groupCode: response.message || "Este código no existe" });
      }
    } catch (error) {
      setCodeValid(false);
      setGroupInfo(null);
      if (error instanceof ApiError) {
        if (error.statusCode === 404) {
          setErrors({ ...errors, groupCode: "Este código no existe" });
        } else {
          setErrors({ ...errors, groupCode: error.message || "Error al validar el código" });
        }
      } else {
        setErrors({ ...errors, groupCode: "Error de conexión. Verifica tu conexión a internet." });
      }
    } finally {
      setValidatingCode(false);
    }
  };

  // Validación del formulario
  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string; role?: string; groupCode?: string } = {};

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

    // Si es estudiante, el código de grupo es opcional pero si se ingresa debe ser válido
    if (role === "student" && groupCode && groupCode.trim().length > 0 && codeValid === false) {
      newErrors.groupCode = "El código de grupo no es válido";
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
        // Solo incluir groupCode si es estudiante y el código es válido
        ...(role === "student" && groupCode && groupCode.trim().length > 0 && codeValid === true
          ? { groupCode: groupCode.trim() }
          : {}),
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
            // Si el mensaje menciona código de grupo, asignarlo al campo correspondiente
            if (validationMessage.toLowerCase().includes("código") || validationMessage.toLowerCase().includes("code") || validationMessage.toLowerCase().includes("grupo") || validationMessage.toLowerCase().includes("group")) {
              setErrors({ 
                groupCode: validationMessage 
              });
            } else {
              setErrors({ 
                email: validationMessage 
              });
            }
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
          <h1 className={styles.title}>Crear cuenta</h1>
          <p className={styles.subtitle}>
            Completa el formulario para registrarte
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
                // Limpiar código de grupo si cambia el rol
                if (e.target.value !== "student") {
                  setGroupCode("");
                  setCodeValid(null);
                  setGroupInfo(null);
                }
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
              <option value="student">Estudiante</option>
            </select>
            {errors.role && (
              <span className={styles.errorMessage}>{errors.role}</span>
            )}
          </div>

          {role === "student" && (
            <div className={styles.formGroup}>
              <label htmlFor="groupCode" className={styles.label}>
                Código de Clase (Opcional)
              </label>
              <input
                id="groupCode"
                type="text"
                value={groupCode}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, ""); // Solo números
                  setGroupCode(value);
                  // Limpiar estado de validación al cambiar
                  if (codeValid !== null) {
                    setCodeValid(null);
                    setGroupInfo(null);
                  }
                  if (errors.groupCode) {
                    setErrors({ ...errors, groupCode: undefined });
                  }
                }}
                onBlur={(e) => {
                  // Validar código cuando el usuario sale del campo
                  if (e.target.value.trim().length > 0) {
                    validateGroupCode(e.target.value.trim());
                  }
                }}
                className={`${styles.input} ${errors.groupCode ? styles.inputError : ""} ${codeValid === true ? styles.inputValid : ""}`}
                placeholder="123456"
                disabled={isLoading || validatingCode}
                maxLength={8}
              />
              {validatingCode && (
                <span className={styles.validatingText}>Validando código...</span>
              )}
              {codeValid === true && groupInfo && (
                <div className={styles.groupInfo}>
                  <span className={styles.groupInfoText}>
                    ✓ Grupo: {groupInfo.name} - Profesor: {groupInfo.teacher}
                  </span>
                </div>
              )}
              {errors.groupCode && (
                <span className={styles.errorMessage}>{errors.groupCode}</span>
              )}
              <p className={styles.helpText}>
                Ingresa el código de 6-8 dígitos que te proporcionó tu profesor
              </p>
            </div>
          )}

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

