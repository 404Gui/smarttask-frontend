'use client';
import styles from './AuthLayout.module.css';
import { motion } from 'framer-motion';

interface Props {
  children: React.ReactNode;
  title: string;
}

export default function AuthLayout({ children, title }: Props) {
  return (
    <main className={styles.container}>
      <div className={styles.overlay}></div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={styles.header}
      >
        <h1>Taskoom</h1>
        <p>Seu jeito fácil de organizar as tarefas!</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className={styles.formContainer}
      >
        <h2>{title}</h2>
        {children}
      </motion.div>
    </main>
  );
}
