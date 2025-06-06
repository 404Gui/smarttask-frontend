'use client';
import styles from './SearchBar.module.css';

type SearchBarProps = {
  query: string;
  onChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  priorityFilter: string;
  onPriorityFilterChange: (value: string) => void;
  children?: React.ReactNode;
};

export default function SearchBar({
  query,
  onChange, 
  children,
}: SearchBarProps) {
  return (
    <div className={styles.searchBar}>
      <input
        type="text"
        placeholder="Buscar tarefas..."
        value={query}
        onChange={e => onChange(e.target.value)}
        className={styles.input}
      />
      {children}
    </div>
  );
}
