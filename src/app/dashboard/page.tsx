"use client";
import { useEffect, useState } from "react";
import api from "@/services/api";
import Cookies from "js-cookie";
import TaskItem from "@/components/TaskItem/TaskItem";
import AddTaskForm from "@/components/AddTaskForm/AddTaskForm";
import styles from "./Dashboard.module.css";
import SearchBar from "@/components/SearchBar/SearchBar";
import Header from "@/components/Header/Header";
import { Task } from "@/types/task";
import PriorityAccordion from "@/components/PriorityAccordion/PriorityAccordion";
import { toast } from "sonner";
import TaskFilters from "@/components/TaskFilters/TaskFilters";

import {
  DndContext,
  closestCenter,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import TaskItemOverlay from "@/components/TaskItem/TaskItemOverlay";
import LoadingOverlay from "@/components/LoadingSpinner/LoadingOverlay";

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("todas");
  const [priorityFilter, setPriorityFilter] = useState("todas");
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTasks = async () => {
    try {
      const token = Cookies.get("token");
      const res = await api.get("/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
    } catch (err) {
      console.error("Erro ao buscar tarefas");
    }
  };

  const createTask = async (data: {
    title: string;
    description: string;
    priority: string;
  }) => {
    try {
      const token = Cookies.get("token");
      const res = await api.post("/tasks", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks((prev) => [...prev, res.data]);
      toast.success("Tarefa adicionada!");
    } catch (err) {
      console.error("Erro ao criar tarefa");
      toast.error(
        "Ops! Isso não era pra ter acontecido. Entre em contato com o administrador."
      );
    }
  };

  const editTask = async (updatedTask: Task) => {
    try {
      const token = Cookies.get("token");
      const res = await api.put(`/tasks/${updatedTask.id}`, updatedTask, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks((prev) =>
        prev.map((t) => (t.id === updatedTask.id ? res.data : t))
      );
      toast.success("Tarefa atualizada!");
    } catch (err) {
      console.error("Erro ao editar tarefa");
      toast.error("Não foi possível editar a tarefa.");
    }
  };

  const deleteTask = async (id: number) => {
    try {
      const token = Cookies.get("token");
      await api.delete(`/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (err) {
      console.error("Erro ao deletar tarefa");
    }
  };

  const toggleTask = async (task: Task) => {
    try {
      const token = Cookies.get("token");
      const res = await api.put(
        `/tasks/${task.id}`,
        { completed: !task.completed },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks((prev) => prev.map((t) => (t.id === task.id ? res.data : t)));
    } catch (err) {
      console.error("Erro ao atualizar tarefa");
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesQuery = task.title.toLowerCase().includes(query.toLowerCase());

    const matchesStatus =
      statusFilter === "todas" ||
      (statusFilter === "pendentes" && !task.completed) ||
      (statusFilter === "concluidas" && task.completed) ||
      (statusFilter === "vencidas" &&
        !task.completed &&
        task.due_date &&
        new Date(task.due_date) < new Date());

    const matchesPriority =
      priorityFilter === "todas" || task.priority === priorityFilter;

    return matchesQuery && matchesStatus && matchesPriority;
  });

  const priorityOrder: ("alta" | "média" | "baixa")[] = [
    "alta",
    "média",
    "baixa",
  ];

  const groupedTasks = priorityOrder.map((priority) => ({
    priority,
    tasks: filteredTasks.filter((task) => task.priority === priority),
  }));

  const today = new Date();

  const hasOverdueTask = (tasks: Task[]) =>
    tasks.some(
      (task) =>
        task.due_date && !task.completed && new Date(task.due_date) < today
    );

  const sortedGroupedTasks = [...groupedTasks].sort((a, b) => {
    const aOverdue = hasOverdueTask(a.tasks);
    const bOverdue = hasOverdueTask(b.tasks);

    if (aOverdue && !bOverdue) return -1;
    if (!aOverdue && bOverdue) return 1;

    if (priorityFilter !== "todas") {
      if (a.priority === priorityFilter) return -1;
      if (b.priority === priorityFilter) return 1;
    }

    return (
      priorityOrder.indexOf(a.priority) - priorityOrder.indexOf(b.priority)
    );
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDragStart = (event: DragStartEvent) => {
    const taskId = Number(event.active.id);
    const task = tasks.find((t) => t.id === taskId);
    if (task) setActiveTask(task);
  };

  const handleDragOver = (event: any) => {
    const over = event.over;
    if (!over) {
      setOverId(null);
      return;
    }

    const id = over.id;

    if (typeof id === "number") {
      const task = tasks.find((t) => t.id === id);
      if (task) {
        setOverId(task.priority);
        return;
      }
    }

    if (typeof id === "string" && ["alta", "média", "baixa"].includes(id)) {
      setOverId(id);
      return;
    }

    setOverId(null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setOverId(null);
      return;
    }

    const activeTaskId = Number(active.id);
    const activeTask = tasks.find((t) => t.id === activeTaskId);
    if (!activeTask) {
      setOverId(null);
      return;
    }

    const overId = over.id;
    const overTask = tasks.find((t) => t.id === Number(overId));

    if (overTask) {
      if (activeTask.priority === overTask.priority) {
        const priority = activeTask.priority;
        const filtered = tasks.filter((t) => t.priority === priority);
        const oldIndex = filtered.findIndex((t) => t.id === activeTaskId);
        const newIndex = filtered.findIndex((t) => t.id === overTask.id);

        const reordered = [...filtered];
        const [moved] = reordered.splice(oldIndex, 1);
        reordered.splice(newIndex, 0, moved);

        const remaining = tasks.filter((t) => t.priority !== priority);
        setTasks([...remaining, ...reordered]);

        setOverId(null);
        return;
      }

      setIsLoading(true);
      await editTask({ ...activeTask, priority: overTask.priority });
      setIsLoading(false);

      setOverId(null);
      return;
    }

    const isPriorityDrop =
      typeof overId === "string" && ["alta", "média", "baixa"].includes(overId);

    if (isPriorityDrop && activeTask.priority !== overId) {
      setIsLoading(true);
      await editTask({ ...activeTask, priority: overId as Task["priority"] });
      setIsLoading(false);
    }

    setOverId(null);
  };

  return (
    <>
      <Header />
      <LoadingOverlay show={isLoading} />

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

        <DndContext
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={(e) => {
            handleDragEnd(e);
            setActiveTask(null);
          }}
          modifiers={[restrictToVerticalAxis]}
        >
          <DragOverlay>
            {activeTask ? <TaskItemOverlay task={activeTask} /> : null}
          </DragOverlay>

          {sortedGroupedTasks.map((group) => (
            <PriorityAccordion
              key={group.priority}
              priority={group.priority}
              tasks={group.tasks}
              onDelete={deleteTask}
              onToggle={toggleTask}
              onEdit={editTask}
              activeTask={activeTask}
              overId={overId}
            />
          ))}
        </DndContext>
      </main>
    </>
  );
}
