import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { authenticatedRequest, ApiError } from "../config/api";
import type { ConfirmRoleResponseDto } from "../types/auth";
import styles from "./Dashboard.module.css";

interface User {
  id: string;
  email: string;
  role: string | null;
  roleConfirmed: boolean;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  useEffect(() => {
    // Verificar si hay un usuario en localStorage
    const token = localStorage.getItem("access_token");
    const userStr = localStorage.getItem("user");

    if (!token || !userStr) {
      // Si no hay token o usuario, redirigir al home
      navigate("/");
      return;
    }

    try {
      const userData = JSON.parse(userStr) as User;
      setUser(userData);
    } catch (error) {
      console.error("Error al parsear datos del usuario:", error);
      navigate("/");
    }
  }, [navigate]);

  const handleConfirmRole = async () => {
    if (!user) return;

    setIsConfirming(true);

    try {
      // Simulación temporal para dar efecto de espera
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Llamada al endpoint de confirmación de rol
      const response = await authenticatedRequest<ConfirmRoleResponseDto>(
        "/users/role/confirm",
        {
          method: "PUT",
        }
      );

      console.log("Rol confirmado:", response.message);

      // Actualizar el usuario con los datos de la respuesta
      const updatedUser = {
        id: response.user.id,
        email: response.user.email,
        role: response.user.role,
        roleConfirmed: response.user.roleConfirmed,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);

      alert("¡Rol confirmado exitosamente!");
    } catch (error) {
      console.error("Error al confirmar rol:", error);

      if (error instanceof ApiError) {
        // Manejo específico según el código de estado
        switch (error.statusCode) {
          case 404: // NotFoundException
            alert("Usuario no encontrado. Por favor, inicia sesión nuevamente.");
            handleLogout();
            break;

          case 400: // BadRequestException
            const validationMessage = error.messages.join(", ");
            alert(`Error: ${validationMessage}`);
            break;

          case 409: // ConflictException
            alert("El rol ya está confirmado o hay un conflicto con la solicitud.");
            // Recargar datos del usuario
            const userStr = localStorage.getItem("user");
            if (userStr) {
              const userData = JSON.parse(userStr) as User;
              setUser(userData);
            }
            break;

          case 401: // Unauthorized
            alert("Sesión expirada. Por favor, inicia sesión nuevamente.");
            handleLogout();
            break;

          default:
            alert(
              error.message || "Error al confirmar el rol. Por favor, intenta nuevamente."
            );
        }
      } else {
        alert("Error de conexión. Verifica tu conexión a internet.");
      }
    } finally {
      setIsConfirming(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const getRoleLabel = (role: string | null) => {
    if (!role) return "Sin rol asignado";
    
    const roleLabels: { [key: string]: string } = {
      student: "Estudiante",
      teacher: "Docente",
      estudiante: "Estudiante",
      docente: "Docente",
    };

    return roleLabels[role] || role;
  };

  if (!user) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Dashboard</h1>
          <p className={styles.subtitle}>Bienvenido a tu panel de control</p>
        </div>

        <div className={styles.content}>
          <div className={styles.userInfo}>
            <h2 className={styles.infoTitle}>Información del Usuario</h2>
            
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Email:</span>
              <span className={styles.infoValue}>{user.email}</span>
            </div>

            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Rol:</span>
              <span className={styles.infoValue}>{getRoleLabel(user.role)}</span>
            </div>

            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>ID:</span>
              <span className={styles.infoValue}>{user.id}</span>
            </div>
          </div>

          <div className={styles.roleStatus}>
            {user.roleConfirmed ? (
              <div className={styles.confirmedBadge}>
                <svg
                  className={styles.checkIcon}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className={styles.confirmedText}>Rol confirmado</span>
              </div>
            ) : (
              <div className={styles.confirmSection}>
                <p className={styles.confirmMessage}>
                  Tu rol aún no ha sido confirmado. Por favor, confirma tu rol para
                  continuar.
                </p>
                <button
                  onClick={handleConfirmRole}
                  className={styles.confirmButton}
                  disabled={isConfirming}
                >
                  {isConfirming ? "Confirmando..." : "Confirmar Rol"}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className={styles.footer}>
          <button onClick={handleLogout} className={styles.logoutButton}>
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
}

