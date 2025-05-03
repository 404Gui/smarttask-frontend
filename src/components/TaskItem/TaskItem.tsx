'use client';
import { FC } from 'react';
import styles from './TaskItem.module.css';
import { Task } from '@/types/task';
import { Trash2 } from 'lucide-react';



type Props = {
  task: Task;
  onDelete: (id: number) => void;
  onToggle: (task: Task) => void;
};


const TaskItem: FC<Props> = ({ task, onDelete, onToggle }) => {
  return (
    <div className={`${styles.taskRow} ${task.completed ? styles.completed : ''}`}>
      
      <div className={styles.checkboxArea}>
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task)}
          className={styles.checkbox}
        />
      </div>

      <div className={styles.taskDetails}>
        <div className={styles.taskHeader}>
          <h3 className={styles.taskTitle}>{task.title}</h3>          
        </div>
        <p className={styles.taskDescription}>{task.description}</p>
      </div>

      <div className={styles.taskActions}>
        <button
          onClick={() => onDelete(task.id)}
          className={`${styles.button} ${styles.buttonDelete}`}
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
