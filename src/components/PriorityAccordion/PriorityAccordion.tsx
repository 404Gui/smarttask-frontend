'use client';
import { FC } from 'react';
import TaskItem from '../TaskItem/TaskItem';
import styles from './PriorityAccordion.module.css';
import { Task } from '@/types/task';

type Props = {
  priority: 'alta' | 'média' | 'baixa';
  tasks: Task[];
  onDelete: (id: number) => void;
  onToggle: (task: Task) => void;
  onEdit: (updatedTask: Task) => void;
};

const PriorityAccordion: FC<Props> = ({ priority, tasks, onDelete, onToggle, onEdit }) => {
  const capitalized = priority.charAt(0).toUpperCase() + priority.slice(1);

  return (
    <>

      <details open className={styles.accordion}>
        <summary className={styles.accordionHeader}>
          {capitalized} prioridade ({tasks.length})
        </summary>
        {tasks.length === 0 ? (
          <p className={styles.empty}>Nenhuma tarefa de prioridade {priority}.</p>
        ) : (
          tasks.map(task => (
            <TaskItem key={task.id} task={task} onDelete={onDelete} onToggle={onToggle} onEdit={onEdit} />
          ))
        )}
      </details>
    </>
  );
};

export default PriorityAccordion;
