// Datos de ejemplo para visualizar el sistema
import type {
  StudentListItemDto,
  StudentDetailsDto,
  PerformanceMetricsDto,
  NerviosismChartDto,
  FeedbackResponseDto,
  StudentProfileDto,
  StudentCaseProgressDto,
  StudentOverallStatsDto,
  StudentFeedbackItemDto,
} from "../types/tracking";
import {
  NerviosismLevel,
  TrialStage,
  FeedbackType,
} from "../types/tracking";

// Lista de estudiantes de ejemplo
export const mockStudents: StudentListItemDto[] = [
  {
    studentId: "student-001",
    studentName: "María",
    studentLastName: "González",
    casesCompleted: 3,
    lastCaseNumber: 3,
    lastCaseTimeSeconds: 1245, // 20:45
  },
  {
    studentId: "student-002",
    studentName: "Juan",
    studentLastName: "Pérez",
    casesCompleted: 5,
    lastCaseNumber: 5,
    lastCaseTimeSeconds: 980, // 16:20
  },
  {
    studentId: "student-003",
    studentName: "Ana",
    studentLastName: "Martínez",
    casesCompleted: 2,
    lastCaseNumber: 2,
    lastCaseTimeSeconds: 1520, // 25:20
  },
  {
    studentId: "student-004",
    studentName: "Carlos",
    studentLastName: "Rodríguez",
    casesCompleted: 4,
    lastCaseNumber: 4,
    lastCaseTimeSeconds: 1100, // 18:20
  },
];

// Detalles de un estudiante de ejemplo
export const mockStudentDetails: StudentDetailsDto = {
  studentId: "student-001",
  studentName: "María",
  studentLastName: "González",
  casesCompleted: 3,
  cases: [
    {
      caseId: "case-001",
      caseNumber: 1,
      completedAt: "2024-01-15T10:30:00.000Z",
      status: "completed",
      totalTimeSeconds: 1200, // 20:00
    },
    {
      caseId: "case-002",
      caseNumber: 2,
      completedAt: "2024-01-20T14:15:00.000Z",
      status: "completed",
      totalTimeSeconds: 1350, // 22:30
    },
    {
      caseId: "case-003",
      caseNumber: 3,
      completedAt: "2024-01-25T09:45:00.000Z",
      status: "completed",
      totalTimeSeconds: 1245, // 20:45
    },
  ],
};

// Métricas de desempeño de ejemplo (Caso 3)
export const mockPerformanceMetrics: PerformanceMetricsDto = {
  caseId: "case-003",
  caseNumber: 3,
  fillerWords: ["eh", "um", "este", "bueno", "entonces"],
  interruptionsCount: 3,
  totalTimeSeconds: 1245,
  heartRateBpm: 85,
  nerviosismLevel: NerviosismLevel.MEDIUM,
};

// Gráfico de nerviosismo de ejemplo (Caso 3)
export const mockNerviosismChart: NerviosismChartDto = {
  caseId: "case-003",
  caseNumber: 3,
  totalTimeSeconds: 1245,
  stages: [
    {
      stage: TrialStage.INTRODUCTION,
      stageName: "Introducción",
      bpmValue: 75,
      levelLabel: NerviosismLevel.LOW,
      timestampSeconds: 0,
    },
    {
      stage: TrialStage.TESTIMONY,
      stageName: "Testimonio",
      bpmValue: 85,
      levelLabel: NerviosismLevel.MEDIUM,
      timestampSeconds: 300,
    },
    {
      stage: TrialStage.OBJECTION,
      stageName: "Objeción",
      bpmValue: 95,
      levelLabel: NerviosismLevel.HIGH,
      timestampSeconds: 600,
    },
    {
      stage: TrialStage.FINAL_ARGUMENT,
      stageName: "Alegato final",
      bpmValue: 88,
      levelLabel: NerviosismLevel.MEDIUM,
      timestampSeconds: 900,
    },
  ],
};

// Feedback de ejemplo
export const mockFeedback: FeedbackResponseDto[] = [
  {
    feedbackId: "feedback-001",
    caseId: "case-003",
    teacherId: "teacher-001",
    type: FeedbackType.TEXT,
    content:
      "María mostró un buen dominio del caso durante la introducción y el testimonio. Sin embargo, durante la fase de objeción, se notó un aumento significativo en el nerviosismo, lo cual es normal pero debe trabajar en mantener la calma. El tiempo de intervención fue adecuado y las muletillas fueron mínimas. Recomiendo practicar más con situaciones de presión para mejorar el control emocional durante las objeciones.",
    voiceUrl: null,
    voiceDurationSeconds: null,
    createdAt: "2024-01-25T10:00:00.000Z",
  },
  {
    feedbackId: "feedback-002",
    caseId: "case-002",
    teacherId: "teacher-001",
    type: FeedbackType.VOICE,
    content: null,
    voiceUrl: "https://example.com/audio/feedback-002.mp3",
    voiceDurationSeconds: 45,
    createdAt: "2024-01-20T15:00:00.000Z",
  },
];

// Función para obtener detalles de un estudiante por ID
export function getMockStudentDetails(studentId: string): StudentDetailsDto | null {
  const student = mockStudents.find((s) => s.studentId === studentId);
  if (!student) return null;

  // Generar casos basados en el número de casos completados
  const cases = Array.from({ length: student.casesCompleted }, (_, i) => ({
    caseId: `case-${studentId}-${i + 1}`,
    caseNumber: i + 1,
    completedAt: new Date(2024, 0, 15 + i * 5, 10 + i, 30).toISOString(),
    status: "completed",
    totalTimeSeconds: 1000 + Math.floor(Math.random() * 600), // Entre 16:40 y 26:40
  }));

  return {
    ...student,
    cases,
  };
}

// Función para obtener métricas de un caso
export function getMockPerformanceMetrics(caseId: string): PerformanceMetricsDto | null {
  // Simular diferentes métricas según el caso
  const caseNumber = parseInt(caseId.split("-").pop() || "1");
  
  return {
    caseId,
    caseNumber,
    fillerWords: ["eh", "um", "este", "bueno", "entonces"].slice(0, 3 + Math.floor(Math.random() * 3)),
    interruptionsCount: Math.floor(Math.random() * 5) + 1,
    totalTimeSeconds: 1000 + Math.floor(Math.random() * 600),
    heartRateBpm: 70 + Math.floor(Math.random() * 30),
    nerviosismLevel: [NerviosismLevel.LOW, NerviosismLevel.MEDIUM, NerviosismLevel.HIGH][
      Math.floor(Math.random() * 3)
    ] as NerviosismLevel,
  };
}

// Función para obtener gráfico de nerviosismo
export function getMockNerviosismChart(caseId: string): NerviosismChartDto | null {
  const caseNumber = parseInt(caseId.split("-").pop() || "1");
  const totalTime = 1000 + Math.floor(Math.random() * 600);

  return {
    caseId,
    caseNumber,
    totalTimeSeconds: totalTime,
    stages: [
      {
        stage: TrialStage.INTRODUCTION,
        stageName: "Introducción",
        bpmValue: 70 + Math.floor(Math.random() * 10),
        levelLabel: NerviosismLevel.LOW,
        timestampSeconds: 0,
      },
      {
        stage: TrialStage.TESTIMONY,
        stageName: "Testimonio",
        bpmValue: 80 + Math.floor(Math.random() * 10),
        levelLabel: NerviosismLevel.MEDIUM,
        timestampSeconds: Math.floor(totalTime * 0.25),
      },
      {
        stage: TrialStage.OBJECTION,
        stageName: "Objeción",
        bpmValue: 90 + Math.floor(Math.random() * 10),
        levelLabel: NerviosismLevel.HIGH,
        timestampSeconds: Math.floor(totalTime * 0.5),
      },
      {
        stage: TrialStage.FINAL_ARGUMENT,
        stageName: "Alegato final",
        bpmValue: 85 + Math.floor(Math.random() * 10),
        levelLabel: NerviosismLevel.MEDIUM,
        timestampSeconds: Math.floor(totalTime * 0.75),
      },
    ],
  };
}

// Función para obtener feedback de un caso
export function getMockFeedback(caseId: string): FeedbackResponseDto[] {
  // Retornar feedback de ejemplo solo para algunos casos
  if (caseId === "case-003" || caseId.includes("case-003")) {
    return mockFeedback;
  }
  return [];
}

// Perfil de estudiante de ejemplo
export const mockStudentProfile: StudentProfileDto = {
  studentId: "student-001",
  email: "maria.gonzalez@example.com",
  name: "María",
  lastName: "González",
  createdAt: "2024-01-01T10:00:00.000Z",
  totalCasesCompleted: 5,
  averageScore: 8.5,
  totalPracticeTimeSeconds: 6250, // ~1h 44m
};

// Casos con progreso del estudiante
export const mockStudentCases: StudentCaseProgressDto[] = [
  {
    caseId: "case-001",
    caseNumber: 1,
    completedAt: "2024-01-15T10:30:00.000Z",
    status: "completed",
    totalTimeSeconds: 1200,
    performanceMetrics: {
      caseId: "case-001",
      caseNumber: 1,
      fillerWords: ["eh", "um", "este"],
      interruptionsCount: 2,
      totalTimeSeconds: 1200,
      heartRateBpm: 78,
      nerviosismLevel: NerviosismLevel.LOW,
    },
    nerviosismChart: {
      caseId: "case-001",
      caseNumber: 1,
      totalTimeSeconds: 1200,
      stages: [
        {
          stage: TrialStage.INTRODUCTION,
          stageName: "Introducción",
          bpmValue: 72,
          levelLabel: NerviosismLevel.LOW,
          timestampSeconds: 0,
        },
        {
          stage: TrialStage.TESTIMONY,
          stageName: "Testimonio",
          bpmValue: 78,
          levelLabel: NerviosismLevel.LOW,
          timestampSeconds: 300,
        },
        {
          stage: TrialStage.OBJECTION,
          stageName: "Objeción",
          bpmValue: 82,
          levelLabel: NerviosismLevel.MEDIUM,
          timestampSeconds: 600,
        },
        {
          stage: TrialStage.FINAL_ARGUMENT,
          stageName: "Alegato final",
          bpmValue: 75,
          levelLabel: NerviosismLevel.LOW,
          timestampSeconds: 900,
        },
      ],
    },
    feedbacks: [
      {
        feedbackId: "feedback-001",
        caseId: "case-001",
        teacherId: "teacher-001",
        type: FeedbackType.TEXT,
        content: "Excelente trabajo en tu primer caso. Mantuviste la calma durante toda la sesión y tu presentación fue clara y profesional. Continúa así.",
        voiceUrl: null,
        voiceDurationSeconds: null,
        createdAt: "2024-01-15T11:00:00.000Z",
      },
    ],
  },
  {
    caseId: "case-002",
    caseNumber: 2,
    completedAt: "2024-01-20T14:15:00.000Z",
    status: "completed",
    totalTimeSeconds: 1350,
    performanceMetrics: {
      caseId: "case-002",
      caseNumber: 2,
      fillerWords: ["eh", "um", "este", "bueno"],
      interruptionsCount: 4,
      totalTimeSeconds: 1350,
      heartRateBpm: 85,
      nerviosismLevel: NerviosismLevel.MEDIUM,
    },
    nerviosismChart: {
      caseId: "case-002",
      caseNumber: 2,
      totalTimeSeconds: 1350,
      stages: [
        {
          stage: TrialStage.INTRODUCTION,
          stageName: "Introducción",
          bpmValue: 75,
          levelLabel: NerviosismLevel.LOW,
          timestampSeconds: 0,
        },
        {
          stage: TrialStage.TESTIMONY,
          stageName: "Testimonio",
          bpmValue: 85,
          levelLabel: NerviosismLevel.MEDIUM,
          timestampSeconds: 337,
        },
        {
          stage: TrialStage.OBJECTION,
          stageName: "Objeción",
          bpmValue: 95,
          levelLabel: NerviosismLevel.HIGH,
          timestampSeconds: 675,
        },
        {
          stage: TrialStage.FINAL_ARGUMENT,
          stageName: "Alegato final",
          bpmValue: 88,
          levelLabel: NerviosismLevel.MEDIUM,
          timestampSeconds: 1012,
        },
      ],
    },
    feedbacks: [
      {
        feedbackId: "feedback-002",
        caseId: "case-002",
        teacherId: "teacher-001",
        type: FeedbackType.VOICE,
        content: null,
        voiceUrl: "https://example.com/audio/feedback-002.mp3",
        voiceDurationSeconds: 45,
        createdAt: "2024-01-20T15:00:00.000Z",
      },
    ],
  },
  {
    caseId: "case-003",
    caseNumber: 3,
    completedAt: "2024-01-25T09:45:00.000Z",
    status: "completed",
    totalTimeSeconds: 1245,
    performanceMetrics: {
      caseId: "case-003",
      caseNumber: 3,
      fillerWords: ["eh", "um", "este", "bueno", "entonces"],
      interruptionsCount: 3,
      totalTimeSeconds: 1245,
      heartRateBpm: 88,
      nerviosismLevel: NerviosismLevel.MEDIUM,
    },
    nerviosismChart: {
      caseId: "case-003",
      caseNumber: 3,
      totalTimeSeconds: 1245,
      stages: [
        {
          stage: TrialStage.INTRODUCTION,
          stageName: "Introducción",
          bpmValue: 75,
          levelLabel: NerviosismLevel.LOW,
          timestampSeconds: 0,
        },
        {
          stage: TrialStage.TESTIMONY,
          stageName: "Testimonio",
          bpmValue: 85,
          levelLabel: NerviosismLevel.MEDIUM,
          timestampSeconds: 300,
        },
        {
          stage: TrialStage.OBJECTION,
          stageName: "Objeción",
          bpmValue: 95,
          levelLabel: NerviosismLevel.HIGH,
          timestampSeconds: 600,
        },
        {
          stage: TrialStage.FINAL_ARGUMENT,
          stageName: "Alegato final",
          bpmValue: 88,
          levelLabel: NerviosismLevel.MEDIUM,
          timestampSeconds: 900,
        },
      ],
    },
    feedbacks: [
      {
        feedbackId: "feedback-003",
        caseId: "case-003",
        teacherId: "teacher-001",
        type: FeedbackType.TEXT,
        content: "María mostró un buen dominio del caso durante la introducción y el testimonio. Sin embargo, durante la fase de objeción, se notó un aumento significativo en el nerviosismo, lo cual es normal pero debe trabajar en mantener la calma. El tiempo de intervención fue adecuado y las muletillas fueron mínimas. Recomiendo practicar más con situaciones de presión para mejorar el control emocional durante las objeciones.",
        voiceUrl: null,
        voiceDurationSeconds: null,
        createdAt: "2024-01-25T10:00:00.000Z",
      },
    ],
  },
  {
    caseId: "case-004",
    caseNumber: 4,
    completedAt: "2024-01-30T11:20:00.000Z",
    status: "completed",
    totalTimeSeconds: 1100,
    performanceMetrics: {
      caseId: "case-004",
      caseNumber: 4,
      fillerWords: ["eh", "este"],
      interruptionsCount: 1,
      totalTimeSeconds: 1100,
      heartRateBpm: 75,
      nerviosismLevel: NerviosismLevel.LOW,
    },
    nerviosismChart: {
      caseId: "case-004",
      caseNumber: 4,
      totalTimeSeconds: 1100,
      stages: [
        {
          stage: TrialStage.INTRODUCTION,
          stageName: "Introducción",
          bpmValue: 70,
          levelLabel: NerviosismLevel.LOW,
          timestampSeconds: 0,
        },
        {
          stage: TrialStage.TESTIMONY,
          stageName: "Testimonio",
          bpmValue: 75,
          levelLabel: NerviosismLevel.LOW,
          timestampSeconds: 275,
        },
        {
          stage: TrialStage.OBJECTION,
          stageName: "Objeción",
          bpmValue: 80,
          levelLabel: NerviosismLevel.MEDIUM,
          timestampSeconds: 550,
        },
        {
          stage: TrialStage.FINAL_ARGUMENT,
          stageName: "Alegato final",
          bpmValue: 72,
          levelLabel: NerviosismLevel.LOW,
          timestampSeconds: 825,
        },
      ],
    },
    feedbacks: [],
  },
  {
    caseId: "case-005",
    caseNumber: 5,
    completedAt: "2024-02-05T13:45:00.000Z",
    status: "completed",
    totalTimeSeconds: 1355,
    performanceMetrics: {
      caseId: "case-005",
      caseNumber: 5,
      fillerWords: ["eh", "um", "bueno"],
      interruptionsCount: 2,
      totalTimeSeconds: 1355,
      heartRateBpm: 82,
      nerviosismLevel: NerviosismLevel.MEDIUM,
    },
    nerviosismChart: {
      caseId: "case-005",
      caseNumber: 5,
      totalTimeSeconds: 1355,
      stages: [
        {
          stage: TrialStage.INTRODUCTION,
          stageName: "Introducción",
          bpmValue: 75,
          levelLabel: NerviosismLevel.LOW,
          timestampSeconds: 0,
        },
        {
          stage: TrialStage.TESTIMONY,
          stageName: "Testimonio",
          bpmValue: 82,
          levelLabel: NerviosismLevel.MEDIUM,
          timestampSeconds: 338,
        },
        {
          stage: TrialStage.OBJECTION,
          stageName: "Objeción",
          bpmValue: 90,
          levelLabel: NerviosismLevel.HIGH,
          timestampSeconds: 677,
        },
        {
          stage: TrialStage.FINAL_ARGUMENT,
          stageName: "Alegato final",
          bpmValue: 85,
          levelLabel: NerviosismLevel.MEDIUM,
          timestampSeconds: 1016,
        },
      ],
    },
    feedbacks: [],
  },
];

// Estadísticas generales del estudiante
export const mockStudentStats: StudentOverallStatsDto = {
  totalCasesCompleted: 5,
  totalPracticeTimeSeconds: 6250,
  averageHeartRateBpm: 82,
  averageNerviosismLevel: NerviosismLevel.MEDIUM,
  totalFillerWords: 17,
  totalInterruptions: 12,
  casesByStage: [
    {
      stage: TrialStage.INTRODUCTION,
      count: 5,
      averageTimeSeconds: 275,
    },
    {
      stage: TrialStage.TESTIMONY,
      count: 5,
      averageTimeSeconds: 337,
    },
    {
      stage: TrialStage.OBJECTION,
      count: 5,
      averageTimeSeconds: 338,
    },
    {
      stage: TrialStage.FINAL_ARGUMENT,
      count: 5,
      averageTimeSeconds: 337,
    },
  ],
};

// Retroalimentaciones del estudiante
export const mockStudentFeedbacks: StudentFeedbackItemDto[] = [
  {
    feedbackId: "feedback-001",
    caseId: "case-001",
    caseNumber: 1,
    teacherId: "teacher-001",
    teacherName: "Dr. Carlos",
    teacherLastName: "Ramírez",
    type: FeedbackType.TEXT,
    content: "Excelente trabajo en tu primer caso. Mantuviste la calma durante toda la sesión y tu presentación fue clara y profesional. Continúa así.",
    voiceUrl: null,
    voiceDurationSeconds: null,
    createdAt: "2024-01-15T11:00:00.000Z",
  },
  {
    feedbackId: "feedback-002",
    caseId: "case-002",
    caseNumber: 2,
    teacherId: "teacher-001",
    teacherName: "Dr. Carlos",
    teacherLastName: "Ramírez",
    type: FeedbackType.VOICE,
    content: null,
    voiceUrl: "https://example.com/audio/feedback-002.mp3",
    voiceDurationSeconds: 45,
    createdAt: "2024-01-20T15:00:00.000Z",
  },
  {
    feedbackId: "feedback-003",
    caseId: "case-003",
    caseNumber: 3,
    teacherId: "teacher-001",
    teacherName: "Dr. Carlos",
    teacherLastName: "Ramírez",
    type: FeedbackType.TEXT,
    content: "María mostró un buen dominio del caso durante la introducción y el testimonio. Sin embargo, durante la fase de objeción, se notó un aumento significativo en el nerviosismo, lo cual es normal pero debe trabajar en mantener la calma. El tiempo de intervención fue adecuado y las muletillas fueron mínimas. Recomiendo practicar más con situaciones de presión para mejorar el control emocional durante las objeciones.",
    voiceUrl: null,
    voiceDurationSeconds: null,
    createdAt: "2024-01-25T10:00:00.000Z",
  },
];

