'use client';
import styles from './LoadingSpinner.module.css';

export default function LoadingSpinner() {
  return (
    <div className={styles.overlay}>
      <div className={styles.spinner}></div>
      <span className={styles.text}>Carregando...</span>
    </div>
  );
}
