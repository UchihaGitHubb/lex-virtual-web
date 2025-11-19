import { useState, useRef } from "react";
import { authenticatedRequest, uploadFile, ApiError } from "../../config/api";
import type {
  CreateTextFeedbackDto,
  CreateVoiceFeedbackDto,
  FeedbackResponseDto,
} from "../../types/tracking";
import styles from "./FeedbackForm.module.css";

interface FeedbackFormProps {
  caseId: string;
  studentId: string;
  existingFeedback: FeedbackResponseDto[];
  onFeedbackSubmitted: () => void;
}

export default function FeedbackForm({
  caseId,
  studentId,
  existingFeedback,
  onFeedbackSubmitted,
}: FeedbackFormProps) {
  const [feedbackType, setFeedbackType] = useState<"text" | "voice">("text");
  const [textComment, setTextComment] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const MIN_TEXT_LENGTH = 300;
  const MAX_RECORDING_TIME = 60; // segundos

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(audioBlob);
        setAudioBlob(audioBlob);
        setAudioUrl(url);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Timer
      timerRef.current = window.setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= MAX_RECORDING_TIME) {
            stopRecording();
            return MAX_RECORDING_TIME;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (error) {
      console.error("Error al acceder al micrófono:", error);
      setError("No se pudo acceder al micrófono. Por favor, verifica los permisos.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
      setIsPaused(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const cancelRecording = () => {
    stopRecording();
    setAudioUrl(null);
    setAudioBlob(null);
    setRecordingTime(0);
    setError(null);
  };

  const handleSubmitText = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (textComment.trim().length < MIN_TEXT_LENGTH) {
      setError(`El comentario debe tener al menos ${MIN_TEXT_LENGTH} caracteres.`);
      return;
    }

    setIsSubmitting(true);

    try {
      const feedbackData: CreateTextFeedbackDto = {
        caseId,
        content: textComment.trim(),
      };

      await authenticatedRequest("/tracking/feedback/text", {
        method: "POST",
        body: JSON.stringify(feedbackData),
      });

      setTextComment("");
      setError(null);
      onFeedbackSubmitted();
    } catch (error) {
      console.error("Error al enviar comentario:", error);
      if (error instanceof ApiError) {
        // Manejo específico según el código de estado
        if (error.statusCode === 400) {
          const validationMessage = error.messages.join(", ");
          setError(validationMessage || `El comentario debe tener al menos ${MIN_TEXT_LENGTH} caracteres.`);
        } else {
          setError(error.message || "Error al enviar el comentario.");
        }
      } else {
        setError("Error de conexión. Verifica tu conexión a internet.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitVoice = async () => {
    if (!audioBlob) {
      setError("No hay grabación de audio para enviar.");
      return;
    }

    // Validar duración mínima (1 segundo)
    if (recordingTime < 1) {
      setError("La grabación debe tener al menos 1 segundo de duración.");
      return;
    }

    // Validar duración máxima (60 segundos)
    if (recordingTime > MAX_RECORDING_TIME) {
      setError(`La grabación no puede exceder ${MAX_RECORDING_TIME} segundos.`);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Subir el archivo de audio al servidor
      // El backend valida: tipo de archivo (solo audio), tamaño máximo (10MB)
      const fileName = `feedback-${caseId}-${Date.now()}.webm`;
      let voiceUrl: string;
      
      try {
        const uploadResponse = await uploadFile(audioBlob, fileName, "/upload/audio");
        voiceUrl = uploadResponse.url;
        
        // Si la URL es relativa, convertirla a absoluta usando la base URL de la API
        if (voiceUrl && !voiceUrl.startsWith("http")) {
          const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
          voiceUrl = `${apiBaseUrl}${voiceUrl.startsWith("/") ? voiceUrl : `/${voiceUrl}`}`;
        }
      } catch (uploadError) {
        // Manejo específico de errores del backend
        if (uploadError instanceof ApiError) {
          if (uploadError.statusCode === 404) {
            setError("El endpoint de subida de archivos no está disponible. Por favor, contacta al administrador.");
          } else if (uploadError.statusCode === 400) {
            const validationMessage = uploadError.messages.join(", ");
            setError(validationMessage || "Error de validación: verifica que el archivo sea de audio y no exceda 10MB.");
          } else if (uploadError.statusCode === 413) {
            setError("El archivo de audio es demasiado grande. El tamaño máximo permitido es 10MB.");
          } else {
            setError(uploadError.message || "Error al subir el archivo de audio. Por favor, intenta nuevamente.");
          }
        } else {
          setError("Error de conexión al subir el archivo. Verifica tu conexión a internet.");
        }
        throw uploadError;
      }

      const feedbackData: CreateVoiceFeedbackDto = {
        caseId,
        voiceUrl,
        voiceDurationSeconds: recordingTime,
      };

      await authenticatedRequest("/tracking/feedback/voice", {
        method: "POST",
        body: JSON.stringify(feedbackData),
      });

      cancelRecording();
      onFeedbackSubmitted();
    } catch (error) {
      console.error("Error al enviar comentario de voz:", error);
      if (error instanceof ApiError) {
        // Manejo específico según el código de estado
        if (error.statusCode === 400) {
          const validationMessage = error.messages.join(", ");
          setError(validationMessage || "Error de validación. Verifica la duración del audio (1-60 segundos).");
        } else {
          setError(error.message || "Error al enviar el comentario de voz.");
        }
      } else {
        setError("Error de conexión. Verifica tu conexión a internet.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, "0")}`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Retroalimentación</h2>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${feedbackType === "text" ? styles.active : ""}`}
            onClick={() => {
              setFeedbackType("text");
              cancelRecording();
            }}
          >
            ✍️ Comentario de Texto
          </button>
          <button
            className={`${styles.tab} ${feedbackType === "voice" ? styles.active : ""}`}
            onClick={() => {
              setFeedbackType("voice");
              setTextComment("");
            }}
          >
            🎤 Comentario de Voz
          </button>
        </div>
      </div>

      {feedbackType === "text" ? (
        <form onSubmit={handleSubmitText} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="comment" className={styles.label}>
              Comentario (mínimo {MIN_TEXT_LENGTH} caracteres)
            </label>
            <textarea
              id="comment"
              value={textComment}
              onChange={(e) => {
                setTextComment(e.target.value);
                setError(null);
              }}
              className={styles.textarea}
              placeholder="Escribe tu retroalimentación aquí..."
              rows={8}
              disabled={isSubmitting}
            />
            <div className={styles.charCount}>
              {textComment.length}/{MIN_TEXT_LENGTH} caracteres
              {textComment.length < MIN_TEXT_LENGTH && (
                <span className={styles.charWarning}>
                  {" "}
                  (faltan {MIN_TEXT_LENGTH - textComment.length})
                </span>
              )}
            </div>
          </div>

          {error && <p className={styles.errorText}>{error}</p>}

          <button
            type="submit"
            className={styles.submitButton}
            disabled={textComment.trim().length < MIN_TEXT_LENGTH || isSubmitting}
          >
            {isSubmitting ? "Enviando..." : "Enviar comentario"}
          </button>
        </form>
      ) : (
        <div className={styles.voiceContainer}>
          {!audioUrl ? (
            <div className={styles.recordingSection}>
              {!isRecording ? (
                <button onClick={startRecording} className={styles.recordButton}>
                  🎤 Iniciar Grabación
                </button>
              ) : (
                <div className={styles.recordingControls}>
                  <div className={styles.recordingInfo}>
                    <div className={styles.recordingIndicator}>🔴</div>
                    <span className={styles.recordingTime}>
                      {formatTime(recordingTime)} / {formatTime(MAX_RECORDING_TIME)}
                    </span>
                  </div>
                  <button onClick={stopRecording} className={styles.stopButton}>
                    Detener
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className={styles.audioPreview}>
              <audio
                ref={audioRef}
                src={audioUrl}
                controls
                className={styles.audioPlayer}
              />
              <div className={styles.audioActions}>
                <button onClick={cancelRecording} className={styles.cancelButton}>
                  Cancelar
                </button>
                <button
                  onClick={handleSubmitVoice}
                  className={styles.submitButton}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Enviando..." : "Enviar comentario de voz"}
                </button>
              </div>
            </div>
          )}

          {error && <p className={styles.errorText}>{error}</p>}
        </div>
      )}

      {existingFeedback.length > 0 && (
        <div className={styles.feedbackList}>
          <h3 className={styles.feedbackTitle}>Comentarios Anteriores</h3>
          {existingFeedback.map((feedback) => (
            <div key={feedback.feedbackId} className={styles.feedbackItem}>
              <div className={styles.feedbackHeader}>
                <span className={styles.feedbackType}>
                  {feedback.type === "text" ? "✍️ Texto" : "🎤 Voz"}
                </span>
                <span className={styles.feedbackDate}>
                  {new Date(feedback.createdAt).toLocaleDateString()}
                </span>
              </div>
              {feedback.content && (
                <p className={styles.feedbackText}>{feedback.content}</p>
              )}
              {feedback.voiceUrl && (
                <audio src={feedback.voiceUrl} controls className={styles.feedbackAudio} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

