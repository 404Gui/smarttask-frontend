'use client';
import { FC } from 'react';
import styles from './TaskItem.module.css';

type Task = {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  priority?: 'baixa' | 'média' | 'alta'; // agora opcional
};

type Props = {
  task: Task;
  onDelete: (id: number) => void;
  onToggle: (task: Task) => void;
};

const getPriorityIcon = (priority: 'baixa' | 'média' | 'alta') => {
  switch (priority) {
    case 'baixa':
      return '🟢'; // ou algum ícone SVG no futuro
    case 'média':
      return '🟡';
    case 'alta':
      return '🔴';
    default:
      return '';
  }
};


const TaskItem: FC<Props> = ({ task, onDelete, onToggle }) => {
  return (
    <div className={`${styles.taskItem} ${task.completed ? styles.completed : ''}`}>

      <div className={styles.left}>
        {task.priority && (
          <span className={`${styles.priorityTag} ${styles[task.priority]}`}>
            {getPriorityIcon(task.priority)} {task.priority}
          </span>
        )}

        <div className={styles.taskContent}>
          <h2 className={`${styles.taskTitle} ${task.completed ? styles.completed : ''}`}>{task.title}</h2>
          <p className={`${styles.taskDescription} ${task.completed ? styles.completed : ''}`}>{task.description}</p>
        </div>
      </div>

      <div className={styles.buttonsContainer}>
        <button
          onClick={() => onToggle(task)}
          className={`${styles.button} ${styles.buttonConclude}`}
        >
          {task.completed ? 'Desfazer' : 'Concluir'}
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className={`${styles.button} ${styles.buttonDelete}`}
        >
          Excluir
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
