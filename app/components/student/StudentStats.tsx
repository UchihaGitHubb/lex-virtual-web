import type { StudentOverallStatsDto } from "../../types/tracking";
import { getNerviosismLabel, getStageLabel } from "../../types/tracking";
import styles from "./StudentStats.module.css";

interface StudentStatsProps {
  stats: StudentOverallStatsDto;
}

export default function StudentStats({ stats }: StudentStatsProps) {
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📚</div>
          <div className={styles.statValue}>{stats.totalCasesCompleted}</div>
          <div className={styles.statLabel}>Casos Completados</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>⏱️</div>
          <div className={styles.statValue}>
            {formatTime(stats.totalPracticeTimeSeconds)}
          </div>
          <div className={styles.statLabel}>Tiempo Total de Práctica</div>
        </div>

        {stats.averageHeartRateBpm !== undefined && (
          <div className={styles.statCard}>
            <div className={styles.statIcon}>❤️</div>
            <div className={styles.statValue}>{stats.averageHeartRateBpm}</div>
            <div className={styles.statLabel}>Frecuencia Cardíaca Promedio (BPM)</div>
          </div>
        )}

        {stats.averageNerviosismLevel !== undefined && (
          <div className={styles.statCard}>
            <div className={styles.statIcon}>😌</div>
            <div className={styles.statValue}>
              {getNerviosismLabel(stats.averageNerviosismLevel)}
            </div>
            <div className={styles.statLabel}>Nivel de Nerviosismo Promedio</div>
          </div>
        )}

        {stats.totalFillerWords !== undefined && (
          <div className={styles.statCard}>
            <div className={styles.statIcon}>💬</div>
            <div className={styles.statValue}>{stats.totalFillerWords}</div>
            <div className={styles.statLabel}>Total de Palabras de Relleno</div>
          </div>
        )}

        {stats.totalInterruptions !== undefined && (
          <div className={styles.statCard}>
            <div className={styles.statIcon}>⏸️</div>
            <div className={styles.statValue}>{stats.totalInterruptions}</div>
            <div className={styles.statLabel}>Total de Interrupciones</div>
          </div>
        )}
      </div>

      {stats.casesByStage && stats.casesByStage.length > 0 && (
        <div className={styles.stagesSection}>
          <h3 className={styles.sectionTitle}>Estadísticas por Etapa</h3>
          <div className={styles.stagesGrid}>
            {stats.casesByStage.map((stageStat, index) => (
              <div key={index} className={styles.stageCard}>
                <div className={styles.stageName}>{getStageLabel(stageStat.stage)}</div>
                <div className={styles.stageStats}>
                  <div className={styles.stageStatItem}>
                    <span className={styles.stageStatLabel}>Casos:</span>
                    <span className={styles.stageStatValue}>{stageStat.count}</span>
                  </div>
                  <div className={styles.stageStatItem}>
                    <span className={styles.stageStatLabel}>Tiempo Promedio:</span>
                    <span className={styles.stageStatValue}>
                      {formatTime(stageStat.averageTimeSeconds)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

