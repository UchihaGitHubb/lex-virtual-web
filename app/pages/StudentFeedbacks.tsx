import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { authenticatedRequest, ApiError } from "../config/api";
import type { StudentFeedbackItemDto } from "../types/tracking";
import { FeedbackType } from "../types/tracking";
import Layout from "../components/Layout";
import styles from "./StudentFeedbacks.module.css";

export default function StudentFeedbacks() {
  const navigate = useNavigate();
  const [feedbacks, setFeedbacks] = useState<StudentFeedbackItemDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadFeedbacks();
  }, []);

  const loadFeedbacks = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authenticatedRequest<StudentFeedbackItemDto[]>(
        "/tracking/my-feedbacks"
      );
      setFeedbacks(response);
    } catch (error) {
      console.error("Error al cargar retroalimentaciones:", error);

      if (error instanceof ApiError) {
        if (error.statusCode === 401) {
          navigate("/");
          return;
        } else if (error.statusCode === 403) {
          setError("No tienes permiso para acceder a esta sección. Solo estudiantes pueden ver retroalimentaciones.");
        } else {
          setError("Error al cargar las retroalimentaciones. Por favor, intenta nuevamente.");
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
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return "";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (isLoading) {
    return (
      <Layout>
        <div className={styles.container}>
          <div className={styles.card}>
            <p className={styles.loadingText}>Cargando retroalimentaciones...</p>
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
              <button onClick={loadFeedbacks} className={styles.retryButton}>
                Reintentar
              </button>
              <button onClick={() => navigate("/student-profile")} className={styles.backButton}>
                Volver al Perfil
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
            <h1 className={styles.title}>Mis Retroalimentaciones</h1>
            <p className={styles.subtitle}>
              Retroalimentaciones de tu profesor sobre tus casos
            </p>
          </div>

          {feedbacks.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>📝</div>
              <p className={styles.emptyText}>
                Aún no tienes retroalimentaciones.
              </p>
              <p className={styles.emptySubtext}>
                Las retroalimentaciones de tu profesor aparecerán aquí una vez que haya revisado tus casos.
              </p>
            </div>
          ) : (
            <div className={styles.feedbacksList}>
              {feedbacks.map((feedback) => (
                <div key={feedback.feedbackId} className={styles.feedbackCard}>
                  <div className={styles.feedbackHeader}>
                    <div className={styles.feedbackMeta}>
                      <span className={styles.caseBadge}>
                        Caso #{feedback.caseNumber}
                      </span>
                      <span className={styles.typeBadge}>
                        {feedback.type === FeedbackType.TEXT ? "✍️ Texto" : "🎤 Voz"}
                      </span>
                    </div>
                    <div className={styles.teacherInfo}>
                      <span className={styles.teacherLabel}>Profesor:</span>
                      <span className={styles.teacherName}>
                        {feedback.teacherLastName}, {feedback.teacherName}
                      </span>
                    </div>
                    <span className={styles.feedbackDate}>
                      {formatDate(feedback.createdAt)}
                    </span>
                  </div>

                  <div className={styles.feedbackContent}>
                    {feedback.type === FeedbackType.TEXT ? (
                      <div className={styles.textFeedback}>
                        <p className={styles.textContent}>{feedback.content}</p>
                      </div>
                    ) : (
                      <div className={styles.voiceFeedback}>
                        {feedback.voiceUrl ? (
                          <div className={styles.audioContainer}>
                            <audio
                              controls
                              src={feedback.voiceUrl}
                              className={styles.audioPlayer}
                            >
                              Tu navegador no soporta el elemento de audio.
                            </audio>
                            {feedback.voiceDurationSeconds && (
                              <span className={styles.audioDuration}>
                                Duración: {formatDuration(feedback.voiceDurationSeconds)}
                              </span>
                            )}
                          </div>
                        ) : (
                          <p className={styles.noAudioText}>
                            Audio no disponible
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className={styles.footer}>
            <button
              onClick={() => navigate("/student-profile")}
              className={styles.backButton}
            >
              Volver al Perfil
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

