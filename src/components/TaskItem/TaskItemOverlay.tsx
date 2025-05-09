"use client";
import { FC } from "react";
import styles from "./TaskItem.module.css";
import { Task } from "@/types/task";
import { CheckCircle, GripVertical } from "lucide-react";

type Props = {
  task: Task;
};

const TaskItemOverlay: FC<Props> = ({ task }) => {
  return (
    <div
      className={`${styles.taskRow} ${task.completed ? styles.completed : ""}`}
      style={{
        opacity: 0.9,
        background: "var(--card-bg)",
        color: "var(--foreground)",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
        cursor: "grabbing",
        pointerEvents: "none",
      }}
    >
      <div className={styles.left}>
        <div className={styles.actions}>
          <span className="cursor-grabbing mr-2">
            <GripVertical size={18} />
          </span>
        </div>

        <div
          className={`${styles.checkbox} ${
            task.completed ? styles.checked : ""
          }`}
        >
          <CheckCircle size={20} strokeWidth={task.completed ? 2.5 : 1.5} />
        </div>

        <h3 className={styles.title}>{task.title}</h3>
      </div>
    </div>
  );
};

export default TaskItemOverlay;
