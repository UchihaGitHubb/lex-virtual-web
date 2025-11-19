// Tipos para el panel de seguimiento de profesores

export interface StudentListItemDto {
  studentId: string;
  studentName: string;
  studentLastName: string;
  casesCompleted: number;
  lastCaseNumber: number;
  lastCaseTimeSeconds?: number; // Tiempo del último caso completado (HU_6.2.1)
}

export interface StudentDetailsDto {
  studentId: string;
  studentName: string;
  studentLastName: string;
  casesCompleted: number;
  cases?: CaseSummaryDto[]; // Lista de casos del estudiante
}

export interface CaseSummaryDto {
  caseId: string;
  caseNumber: number;
  completedAt: string;
  status: string;
  totalTimeSeconds?: number; // Tiempo de completación del caso (HU_6.2.1)
}

export interface PerformanceMetricsDto {
  caseId: string;
  caseNumber: number;
  fillerWords: string[];
  interruptionsCount: number;
  totalTimeSeconds: number;
  heartRateBpm: number;
  nerviosismLevel: NerviosismLevel;
}

export enum NerviosismLevel {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}

export interface NerviosismChartDto {
  caseId: string;
  caseNumber: number;
  stages: NerviosismStageDataDto[];
  totalTimeSeconds?: number; // Tiempo total del caso para referencia (HU_6.2.2)
}

export interface NerviosismStageDataDto {
  stage: TrialStage;
  stageName?: string; // Nombre de la etapa en español (HU_6.2.2)
  bpmValue: number | null; // Puede ser null (HU_6.2.2)
  levelLabel: NerviosismLevel;
  timestampSeconds: number;
}

export enum TrialStage {
  INTRODUCTION = "introduction",
  TESTIMONY = "testimony",
  OBJECTION = "objection",
  FINAL_ARGUMENT = "final_argument",
}

export interface CreateTextFeedbackDto {
  caseId: string;
  content: string; // mínimo 300 caracteres
}

export interface CreateVoiceFeedbackDto {
  caseId: string;
  voiceUrl: string; // URL del archivo de audio
  voiceDurationSeconds: number; // entre 1 y 60 segundos
}

export interface FeedbackResponseDto {
  feedbackId: string;
  caseId: string;
  teacherId: string;
  type: FeedbackType;
  content: string | null;
  voiceUrl: string | null;
  voiceDurationSeconds: number | null;
  createdAt: string;
}

// Retroalimentaciones para estudiantes (incluye información del caso y profesor)
export interface StudentFeedbackItemDto {
  feedbackId: string;
  caseId: string;
  caseNumber: number;
  teacherId: string;
  teacherName: string;
  teacherLastName: string;
  type: FeedbackType;
  content: string | null;
  voiceUrl: string | null;
  voiceDurationSeconds: number | null;
  createdAt: string;
}

export enum FeedbackType {
  TEXT = "text",
  VOICE = "voice",
}

// Helper para convertir niveles de nerviosismo a español
export function getNerviosismLabel(level: NerviosismLevel): string {
  switch (level) {
    case NerviosismLevel.LOW:
      return "Bajo";
    case NerviosismLevel.MEDIUM:
      return "Medio";
    case NerviosismLevel.HIGH:
      return "Alto";
    default:
      return level;
  }
}

// Helper para convertir etapas a español
export function getStageLabel(stage: TrialStage): string {
  switch (stage) {
    case TrialStage.INTRODUCTION:
      return "Introducción";
    case TrialStage.TESTIMONY:
      return "Testimonio";
    case TrialStage.OBJECTION:
      return "Objeción";
    case TrialStage.FINAL_ARGUMENT:
      return "Alegato final";
    default:
      return stage;
  }
}

// Tipos para el panel del estudiante
export interface StudentProfileDto {
  studentId: string;
  email: string;
  name: string;
  lastName: string;
  createdAt: string;
  totalCasesCompleted: number;
  averageScore?: number;
  totalPracticeTimeSeconds?: number;
}

export interface StudentCaseProgressDto {
  caseId: string;
  caseNumber: number;
  completedAt: string;
  status: "completed" | "in_progress" | "not_started";
  totalTimeSeconds: number;
  performanceMetrics?: PerformanceMetricsDto;
  nerviosismChart?: NerviosismChartDto;
  feedbacks?: FeedbackResponseDto[];
}

export interface StudentOverallStatsDto {
  totalCasesCompleted: number;
  totalPracticeTimeSeconds: number;
  averageHeartRateBpm?: number;
  averageNerviosismLevel?: NerviosismLevel;
  totalFillerWords?: number;
  totalInterruptions?: number;
  casesByStage?: {
    stage: TrialStage;
    count: number;
    averageTimeSeconds: number;
  }[];
}
