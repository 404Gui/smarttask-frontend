'use client';
import { FC, useState, KeyboardEvent } from 'react';
import styles from './TaskItem.module.css';
import { Task } from '@/types/task';
import { Trash2, Pencil, CalendarPlus2, CalendarX2 } from 'lucide-react';
import { isBefore, isToday, parseISO} from 'date-fns';

type Props = {
  task: Task;
  onDelete: (id: number) => void;
  onToggle: (task: Task) => void;
  onEdit: (updatedTask: Task) => void;
};

const TaskItem: FC<Props> = ({ task, onDelete, onToggle, onEdit }) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);

  const handleTitleBlur = () => {
    setIsEditingTitle(false);
    if (title !== task.title) {
      onEdit({ ...task, title });
    }
  };

  const handleDescBlur = () => {
    setIsEditingDesc(false);
    if (description !== task.description) {
      onEdit({ ...task, description });
    }
  };

  const handleTitleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      (e.target as HTMLInputElement).blur();
    }
  };

  const dueDate = task.due_date ? parseISO(task.due_date) : null;

  const isOverdue = dueDate ? isBefore(dueDate, new Date()) && !isToday(dueDate) : false;
  
  const isDueToday = dueDate ? isToday(dueDate) : false;

  const dateColor = isOverdue ? '#ff4d4d' : isDueToday ? '#ffc107' : '#4da6ff';

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
          {isEditingTitle ? (
            <input
              className={styles.taskTitleInput}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleTitleBlur}
              onKeyDown={handleTitleKey}
              autoFocus
            />
          ) : (
            <h3
              className={styles.taskTitle}
              onClick={() => setIsEditingTitle(true)}
              title="Clique para editar"
            >
              {task.title}
              {/* <Pencil size={14} className={styles.editIcon} /> */}
            </h3>
          )}
        </div>

        {isEditingDesc ? (
          <textarea
            className={styles.taskDescriptionInput}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={handleDescBlur}
            autoFocus
          />
        ) : (
          <p
            className={styles.taskDescription}
            onClick={() => setIsEditingDesc(true)}
            title="Clique para editar"
          >
            {task.description}
            {/* <Pencil size={10} className={styles.editIcon} /> */}
          </p>
        )}

        <div className={styles.taskMetaGroup}>
          <p className={styles.taskMeta}>
            <CalendarPlus2 size={15} style={{ marginRight: '4px' }} /> Criação: {new Date(task.created_at).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}
          </p>          
          {dueDate && (
            <p className={styles.taskMeta}>
              <CalendarX2 size={15} color={dateColor} style={{ marginRight: '4px' }} />
              Vencimento: {dueDate.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}
            </p>
          )}
        </div>
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
