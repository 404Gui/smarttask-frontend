'use client';
import { useTheme } from '@/context/ThemeContext';
import { SunMoon } from 'lucide-react';
import styles from './ThemeToggle.module.css';

export default function ThemeToggle() {
  const { toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme} className={styles.toggle} aria-label="Alternar tema">
      <SunMoon size={20} strokeWidth={1.5} />
    </button>
  );
}
