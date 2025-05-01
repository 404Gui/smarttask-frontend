'use client';
import { useEffect, useState } from 'react';
import api from '@/services/api';
import Cookies from 'js-cookie';
import TaskItem from '@/components/TaskItem/TaskItem';
import AddTaskForm from '@/components/AddTaskForm/AddTaskForm';
import styles from './Dashboard.module.css';
import SearchBar from '@/components/SearchBar/SearchBar';
import Header from '@/components/Header/Header';


type Task = {
  id: number;
  title: string;
  description: string;
  completed: boolean;
};

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

  const filteredTasks = tasks.filter(task =>
    `${task.title} ${task.description}`.toLowerCase().includes(query.toLowerCase())
  );
  

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <>
    <Header userName="Fulano" />

    <main className={styles.dashboard}>
      <h1 className={styles.title}>Suas Tarefas</h1>
  
      {/* <SearchBar query={query} onChange={setQuery} /> */}
      <SearchBar query={query} onChange={setQuery}>
  <AddTaskForm onSubmit={createTask} />
</SearchBar>

  
      <div className={styles.taskList}>
        {filteredTasks.length === 0 ? (
          <p className={styles.empty}>Nenhuma tarefa encontrada.</p>
        ) : (
          filteredTasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onDelete={deleteTask}
              onToggle={toggleTask}
            />
          ))
        )}
      </div>
  
      {/* <AddTaskForm onSubmit={createTask} /> */}
    </main>
    </>
  );
  
}
