import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { authenticatedRequest, ApiError } from "../config/api";
import type { ConfirmRoleResponseDto } from "../types/auth";
import type { CreateGroupResponseDto, MyGroupResponseDto } from "../types/groups";
import Layout from "../components/Layout";
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
  const [groupCode, setGroupCode] = useState<string | null>(null);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [isLoadingGroup, setIsLoadingGroup] = useState(false);

  const loadMyGroup = async () => {
    setIsLoadingGroup(true);
    try {
      const response = await authenticatedRequest<any>("/groups/my-group");
      // El backend puede devolver el grupo directamente o envuelto
      const group = response.group || response;
      if (group && group.code) {
        setGroupCode(group.code);
      }
    } catch (error) {
      console.error("Error al cargar grupo:", error);
      // Si no tiene grupo (404), no hacer nada (es normal)
    } finally {
      setIsLoadingGroup(false);
    }
  };

  useEffect(() => {
    // Verificar si hay un usuario en localStorage
    const token = localStorage.getItem("access_token");
    const userStr = localStorage.getItem("user");

    if (!token || !userStr) {
      // Si no hay token o usuario, redirigir al login
      navigate("/");
      return;
    }

    try {
      const userData = JSON.parse(userStr) as User;
      setUser(userData);
      
      // Si es profesor, cargar información del grupo
      if (userData.role === "teacher" || userData.role === "docente") {
        loadMyGroup();
      }
    } catch (error) {
      console.error("Error al parsear datos del usuario:", error);
      navigate("/");
    }
  }, [navigate]);

  const handleCreateGroup = async () => {
    if (!user) return;

    setIsCreatingGroup(true);

    try {
      console.log("Intentando crear grupo...");
      const response = await authenticatedRequest<CreateGroupResponseDto>("/groups", {
        method: "POST",
        body: JSON.stringify({}),
      });

      console.log("Grupo creado exitosamente:", response);
      
      // El backend devuelve el grupo directamente, no envuelto en un objeto "group"
      const groupCode = response.code || response.group?.code;
      
      if (!groupCode) {
        throw new Error("No se recibió el código del grupo en la respuesta");
      }
      
      setGroupCode(groupCode);
      alert(`¡Grupo creado exitosamente! Tu código de grupo es: ${groupCode}`);
    } catch (error) {
      console.error("Error al crear grupo:", error);
      console.error("Tipo de error:", error instanceof ApiError ? "ApiError" : typeof error);
      console.error("Detalles del error:", {
        message: error instanceof Error ? error.message : String(error),
        statusCode: error instanceof ApiError ? error.statusCode : undefined,
        stack: error instanceof Error ? error.stack : undefined,
      });

      if (error instanceof ApiError) {
        if (error.statusCode === 409) {
          alert("Ya tienes un grupo creado. Recargando información...");
          loadMyGroup();
        } else if (error.statusCode === 401) {
          alert("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
          handleLogout();
        } else {
          const errorMessage = error.messages?.join(", ") || error.message || "Error al crear el grupo. Por favor, intenta nuevamente.";
          alert(`Error: ${errorMessage}`);
        }
      } else if (error instanceof Error) {
        // Error de red o conexión
        if (error.message.includes("Failed to fetch") || error.message.includes("NetworkError")) {
          alert("Error de conexión. Verifica que el backend esté corriendo en http://localhost:3000 y que tu conexión a internet funcione.");
        } else if (error.message.includes("No hay token")) {
          alert("No hay token de autenticación. Por favor, inicia sesión nuevamente.");
          handleLogout();
        } else {
          alert(`Error: ${error.message}`);
        }
      } else {
        alert("Error desconocido. Por favor, intenta nuevamente.");
      }
    } finally {
      setIsCreatingGroup(false);
    }
  };

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

  const handleContinue = () => {
    if (!user) return;
    
    // Si es profesor, redirigir al panel de seguimiento
    if (user.role === "teacher" || user.role === "docente") {
      navigate("/tracking");
    } else {
      // Si es estudiante, redirigir al inicio (por ahora)
      navigate("/");
    }
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
      <Layout>
        <div className={styles.container}>
          <div className={styles.card}>
            <p style={{ textAlign: 'center', fontFamily: 'var(--font-body)', color: 'var(--color-text-secondary)' }}>Cargando...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
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

          {(user.role === "teacher" || user.role === "docente") && user.roleConfirmed && (
            <div className={styles.groupSection}>
              <h2 className={styles.groupTitle}>Gestión de Grupo</h2>
              {isLoadingGroup ? (
                <p className={styles.loadingText}>Cargando información del grupo...</p>
              ) : groupCode ? (
                <div className={styles.groupCodeDisplay}>
                  <p className={styles.groupCodeLabel}>Tu código de grupo:</p>
                  <div className={styles.groupCodeBox}>
                    <span className={styles.groupCodeValue}>{groupCode}</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(groupCode);
                        alert("Código copiado al portapapeles");
                      }}
                      className={styles.copyButton}
                      title="Copiar código"
                    >
                      📋
                    </button>
                  </div>
                  <p className={styles.groupCodeHelp}>
                    Comparte este código con tus estudiantes para que se unan a tu grupo
                  </p>
                </div>
              ) : (
                <div className={styles.createGroupSection}>
                  <p className={styles.createGroupMessage}>
                    Crea un grupo para organizar a tus estudiantes y generar un código único
                    que podrás compartir con ellos.
                  </p>
                  <button
                    onClick={handleCreateGroup}
                    className={styles.createGroupButton}
                    disabled={isCreatingGroup}
                  >
                    {isCreatingGroup ? "Creando grupo..." : "Crear Grupo"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className={styles.footer}>
          <button 
            onClick={handleContinue} 
            className={`${styles.continueButton} ${!user.roleConfirmed ? styles.continueButtonDisabled : ''}`}
            disabled={!user.roleConfirmed}
          >
            {user.roleConfirmed ? "Continuar" : "Confirmar rol primero"}
          </button>
          <button onClick={handleLogout} className={styles.logoutButton}>
            Cerrar sesión
          </button>
        </div>
        </div>
      </div>
    </Layout>
  );
}

