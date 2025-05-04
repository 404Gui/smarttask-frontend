'use client';
import { useEffect, useState } from 'react';
import api from '@/services/api';
import Cookies from 'js-cookie';
import TaskItem from '@/components/TaskItem/TaskItem';
import AddTaskForm from '@/components/AddTaskForm/AddTaskForm';
import styles from './Dashboard.module.css';
import SearchBar from '@/components/SearchBar/SearchBar';
import Header from '@/components/Header/Header';
import { Task } from '@/types/task';
import PriorityAccordion from '@/components/PriorityAccordion/PriorityAccordion';
import { toast } from 'sonner';


export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [query, setQuery] = useState('');


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

  const createTask = async (data: { title: string; description: string; priority: string }) => {
    try {
      const token = Cookies.get('token');
      const res = await api.post('/tasks', data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(prev => [...prev, res.data]);
      toast.success('Tarefa adicionada!');
    } catch (err) {
      console.error('Erro ao criar tarefa');
      toast.error('Ops! Isso não era pra ter acontecido. Entre em contato com o administrador.');
    }
  };

  const editTask = async (updatedTask: Task) => {
    try {
      const token = Cookies.get('token');
      const res = await api.put(`/tasks/${updatedTask.id}`, updatedTask, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(prev =>
        prev.map(t => (t.id === updatedTask.id ? res.data : t))
      );
      toast.success('Tarefa atualizada!');
    } catch (err) {
      console.error('Erro ao editar tarefa');
      toast.error('Não foi possível editar a tarefa.');
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

  const filteredTasks = tasks.filter(task =>
    `${task.title} ${task.description}`.toLowerCase().includes(query.toLowerCase())
  );

  const priorities: ('alta' | 'média' | 'baixa')[] = ['alta', 'média', 'baixa'];

  const groupedTasks = priorities.map(priority => ({
    priority,
    tasks: filteredTasks.filter(task => task.priority === priority)
  }));


  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <>
      <Header userName="Fulano" />

      <main className={styles.dashboard}>
        <h1 className={styles.title}>Suas Tarefas</h1>

        <SearchBar query={query} onChange={setQuery}>
          <AddTaskForm onSubmit={createTask} />
        </SearchBar>


        {groupedTasks.map(group => (
          <PriorityAccordion
            key={group.priority}
            priority={group.priority}
            tasks={group.tasks}
            onDelete={deleteTask}
            onToggle={toggleTask}
            onEdit={editTask}
          />
        ))}


      </main>
    </>
  );

}
