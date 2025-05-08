'use client'
import styles from './Header.module.css';
import { useAuth } from '@/context/AuthContext';
import UserMenu from './UserMenu/UserMenu';
import ThemeToggle from './ThemeToggle/ThemeToggle';

export default function Header() {
  const { user, loading } = useAuth();

  return (
    <header className={styles.header}>
      <h2 className={styles.logo}>Taskoom</h2>
      <div className={styles.userSection}>
        <ThemeToggle />
        {loading ? (
          <span className={styles.greeting}>Carregando...</span>
        ) : user ? (
          <UserMenu />
        ) : (
          <span className={styles.greeting}>Olá, Visitante!</span>
        )}
      </div>
    </header>
  );
}
