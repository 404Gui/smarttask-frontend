"use client";
import { FC, useState } from "react";
import styles from "./TaskSection.module.css";
import { Task } from "@/types/task";
import { CheckCircle, Trash2, GripVertical } from "lucide-react";
import TaskDrawer from "./Drawer/TaskDrawer";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog/DeleteConfirmDialog";

type Props = {
  task: Task;
  onDelete: (id: number) => void;
  onToggle: (task: Task) => void;
  onEdit: (updatedTask: Task) => void;
};

const TaskItem: FC<Props> = ({ task, onDelete, onToggle, onEdit }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleCardClick = () => {
    setDrawerOpen(true);
  };

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: "box-shadow 200ms, opacity 200ms, transform 200ms",
    opacity: isDragging ? 0 : 1,
    background: "var(--card-bg)",
    color: "var(--foreground)",
    borderRadius: "8px",
    boxShadow: isDragging ? "0 2px 8px rgba(0,0,0,0.2)" : undefined,
  };

  return (
    <>
      <div
        className={`${styles.taskRow} ${
          task.completed ? styles.completed : ""
        }`}
        onClick={handleCardClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && handleCardClick()}
        ref={setNodeRef}
        style={style}
      >
        <div className={styles.left}>
          <div className={styles.actions} onClick={(e) => e.stopPropagation()}>
            <button
              style={{ touchAction: "none" }}
              className="cursor-grab active:cursor-grabbing mr-2"
              title="Arrastar tarefa"
              {...listeners}
              {...attributes}
            >
              <GripVertical size={20} />
            </button>
          </div>

          <div
            className={`${styles.checkbox} ${
              task.completed ? styles.checked : ""
            }`}
            onClick={(e) => {
              e.stopPropagation();
              onToggle(task);
            }}
            title="Marcar como concluída"
          >
            <CheckCircle size={20} strokeWidth={task.completed ? 2.5 : 1.5} />
          </div>

          <h3 className={styles.title}>{task.title}</h3>
        </div>

        <div className={styles.actions} onClick={(e) => e.stopPropagation()}>
          <button
            className={styles.deleteButton}
            title="Excluir tarefa"
            onClick={() => setConfirmOpen(true)}
          >
            <Trash2 size={18} />
          </button>

          <DeleteConfirmDialog
            open={confirmOpen}
            onOpenChange={setConfirmOpen}
            title={`Excluir tarefa "${task.title}"?`}
            message="Essa ação não pode ser desfeita."
            onConfirm={() => onDelete(task.id)}
          />
        </div>
      </div>

      <TaskDrawer
        task={task}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onEdit={onEdit}
      />
    </>
  );
};

export default TaskItem;
