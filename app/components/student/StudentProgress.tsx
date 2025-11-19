import { useState } from "react";
import type { StudentCaseProgressDto } from "../../types/tracking";
import { getNerviosismLabel } from "../../types/tracking";
import styles from "./StudentProgress.module.css";

interface StudentProgressProps {
  cases: StudentCaseProgressDto[];
  onRefresh: () => void;
}

export default function StudentProgress({ cases, onRefresh }: StudentProgressProps) {
  const [selectedCase, setSelectedCase] = useState<StudentCaseProgressDto | null>(null);

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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return "Completado";
      case "in_progress":
        return "En progreso";
      case "not_started":
        return "No iniciado";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "var(--color-success)";
      case "in_progress":
        return "var(--color-accent-gold)";
      case "not_started":
        return "var(--color-text-secondary)";
      default:
        return "var(--color-text-secondary)";
    }
  };

  if (cases.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>📚</div>
        <p className={styles.emptyText}>Aún no has completado ningún caso.</p>
        <p className={styles.emptySubtext}>
          Los casos que completes en la aplicación Unity aparecerán aquí.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.casesList}>
        {cases.map((caseItem) => (
          <div
            key={caseItem.caseId}
            className={`${styles.caseCard} ${selectedCase?.caseId === caseItem.caseId ? styles.selected : ""}`}
            onClick={() => setSelectedCase(caseItem)}
          >
            <div className={styles.caseHeader}>
              <div className={styles.caseNumber}>Caso #{caseItem.caseNumber}</div>
              <span
                className={styles.statusBadge}
                style={{ backgroundColor: getStatusColor(caseItem.status) }}
              >
                {getStatusLabel(caseItem.status)}
              </span>
            </div>
            <div className={styles.caseInfo}>
              <div className={styles.caseInfoRow}>
                <span className={styles.caseInfoLabel}>Completado:</span>
                <span className={styles.caseInfoValue}>
                  {formatDate(caseItem.completedAt)}
                </span>
              </div>
              <div className={styles.caseInfoRow}>
                <span className={styles.caseInfoLabel}>Tiempo:</span>
                <span className={styles.caseInfoValue}>
                  {formatTime(caseItem.totalTimeSeconds)}
                </span>
              </div>
              {caseItem.performanceMetrics && (
                <div className={styles.caseInfoRow}>
                  <span className={styles.caseInfoLabel}>Nerviosismo:</span>
                  <span className={styles.caseInfoValue}>
                    {getNerviosismLabel(caseItem.performanceMetrics.nerviosismLevel)}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedCase && (
        <div className={styles.detailsPanel}>
          <div className={styles.detailsHeader}>
            <h3 className={styles.detailsTitle}>Detalles del Caso #{selectedCase.caseNumber}</h3>
            <button
              className={styles.closeButton}
              onClick={() => setSelectedCase(null)}
            >
              ✕
            </button>
          </div>

          <div className={styles.detailsContent}>
            {selectedCase.performanceMetrics && (
              <div className={styles.metricsSection}>
                <h4 className={styles.metricsTitle}>Métricas de Rendimiento</h4>
                <div className={styles.metricsGrid}>
                  <div className={styles.metricItem}>
                    <span className={styles.metricLabel}>Frecuencia Cardíaca:</span>
                    <span className={styles.metricValue}>
                      {selectedCase.performanceMetrics.heartRateBpm} BPM
                    </span>
                  </div>
                  <div className={styles.metricItem}>
                    <span className={styles.metricLabel}>Nivel de Nerviosismo:</span>
                    <span className={styles.metricValue}>
                      {getNerviosismLabel(selectedCase.performanceMetrics.nerviosismLevel)}
                    </span>
                  </div>
                  <div className={styles.metricItem}>
                    <span className={styles.metricLabel}>Palabras de Relleno:</span>
                    <span className={styles.metricValue}>
                      {selectedCase.performanceMetrics.fillerWords.length}
                    </span>
                  </div>
                  <div className={styles.metricItem}>
                    <span className={styles.metricLabel}>Interrupciones:</span>
                    <span className={styles.metricValue}>
                      {selectedCase.performanceMetrics.interruptionsCount}
                    </span>
                  </div>
                </div>
                {selectedCase.performanceMetrics.fillerWords.length > 0 && (
                  <div className={styles.fillerWordsSection}>
                    <span className={styles.fillerWordsLabel}>Palabras de relleno detectadas:</span>
                    <div className={styles.fillerWordsList}>
                      {selectedCase.performanceMetrics.fillerWords.map((word, index) => (
                        <span key={index} className={styles.fillerWord}>
                          {word}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {selectedCase.feedbacks && selectedCase.feedbacks.length > 0 && (
              <div className={styles.feedbacksSection}>
                <h4 className={styles.feedbacksTitle}>Retroalimentaciones</h4>
                {selectedCase.feedbacks.map((feedback) => (
                  <div key={feedback.feedbackId} className={styles.feedbackItem}>
                    <div className={styles.feedbackHeader}>
                      <span className={styles.feedbackType}>
                        {feedback.type === "text" ? "✍️ Texto" : "🎤 Voz"}
                      </span>
                      <span className={styles.feedbackDate}>
                        {formatDate(feedback.createdAt)}
                      </span>
                    </div>
                    {feedback.content && (
                      <p className={styles.feedbackContent}>{feedback.content}</p>
                    )}
                    {feedback.voiceUrl && (
                      <audio controls src={feedback.voiceUrl} className={styles.audioPlayer}>
                        Tu navegador no soporta el elemento de audio.
                      </audio>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

