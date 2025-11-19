import type {
  StudentDetailsDto,
  PerformanceMetricsDto,
} from "../../types/tracking";
import { NerviosismLevel, getNerviosismLabel } from "../../types/tracking";
import styles from "./StudentDetails.module.css";

interface StudentDetailsProps {
  student: StudentDetailsDto;
  selectedCaseId: string | null;
  performanceMetrics: PerformanceMetricsDto | null;
  onCaseSelect: (caseId: string) => void;
}

export default function StudentDetails({
  student,
  selectedCaseId,
  performanceMetrics,
  onCaseSelect,
}: StudentDetailsProps) {
  const getNerviosismBadge = (level: NerviosismLevel) => {
    const levelClass =
      level === NerviosismLevel.HIGH
        ? styles.high
        : level === NerviosismLevel.MEDIUM
        ? styles.medium
        : styles.low;

    const label = getNerviosismLabel(level);

    return (
      <span className={`${styles.nerviosismBadge} ${levelClass}`}>
        {level === NerviosismLevel.HIGH && "⚠️ "}
        {label}
      </span>
    );
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Casos Realizados: {student.casesCompleted}</h2>
        {student.cases && student.cases.length > 0 ? (
          <div className={styles.casesList}>
            {student.cases.map((caseData) => (
              <button
                key={caseData.caseId}
                onClick={() => onCaseSelect(caseData.caseId)}
                className={`${styles.caseButton} ${
                  selectedCaseId === caseData.caseId ? styles.active : ""
                }`}
              >
                Caso #{caseData.caseNumber}
                <div className={styles.caseInfo}>
                  <span className={styles.caseDate}>
                    {new Date(caseData.completedAt).toLocaleDateString()}
                  </span>
                  {caseData.totalTimeSeconds !== undefined && (
                    <span className={styles.caseTime}>
                      ⏱️ {formatTime(caseData.totalTimeSeconds)}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        ) : (
          <p className={styles.emptyText}>No hay casos registrados.</p>
        )}
      </div>

      {performanceMetrics && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Métricas de Desempeño</h2>
          <div className={styles.metricsGrid}>
            <div className={styles.metricCard}>
              <div className={styles.metricIcon}>📊</div>
              <div className={styles.metricContent}>
                <h3 className={styles.metricLabel}>Tiempo Total</h3>
                <p className={styles.metricValue}>
                  {formatTime(performanceMetrics.totalTimeSeconds)}
                </p>
              </div>
            </div>

            <div className={styles.metricCard}>
              <div className={styles.metricIcon}>💬</div>
              <div className={styles.metricContent}>
                <h3 className={styles.metricLabel}>Muletillas</h3>
                <p className={styles.metricValue}>
                  {performanceMetrics.fillerWords.length}
                </p>
                {performanceMetrics.fillerWords.length > 0 && (
                  <p className={styles.metricSubtext}>
                    {performanceMetrics.fillerWords.join(", ")}
                  </p>
                )}
              </div>
            </div>

            <div className={styles.metricCard}>
              <div className={styles.metricIcon}>⏸️</div>
              <div className={styles.metricContent}>
                <h3 className={styles.metricLabel}>Interrupciones</h3>
                <p className={styles.metricValue}>
                  {performanceMetrics.interruptionsCount}
                </p>
              </div>
            </div>

            <div className={styles.metricCard}>
              <div className={styles.metricIcon}>❤️</div>
              <div className={styles.metricContent}>
                <h3 className={styles.metricLabel}>Ritmo Cardíaco</h3>
                <p className={styles.metricValue}>
                  {performanceMetrics.heartRateBpm} bpm
                </p>
              </div>
            </div>

            <div className={styles.metricCard}>
              <div className={styles.metricIcon}>😰</div>
              <div className={styles.metricContent}>
                <h3 className={styles.metricLabel}>Nivel de Nerviosismo</h3>
                <div className={styles.metricValue}>
                  {getNerviosismBadge(performanceMetrics.nerviosismLevel)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
