// components/Header/Header.tsx
import styles from './Header.module.css';

type HeaderProps = {
  userName: string;
};

export default function Header({ userName }: HeaderProps) {
  return (
    <header className={styles.header}>
      <h2 className={styles.logo}>Taskoom</h2>
      <div className={styles.userSection}>
        <span className={styles.greeting}>Olá, {userName}</span>
      </div>
    </header>
  );
}
