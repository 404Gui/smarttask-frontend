"use client";
import { FC } from "react";
import TaskItem from "../TaskItem/TaskItem";
import styles from "./PriorityAccordion.module.css";
import { Task } from "@/types/task";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { ChevronDown } from "lucide-react";

type Props = {
  priority: "alta" | "média" | "baixa";
  tasks: Task[];
  onDelete: (id: number) => void;
  onToggle: (task: Task) => void;
  onEdit: (updatedTask: Task) => void;
  activeTask: Task | null;
  overId: string | null;
};

const PriorityAccordion: FC<Props> = ({
  priority,
  tasks,
  onDelete,
  onToggle,
  onEdit,
  activeTask,
  overId,
}) => {
  const capitalized = priority.charAt(0).toUpperCase() + priority.slice(1);

  const { setNodeRef } = useDroppable({
    id: priority,
  });

  const isBeingHovered = overId === priority;

  const droppableStyle = {
    backgroundColor: isBeingHovered ? "var(--hover-bg)" : "transparent",
    transition: "background-color 0.2s ease",
    borderRadius: "8px",
  };

  return (
    <details
      open
      className={styles.accordion}
      ref={setNodeRef}
      style={droppableStyle}
    >
      <summary className={styles.accordionHeader}>
        <ChevronDown
          className={`${styles.chevron} group-open:rotate-180 transition-transform duration-200`}
          size={30}
        />
        {capitalized} prioridade ({tasks.length})
      </summary>
      {tasks.length === 0 ? (
        <p className={styles.empty}>Nenhuma tarefa de prioridade {priority}.</p>
      ) : (
        <SortableContext
          items={tasks.map((task) => task.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onDelete={onDelete}
              onToggle={onToggle}
              onEdit={onEdit}
            />
          ))}
        </SortableContext>
      )}
    </details>
  );
};

export default PriorityAccordion;
