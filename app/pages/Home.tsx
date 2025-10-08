import { useState } from "react";
import { useNavigate } from "react-router";
import styles from "./Home.module.css";

export default function Home() {
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [error, setError] = useState("");

  const handleContinue = () => {
    if (!role) {
      setError("Por favor, selecciona un rol para continuar");
      return;
    }

    // Navegar al login pasando el rol seleccionado
    navigate("/login", { state: { role } });
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>¿Cuál es tu rol?</h1>
          <p className={styles.subtitle}>Selecciona tu rol para continuar</p>
        </div>

        <div className={styles.content}>
          <div className={styles.formGroup}>
            <label htmlFor="role" className={styles.label}>
              Rol
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                if (error) {
                  setError("");
                }
              }}
              className={`${styles.select} ${error ? styles.selectError : ""}`}
            >
              <option value="">Selecciona un rol</option>
              <option value="teacher">Docente</option>
              <option value="student">Estudiante</option>
            </select>
            {error && <span className={styles.errorMessage}>{error}</span>}
          </div>

          <button
            onClick={handleContinue}
            className={styles.continueButton}
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
}

