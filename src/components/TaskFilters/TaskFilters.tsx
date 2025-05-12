import { ChevronDown } from "lucide-react";
import * as Popover from "@radix-ui/react-popover";
import styles from "./TaskFilters.module.css";

const Filter = ({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: string[];
  selected: string;
  onChange: (value: string) => void;
}) => (
  <Popover.Root>
    <Popover.Trigger asChild>
      <button className={styles.filterButton}>
        {label}: <span className={styles.selectedValue}>{selected}</span>
        <ChevronDown size={16} />
      </button>
    </Popover.Trigger>

    <Popover.Portal>
      <Popover.Content className={styles.popoverContent} sideOffset={4}>
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={`${styles.popoverItem} ${
              selected === opt ? styles.activeItem : ""
            }`}
          >
            {opt}
          </button>
        ))}
      </Popover.Content>
    </Popover.Portal>
  </Popover.Root>
);

export default function TaskFilters({
  statusFilter,
  onStatusFilterChange,
  priorityFilter,
  onPriorityFilterChange,
}: {
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  priorityFilter: string;
  onPriorityFilterChange: (value: string) => void;
}) {
  return (
    <div className={styles.filters}>
      <div className={styles.selects}>
        <Filter
          label="Prioridade"
          selected={priorityFilter}
          options={["todas", "alta", "média", "baixa"]}
          onChange={onPriorityFilterChange}
        />
        <Filter
          label="Status"
          selected={statusFilter}
          options={["todas", "pendentes", "concluidas", "vencidas"]}
          onChange={onStatusFilterChange}
        />
      </div>
    </div>
  );
}
