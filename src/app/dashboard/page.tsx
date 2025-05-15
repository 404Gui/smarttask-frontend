"use client";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import styles from "./Dashboard.module.css";
import api from "@/services/api";
import { toast } from "sonner";
import { Task } from "@/types/task";
import Header from "@/components/Header/Header";
import SearchBar from "@/components/SearchBar/SearchBar";
import AddTaskForm from "@/components/AddTaskForm/AddTaskForm";
import TaskFilters from "@/components/TaskFilters/TaskFilters";
import PriorityAccordion from "@/components/PriorityAccordion/PriorityAccordion";
import SectionTabs from "@/components/SectionTabs/SectionTabs";
import ListSection from "@/components/SectionTabs/ListSection/ListSection";
import LoadingOverlay from "@/components/LoadingOverlay/LoadingOverlay";
import TaskItemOverlay from "@/components/SectionTabs/TaskSection/TaskItemOverlay";

import {
  DndContext,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
  closestCenter,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";

import { useAppStore } from "@/stores/useAppStore";

export default function DashboardPage() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("todas");
  const [priorityFilter, setPriorityFilter] = useState("todas");
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [section, setSection] = useState<"tasks" | "lists">("tasks");

  const {
    tasks,
    lists,
    fetchTasks,
    fetchLists,
    addTask,
    updateTask,
    deleteTask,
    createTask,
    editTask,
    toggleTask,
    setTasks,
  } = useAppStore();

  useEffect(() => {
    fetchTasks();
    fetchLists();
  }, []);

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
      <LoadingOverlay show={isLoading} mensagem={"Atualizando tarefa"} />

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
        
        <SectionTabs activeSection={section} onChange={setSection} />

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

          {section === "tasks" ? (
            <>
              <div className={styles.taskToolBar}>
                <h1 className={styles.title}>Suas Tarefas</h1>
                <TaskFilters
                  statusFilter={statusFilter}
                  onStatusFilterChange={setStatusFilter}
                  priorityFilter={priorityFilter}
                  onPriorityFilterChange={setPriorityFilter}
                />
              </div>

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
            </>
          ) : section === "lists" ? (
            <ListSection lists={lists} refreshLists={fetchLists} />
          ) : null}
        </DndContext>
      </main>
    </>
  );
}
