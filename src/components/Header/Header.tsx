'use client'
import styles from './Header.module.css';
import { useAuth } from '@/context/AuthContext';
import UserMenu from './UserMenu/UserMenu';
import ThemeToggle from './ThemeToggle/ThemeToggle';
import LoadingOverlay from '../LoadingOverlay/LoadingOverlay';

export default function Header() {
  const { user, loading } = useAuth();

  return (
    <header className={styles.header}>
      <h2 className={styles.logo}>Taskoom</h2>
      <div className={styles.userSection}>
        <ThemeToggle />
        {loading ? (
          <LoadingOverlay show={loading} />
        ) : user ? (
          <UserMenu />
        ) : (
          <span className={styles.greeting}>Olá, Visitante!</span>
        )}
      </div>
    </header>
  );
}
