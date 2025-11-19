import type { NerviosismChartDto } from "../../types/tracking";
import { NerviosismLevel, TrialStage, getNerviosismLabel, getStageLabel } from "../../types/tracking";
import styles from "./NerviosismChart.module.css";

interface NerviosismChartProps {
  chartData: NerviosismChartDto;
  caseNumber: number;
}

export default function NerviosismChart({ chartData, caseNumber }: NerviosismChartProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getLevelValue = (level: NerviosismLevel): number => {
    switch (level) {
      case NerviosismLevel.LOW:
        return 1;
      case NerviosismLevel.MEDIUM:
        return 2;
      case NerviosismLevel.HIGH:
        return 3;
      default:
        return 1;
    }
  };

  const getLevelColor = (level: NerviosismLevel): string => {
    switch (level) {
      case NerviosismLevel.LOW:
        return "#48bb78";
      case NerviosismLevel.MEDIUM:
        return "#d69e2e";
      case NerviosismLevel.HIGH:
        return "#e53e3e";
      default:
        return "#48bb78";
    }
  };

  const maxTime = Math.max(...chartData.stages.map((s) => s.timestampSeconds), 1);
  const maxLevel = 3;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Gráfico de Nerviosismo</h2>
        <p className={styles.subtitle}>
          Caso #{caseNumber}
          {chartData.totalTimeSeconds !== undefined && (
            <span className={styles.totalTime}>
              {" "}• Tiempo total: {formatTime(chartData.totalTimeSeconds)}
            </span>
          )}
        </p>
      </div>

      <div className={styles.chartContainer}>
        <div className={styles.chart}>
          <div className={styles.yAxis}>
            <div className={styles.yLabel}>Alto</div>
            <div className={styles.yLabel}>Medio</div>
            <div className={styles.yLabel}>Bajo</div>
          </div>

          <div className={styles.chartArea}>
            <svg viewBox="0 0 100 100" className={styles.svgChart}>
              {/* Líneas de referencia */}
              <line x1="0" y1="33" x2="100" y2="33" className={styles.gridLine} />
              <line x1="0" y1="66" x2="100" y2="66" className={styles.gridLine} />

              {/* Línea de nerviosismo */}
              <polyline
                points={chartData.stages
                  .map(
                    (stage, index) =>
                      `${(stage.timestampSeconds / maxTime) * 100},${
                        100 - (getLevelValue(stage.levelLabel) / maxLevel) * 100
                      }`
                  )
                  .join(" ")}
                fill="none"
                stroke={getLevelColor(chartData.stages[chartData.stages.length - 1]?.levelLabel || NerviosismLevel.LOW)}
                strokeWidth="2"
                className={styles.chartLine}
              />

              {/* Puntos de datos */}
              {chartData.stages.map((stage, index) => (
                <circle
                  key={index}
                  cx={(stage.timestampSeconds / maxTime) * 100}
                  cy={100 - (getLevelValue(stage.levelLabel) / maxLevel) * 100}
                  r="2"
                  fill={getLevelColor(stage.levelLabel)}
                  className={styles.dataPoint}
                />
              ))}
            </svg>

            {/* Etiquetas de etapas */}
            <div className={styles.stagesLabels}>
              {chartData.stages.map((stage, index) => (
                <div
                  key={index}
                  className={styles.stageLabel}
                  style={{
                    left: `${(stage.timestampSeconds / maxTime) * 100}%`,
                  }}
                >
                  <span className={styles.stageName}>
                    {stage.stageName || getStageLabel(stage.stage)}
                  </span>
                  <span className={styles.stageLevel}>{getNerviosismLabel(stage.levelLabel)}</span>
                  {stage.bpmValue !== null && (
                    <span className={styles.stageBpm}>{stage.bpmValue} bpm</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Leyenda */}
        <div className={styles.legend}>
          <div className={styles.legendItem}>
            <div className={`${styles.legendColor} ${styles.low}`}></div>
            <span>Bajo</span>
          </div>
          <div className={styles.legendItem}>
            <div className={`${styles.legendColor} ${styles.medium}`}></div>
            <span>Medio</span>
          </div>
          <div className={styles.legendItem}>
            <div className={`${styles.legendColor} ${styles.high}`}></div>
            <span>Alto</span>
          </div>
        </div>
      </div>
    </div>
  );
}

