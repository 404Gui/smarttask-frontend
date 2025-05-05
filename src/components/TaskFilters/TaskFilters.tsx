import styles from './TaskFilters.module.css';

type TaskFiltersProps = {
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  priorityFilter: string;
  onPriorityFilterChange: (value: string) => void;
};

export default function TaskFilters({
  statusFilter,
  onStatusFilterChange,
  priorityFilter,
  onPriorityFilterChange,
}: TaskFiltersProps) {
  return (
    <div className={styles.filters}>
      <span className={styles.label}>Filtros</span>
      <div className={styles.selects}>
        <select
          value={statusFilter}
          onChange={e => onStatusFilterChange(e.target.value)}
          className={styles.select}
        >
          <option value="todas">Todas</option>
          <option value="pendentes">Pendentes</option>
          <option value="concluidas">Concluídas</option>
          <option value="vencidas">Vencidas</option>
        </select>

        <select
          value={priorityFilter}
          onChange={e => onPriorityFilterChange(e.target.value)}
          className={styles.select}
        >
          <option value="todas">Todas</option>
          <option value="alta">Alta</option>
          <option value="média">Média</option>
          <option value="baixa">Baixa</option>
        </select>
      </div>
    </div>
  );
}
