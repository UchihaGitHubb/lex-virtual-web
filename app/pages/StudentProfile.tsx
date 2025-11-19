import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { authenticatedRequest, ApiError } from "../config/api";
import type {
  StudentProfileDto,
  StudentCaseProgressDto,
  StudentOverallStatsDto,
} from "../types/tracking";
import Layout from "../components/Layout";
import StudentProgress from "../components/student/StudentProgress";
import StudentStats from "../components/student/StudentStats";
import styles from "./StudentProfile.module.css";

type TabType = "profile" | "progress" | "stats" | "feedbacks";

export default function StudentProfile() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const [profile, setProfile] = useState<StudentProfileDto | null>(null);
  const [cases, setCases] = useState<StudentCaseProgressDto[]>([]);
  const [stats, setStats] = useState<StudentOverallStatsDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStudentData();
  }, []);

  const loadStudentData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Cargar perfil del estudiante
      const profileData = await authenticatedRequest<StudentProfileDto>(
        "/students/my-profile"
      );
      setProfile(profileData);

      // Cargar casos del estudiante
      const casesData = await authenticatedRequest<StudentCaseProgressDto[]>(
        "/students/my-cases"
      );
      setCases(casesData);

      // Cargar estadísticas generales
      const statsData = await authenticatedRequest<StudentOverallStatsDto>(
        "/students/my-stats"
      );
      setStats(statsData);
    } catch (error) {
      console.error("Error al cargar datos del estudiante:", error);

      if (error instanceof ApiError) {
        if (error.statusCode === 401) {
          navigate("/");
          return;
        } else if (error.statusCode === 403) {
          setError("No tienes permiso para acceder a esta sección. Solo estudiantes pueden ver su perfil.");
        } else {
          setError("Error al cargar los datos. Por favor, intenta nuevamente.");
        }
      } else {
        setError("Error de conexión. Verifica tu conexión a internet.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  if (isLoading) {
    return (
      <Layout>
        <div className={styles.container}>
          <div className={styles.card}>
            <p className={styles.loadingText}>Cargando perfil...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className={styles.container}>
          <div className={styles.card}>
            <div className={styles.errorContainer}>
              <p className={styles.errorText}>{error}</p>
              <button onClick={loadStudentData} className={styles.retryButton}>
                Reintentar
              </button>
              <button onClick={() => navigate("/dashboard")} className={styles.backButton}>
                Volver al Dashboard
              </button>
            </div>
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
            <h1 className={styles.title}>Mi Perfil</h1>
            <p className={styles.subtitle}>
              Gestiona tu información y revisa tu progreso
            </p>
          </div>

          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${activeTab === "profile" ? styles.active : ""}`}
              onClick={() => setActiveTab("profile")}
            >
              <span className={styles.tabIcon}>👤</span>
              <span className={styles.tabText}>Perfil</span>
            </button>
            <button
              className={`${styles.tab} ${activeTab === "progress" ? styles.active : ""}`}
              onClick={() => setActiveTab("progress")}
            >
              <span className={styles.tabIcon}>📊</span>
              <span className={styles.tabText}>Progreso</span>
            </button>
            <button
              className={`${styles.tab} ${activeTab === "stats" ? styles.active : ""}`}
              onClick={() => setActiveTab("stats")}
            >
              <span className={styles.tabIcon}>📈</span>
              <span className={styles.tabText}>Estadísticas</span>
            </button>
            <button
              className={`${styles.tab} ${activeTab === "feedbacks" ? styles.active : ""}`}
              onClick={() => {
                setActiveTab("feedbacks");
                navigate("/my-feedbacks");
              }}
            >
              <span className={styles.tabIcon}>📝</span>
              <span className={styles.tabText}>Retroalimentaciones</span>
            </button>
          </div>

          <div className={styles.content}>
            {activeTab === "profile" && profile && (
              <div className={styles.profileSection}>
                <div className={styles.profileCard}>
                  <h2 className={styles.sectionTitle}>Información Personal</h2>
                  <div className={styles.profileInfo}>
                    <div className={styles.infoRow}>
                      <span className={styles.infoLabel}>Nombre:</span>
                      <span className={styles.infoValue}>
                        {profile.name} {profile.lastName}
                      </span>
                    </div>
                    <div className={styles.infoRow}>
                      <span className={styles.infoLabel}>Email:</span>
                      <span className={styles.infoValue}>{profile.email}</span>
                    </div>
                    <div className={styles.infoRow}>
                      <span className={styles.infoLabel}>Fecha de registro:</span>
                      <span className={styles.infoValue}>{formatDate(profile.createdAt)}</span>
                    </div>
                  </div>
                </div>

                <div className={styles.profileCard}>
                  <h2 className={styles.sectionTitle}>Resumen de Actividad</h2>
                  <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                      <div className={styles.statIcon}>📚</div>
                      <div className={styles.statValue}>{profile.totalCasesCompleted}</div>
                      <div className={styles.statLabel}>Casos Completados</div>
                    </div>
                    {profile.totalPracticeTimeSeconds !== undefined && (
                      <div className={styles.statCard}>
                        <div className={styles.statIcon}>⏱️</div>
                        <div className={styles.statValue}>
                          {formatTime(profile.totalPracticeTimeSeconds)}
                        </div>
                        <div className={styles.statLabel}>Tiempo de Práctica</div>
                      </div>
                    )}
                    {profile.averageScore !== undefined && (
                      <div className={styles.statCard}>
                        <div className={styles.statIcon}>⭐</div>
                        <div className={styles.statValue}>{profile.averageScore.toFixed(1)}</div>
                        <div className={styles.statLabel}>Puntuación Promedio</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "progress" && (
              <StudentProgress cases={cases} onRefresh={loadStudentData} />
            )}

            {activeTab === "stats" && stats && (
              <StudentStats stats={stats} />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

