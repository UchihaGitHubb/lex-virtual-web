import { Link, useLocation } from "react-router";
import styles from "./NavigationMenu.module.css";

interface NavigationMenuProps {
  userRole: string | null;
}

export default function NavigationMenu({ userRole }: NavigationMenuProps) {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  const isTeacher = userRole === "teacher" || userRole === "docente";
  const isStudent = userRole === "student" || userRole === "estudiante";

  return (
    <nav className={styles.nav}>
      <div className={styles.navContainer}>
        <div className={styles.navItems}>
          {isTeacher && (
            <>
              <Link
                to="/tracking"
                className={`${styles.navItem} ${isActive("/tracking") ? styles.active : ""}`}
              >
                <span className={styles.navIcon}>📊</span>
                <span className={styles.navText}>Panel de Seguimiento</span>
              </Link>
            </>
          )}
          {isStudent && (
            <>
              <Link
                to="/my-feedbacks"
                className={`${styles.navItem} ${isActive("/my-feedbacks") ? styles.active : ""}`}
              >
                <span className={styles.navIcon}>📝</span>
                <span className={styles.navText}>Mis Retroalimentaciones</span>
              </Link>
            </>
          )}
          <Link
            to="/dashboard"
            className={`${styles.navItem} ${isActive("/dashboard") ? styles.active : ""}`}
          >
            <span className={styles.navIcon}>⚙️</span>
            <span className={styles.navText}>Dashboard</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}

