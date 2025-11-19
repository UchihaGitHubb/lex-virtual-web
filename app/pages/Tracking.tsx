import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { authenticatedRequest, ApiError } from "../config/api";
import type { StudentListItemDto } from "../types/tracking";
import Layout from "../components/Layout";
import styles from "./Tracking.module.css";

export default function Tracking() {
  const navigate = useNavigate();
  const [students, setStudents] = useState<StudentListItemDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Llamada al endpoint de lista de estudiantes
      const response = await authenticatedRequest<StudentListItemDto[]>(
        "/tracking/students"
      );
      setStudents(response);
    } catch (error) {
      console.error("Error al cargar estudiantes:", error);
      
      if (error instanceof ApiError) {
        if (error.statusCode === 401) {
          navigate("/");
          return;
        }
        setError("Error al cargar la lista de estudiantes. Por favor, intenta nuevamente.");
      } else {
        setError("Error de conexión. Verifica tu conexión a internet.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleStudentClick = (studentId: string) => {
    const studentsList = students.map((s) => s.studentId);
    navigate(`/tracking/student/${studentId}`, {
      state: { studentsList, scrollPosition: window.scrollY },
    });
  };

  if (isLoading) {
    return (
      <Layout>
        <div className={styles.container}>
          <div className={styles.card}>
            <p className={styles.loadingText}>Cargando estudiantes...</p>
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
              <button onClick={loadStudents} className={styles.retryButton}>
                Reintentar
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
            <h1 className={styles.title}>Panel de Seguimiento</h1>
            <p className={styles.subtitle}>Lista de estudiantes y casos realizados</p>
          </div>

          {students.length === 0 ? (
            <div className={styles.emptyState}>
              <p className={styles.emptyText}>
                No hay estudiantes registrados aún.
              </p>
            </div>
          ) : (
            <div className={styles.studentsList}>
              {students.map((student) => (
                <div
                  key={student.studentId}
                  className={styles.studentCard}
                  onClick={() => handleStudentClick(student.studentId)}
                >
                  <div className={styles.studentInfo}>
                    <h3 className={styles.studentName}>
                      {student.studentLastName}, {student.studentName}
                    </h3>
                    <p className={styles.casesCount}>
                      <span className={styles.casesLabel}>Casos realizados:</span>
                      <span className={styles.casesNumber}>{student.casesCompleted}</span>
                    </p>
                    {student.lastCaseTimeSeconds !== undefined && (
                      <p className={styles.lastCaseTime}>
                        <span className={styles.timeLabel}>Último caso:</span>
                        <span className={styles.timeValue}>
                          {formatTime(student.lastCaseTimeSeconds)}
                        </span>
                      </p>
                    )}
                  </div>
                  <button className={styles.continueButton}>
                    Continuar
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className={styles.footer}>
            <button
              onClick={() => navigate("/dashboard")}
              className={styles.backButton}
            >
              Volver al Dashboard
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

