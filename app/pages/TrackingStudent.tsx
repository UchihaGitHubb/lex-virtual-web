import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { authenticatedRequest, ApiError } from "../config/api";
import type {
  StudentListItemDto,
  StudentDetailsDto,
  PerformanceMetricsDto,
  NerviosismChartDto,
  FeedbackResponseDto,
} from "../types/tracking";
import Layout from "../components/Layout";
import StudentDetails from "../components/tracking/StudentDetails";
import NerviosismChart from "../components/tracking/NerviosismChart";
import FeedbackForm from "../components/tracking/FeedbackForm";
import styles from "./TrackingStudent.module.css";

interface TrackingStudentProps {
  studentId: string;
}

export default function TrackingStudent({ studentId }: TrackingStudentProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [studentsList, setStudentsList] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [student, setStudent] = useState<StudentDetailsDto | null>(null);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetricsDto | null>(null);
  const [nerviosismChart, setNerviosismChart] = useState<NerviosismChartDto | null>(null);
  const [feedback, setFeedback] = useState<FeedbackResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Obtener lista de estudiantes desde localStorage o estado de navegación
    const savedList = location.state?.studentsList as string[] | undefined;
    if (savedList) {
      setStudentsList(savedList);
      const index = savedList.indexOf(studentId);
      if (index !== -1) setCurrentIndex(index);
    } else {
      // Si no hay lista, cargar todos los estudiantes
      loadStudentsList();
    }

    loadStudentDetails();
  }, [studentId]);

  const loadStudentsList = async () => {
    try {
      const response = await authenticatedRequest<StudentListItemDto[]>(
        "/tracking/students"
      );
      const ids = response.map((s) => s.studentId);
      setStudentsList(ids);
      const index = ids.indexOf(studentId);
      if (index !== -1) setCurrentIndex(index);
    } catch (error) {
      console.error("Error al cargar lista de estudiantes:", error);
      // No hacer nada si falla, la lista se mantendrá vacía
    }
  };

  const loadStudentDetails = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Cargar detalles del estudiante
      const studentData = await authenticatedRequest<StudentDetailsDto>(
        `/tracking/students/${studentId}`
      );
      setStudent(studentData);

      // Seleccionar el primer caso si existe
      if (studentData.cases && studentData.cases.length > 0) {
        const firstCase = studentData.cases[0];
        setSelectedCaseId(firstCase.caseId);
        await loadCaseDetails(firstCase.caseId);
      }
    } catch (error) {
      console.error("Error al cargar detalles del estudiante:", error);

      if (error instanceof ApiError) {
        if (error.statusCode === 401) {
          navigate("/");
          return;
        }
        setError("Error al cargar los detalles del estudiante.");
      } else {
        setError("Error de conexión. Verifica tu conexión a internet.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loadCaseDetails = async (caseId: string) => {
    try {
      // Cargar métricas de desempeño del caso
      const metrics = await authenticatedRequest<PerformanceMetricsDto>(
        `/tracking/cases/${caseId}/performance`
      );
      setPerformanceMetrics(metrics);

      // Cargar gráfico de nerviosismo
      try {
        const chart = await authenticatedRequest<NerviosismChartDto>(
          `/tracking/cases/${caseId}/nerviosism-chart`
        );
        setNerviosismChart(chart);
      } catch (chartError) {
        console.error("Error al cargar gráfico de nerviosismo:", chartError);
        setNerviosismChart(null);
      }

      // Cargar feedback del caso
      try {
        const feedbackData = await authenticatedRequest<FeedbackResponseDto[]>(
          `/tracking/cases/${caseId}/feedback`
        );
        setFeedback(feedbackData);
      } catch (feedbackError) {
        console.error("Error al cargar feedback:", feedbackError);
        setFeedback([]);
      }
    } catch (error) {
      console.error("Error al cargar detalles del caso:", error);
      setPerformanceMetrics(null);
      setNerviosismChart(null);
      setFeedback([]);
    }
  };

  const handleCaseSelect = (caseId: string) => {
    setSelectedCaseId(caseId);
    loadCaseDetails(caseId);
  };

  const handleBack = () => {
    navigate("/tracking", { state: { scrollPosition: location.state?.scrollPosition } });
  };

  const handleContinue = () => {
    if (studentsList.length > 0 && currentIndex < studentsList.length - 1) {
      // Ir al siguiente estudiante
      const nextStudentId = studentsList[currentIndex + 1];
      navigate(`/tracking/student/${nextStudentId}`, {
        state: { studentsList, scrollPosition: location.state?.scrollPosition },
      });
    } else {
      // Volver a la lista
      handleBack();
    }
  };

  const handleFeedbackSubmitted = () => {
    if (selectedCaseId) {
      loadCaseDetails(selectedCaseId);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className={styles.container}>
          <div className={styles.card}>
            <p className={styles.loadingText}>Cargando detalles del estudiante...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !student) {
    return (
      <Layout>
        <div className={styles.container}>
          <div className={styles.card}>
            <div className={styles.errorContainer}>
              <p className={styles.errorText}>{error || "Estudiante no encontrado"}</p>
              <button onClick={handleBack} className={styles.retryButton}>
                Volver
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
            <h1 className={styles.title}>
              {student.studentLastName}, {student.studentName}
            </h1>
            <p className={styles.subtitle}>Detalles de desempeño</p>
          </div>

          <StudentDetails
            student={student}
            selectedCaseId={selectedCaseId}
            performanceMetrics={performanceMetrics}
            onCaseSelect={handleCaseSelect}
          />

          {nerviosismChart && (
            <NerviosismChart
              chartData={nerviosismChart}
              caseNumber={nerviosismChart.caseNumber}
            />
          )}

          {selectedCaseId && performanceMetrics && (
            <FeedbackForm
              caseId={selectedCaseId}
              studentId={studentId}
              existingFeedback={feedback}
              onFeedbackSubmitted={handleFeedbackSubmitted}
            />
          )}

          <div className={styles.navigation}>
            <button onClick={handleBack} className={styles.backButton}>
              Volver
            </button>
            <button onClick={handleContinue} className={styles.continueButton}>
              {studentsList.length > 0 && currentIndex < studentsList.length - 1
                ? "CONTINUAR"
                : "Cerrar"}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

