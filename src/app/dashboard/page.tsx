'use client';
import { useEffect, useState } from 'react';
import api from '@/services/api';
import Cookies from 'js-cookie';
import TaskItem from '@/components/TaskItem/TaskItem';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import styles from './Dashboard.module.css';

type Task = {
  id: number;
  title: string;
  description: string;
  completed: boolean;
};

const taskSchema = z.object({
  title: z.string().min(3, 'Título muito curto'),
  description: z.string().min(5, 'Descrição muito curta'),
});

type TaskForm = z.infer<typeof taskSchema>;

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskForm>({
    resolver: zodResolver(taskSchema),
  });

  const fetchTasks = async () => {
    try {
      const token = Cookies.get('token');
      const res = await api.get('/tasks', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
    } catch (err) {
      console.error('Erro ao buscar tarefas');
    }
  };

  const createTask = async (data: TaskForm) => {
    try {
      const token = Cookies.get('token');
      const res = await api.post('/tasks', data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(prev => [...prev, res.data]);
      reset();
    } catch (err) {
      console.error('Erro ao criar tarefa');
    }
  };

  const deleteTask = async (id: number) => {
    try {
      const token = Cookies.get('token');
      await api.delete(`/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (err) {
      console.error('Erro ao deletar tarefa');
    }
  };

  const toggleTask = async (task: Task) => {
    try {
      const token = Cookies.get('token');
      const res = await api.put(
        `/tasks/${task.id}`,
        { completed: !task.completed },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks(prev => prev.map(t => (t.id === task.id ? res.data : t)));
    } catch (err) {
      console.error('Erro ao atualizar tarefa');
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <main className={styles.dashboard}>
      <h1 className={styles.title}>Minhas Tarefas</h1>

      <form onSubmit={handleSubmit(createTask)} className={styles.form}>
        <input
          {...register('title')}
          placeholder="Título"
          className={styles.input}
        />
        {errors.title && <p className={styles.error}>{errors.title.message}</p>}

        <textarea
          {...register('description')}
          placeholder="Descrição"
          className={styles.textarea}
        />
        {errors.description && (
          <p className={styles.error}>{errors.description.message}</p>
        )}

        <button type="submit" className={styles.button}>
          Adicionar Tarefa
        </button>
      </form>

      <div className={styles.taskList}>
        {tasks.length === 0 ? (
          <p className={styles.empty}>Nenhuma tarefa ainda. Crie uma acima 👆</p>
        ) : (
          tasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onDelete={deleteTask}
              onToggle={toggleTask}
            />
          ))
        )}
      </div>
    </main>
  );
}
