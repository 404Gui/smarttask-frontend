'use client';
import { FC, useState, useEffect } from 'react';
import styles from './TaskDrawer.module.css';
import { Task } from '@/types/task';
import { AlertCircle, CalendarDays, CalendarPlus2, CalendarX2, Clock, X } from 'lucide-react';
import {
  parseISO,
  isToday,
  isYesterday,
  differenceInCalendarDays,
  format
} from 'date-fns';
import { ptBR } from 'date-fns/locale';

type Props = {
  task: Task;
  open: boolean;
  onClose: () => void;
  onEdit: (updatedTask: Task) => void;
};

const TaskDrawer: FC<Props> = ({ task, open, onClose, onEdit }) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);

  useEffect(() => {
    if (open) {
      setTitle(task.title);
      setDescription(task.description);
    }
  }, [open, task]);

  const handleSave = () => {
    if (title !== task.title || description !== task.description) {
      onEdit({ ...task, title, description });
    }
    onClose();
  };

  if (!open) return null;

  const createdAt = parseISO(task.created_at);
  const dueDate = task.due_date ? parseISO(task.due_date) : null;

  const getCreatedLabel = (date: Date) => {
    if (isToday(date)) return 'Hoje';
    if (isYesterday(date)) return 'Ontem';
    return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  };

  const getDueLabel = (date: Date) => {
    if (isToday(date)) {
      return {
        icon: <AlertCircle size={16} />,
        text: 'Vence hoje',
        className: styles.dueToday
      };
    }
    const diff = differenceInCalendarDays(date, new Date());
    if (diff === 1) {
      return {
        icon: <Clock size={16} />,
        text: 'Vence amanhã',
        className: styles.dueTomorrow
      };
    }
    if (diff > 1) {
      const dateStr = format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
      return {
        icon: <CalendarDays size={16} />,
        text: `${dateStr} • ${diff} dias restantes`,
        className: styles.dueFuture
      };
    }
    if (diff < 0) {
      const dateStr = format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
      return {
        icon: <AlertCircle size={16} />,
        text: `${dateStr} • atrasada`,
        className: styles.dueLate
      };
    }
    return { icon: null, text: '', className: '' };
  };

  const dueInfo = dueDate ? getDueLabel(dueDate) : null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>📋 Detalhes da Tarefa</h2>
          <button onClick={onClose} className={styles.closeButton}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.meta}>
          <div className={styles.metaItem}>
            <CalendarPlus2 size={16} />
            Criada em: {getCreatedLabel(createdAt)}
          </div>
          {dueInfo && (
            <div className={`${styles.metaItem} ${dueInfo.className}`}>
              {dueInfo.icon}
              {dueInfo.text}
            </div>
          )}

        </div>

        <label className={styles.label}>Título</label>
        <input
          className={styles.input}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label className={styles.label}>Descrição</label>
        <textarea
          className={styles.textarea}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button className={styles.saveButton} onClick={handleSave}>
          Salvar
        </button>

        <div className={styles.futureActions}>
          <button className={styles.actionButton}>🔔 Notificar-me</button>
          <button className={styles.actionButton}>📎 Anexar</button>
          <button className={styles.actionButton}>👤 Atribuir</button>
        </div>
      </div>
    </div>
  );
};

export default TaskDrawer;
