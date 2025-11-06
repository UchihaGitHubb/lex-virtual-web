import { Link } from "react-router";
import styles from "./Layout.module.css";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logoSection}>
            <div className={styles.logoIcon}>
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2L2 7L12 12L22 7L12 2Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 17L12 22L22 17"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 12L12 17L22 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className={styles.logoText}>
              <h1 className={styles.logoTitle}>Lex Virtual</h1>
              <p className={styles.logoSubtitle}>Plataforma Jurídica</p>
            </div>
          </div>
        </div>
      </header>

      <main className={styles.main}>{children}</main>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <h3 className={styles.footerTitle}>Información Legal</h3>
            <ul className={styles.footerLinks}>
              <li>
                <a href="#normativas">Normativas</a>
              </li>
              <li>
                <a href="#terminos">Términos y Condiciones</a>
              </li>
              <li>
                <a href="#privacidad">Política de Privacidad</a>
              </li>
            </ul>
          </div>
          <div className={styles.footerSection}>
            <h3 className={styles.footerTitle}>Plataforma</h3>
            <ul className={styles.footerLinks}>
              <li>
                <Link to="/">Iniciar Sesión</Link>
              </li>
              <li>
                <Link to="/register">Registro</Link>
              </li>
            </ul>
          </div>
          <div className={styles.footerSection}>
            <p className={styles.footerCopyright}>
              © {new Date().getFullYear()} Lex Virtual. Todos los derechos reservados.
            </p>
            <p className={styles.footerNote}>
              Plataforma educativa para la enseñanza del Derecho
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

