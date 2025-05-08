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
import TaskFilters from '@/components/TaskFilters/TaskFilters';


export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('todas');
  const [priorityFilter, setPriorityFilter] = useState('todas');


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

  const filteredTasks = tasks.filter(task => {
    const matchesQuery = task.title.toLowerCase().includes(query.toLowerCase());

    const matchesStatus =
      statusFilter === 'todas' ||
      (statusFilter === 'pendentes' && !task.completed) ||
      (statusFilter === 'concluidas' && task.completed) ||
      (statusFilter === 'vencidas' &&
        !task.completed &&
        task.due_date &&
        new Date(task.due_date) < new Date());

    const matchesPriority =
      priorityFilter === 'todas' || task.priority === priorityFilter;

    return matchesQuery && matchesStatus && matchesPriority;
  });

  const priorityOrder: ('alta' | 'média' | 'baixa')[] = ['alta', 'média', 'baixa'];

  const groupedTasks = priorityOrder.map(priority => ({
    priority,
    tasks: filteredTasks.filter(task => task.priority === priority)
  }));

  const today = new Date();

  const hasOverdueTask = (tasks: Task[]) =>
    tasks.some(task => task.due_date && !task.completed && new Date(task.due_date) < today);

  const sortedGroupedTasks = [...groupedTasks].sort((a, b) => {
    const aOverdue = hasOverdueTask(a.tasks);
    const bOverdue = hasOverdueTask(b.tasks);

    if (aOverdue && !bOverdue) return -1;
    if (!aOverdue && bOverdue) return 1;

    if (priorityFilter !== 'todas') {
      if (a.priority === priorityFilter) return -1;
      if (b.priority === priorityFilter) return 1;
    }

    return priorityOrder.indexOf(a.priority) - priorityOrder.indexOf(b.priority);
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <>
      <Header/>

      <main className={styles.dashboard}>


        <SearchBar
          query={query}
          onChange={setQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          priorityFilter={priorityFilter}
          onPriorityFilterChange={setPriorityFilter}
        >
          <AddTaskForm onSubmit={createTask} />
        </SearchBar>

        <div className={styles.taskToolBar}>
          <h1 className={styles.title}>Suas Tarefas</h1>
          <TaskFilters
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            priorityFilter={priorityFilter}
            onPriorityFilterChange={setPriorityFilter}
          />
        </div>

        {sortedGroupedTasks.map(group => (
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
