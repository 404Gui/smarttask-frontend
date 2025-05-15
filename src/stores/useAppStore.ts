import { create } from "zustand";
import { Task } from "@/types/task";
import { List } from "@/types/list";
import api from "@/services/api";
import Cookies from "js-cookie";
import { getLists } from "@/services/lists";
import { toast } from "sonner";

interface AppStore {
  tasks: Task[];
  lists: List[];
  fetchTasks: () => Promise<void>;
  fetchLists: () => Promise<void>;
  setTasks: (tasks: Task[]) => void;
  setLists: (lists: List[]) => void;
  updateTask: (updated: Task) => void;
  deleteTask: (id: number) => void;
  addTask: (task: Task) => void;
  createTask: (data: { title: string; description: string; priority: string }) => Promise<void>;
  editTask: (updated: Task) => Promise<void>;
  toggleTask: (task: Task) => Promise<void>;
}

export const useAppStore = create<AppStore>((set, get) => ({
  tasks: [],
  lists: [],

  setTasks: (tasks) => set({ tasks }),
  setLists: (lists) => set({ lists }),

  fetchTasks: async () => {
    try {
      const token = Cookies.get("token");
      const res = await api.get("/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ tasks: res.data });
    } catch (err) {
      console.error("Erro ao buscar tarefas");
    }
  },

  fetchLists: async () => {
    try {
      const data = await getLists();
      set({ lists: data });
    } catch (err) {
      console.error("Erro ao buscar listas");
    }
  },

  addTask: (task) => {
    set((state) => ({
      tasks: [...state.tasks, task],
    }));
  },

  updateTask: (updated) => {
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === updated.id ? updated : t)),
    }));
  },

  deleteTask: async (id) => {
    try {
      const token = Cookies.get("token");
      await api.delete(`/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== id),
      }));
    } catch (err) {
      console.error("Erro ao deletar tarefa");
    }
  },

  createTask: async (data) => {
    try {
      const token = Cookies.get("token");
      const res = await api.post("/tasks", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      get().addTask(res.data);
      toast.success("Tarefa adicionada!");
    } catch (err) {
      console.error("Erro ao criar tarefa");
      toast.error("Não foi possível criar a tarefa.");
    }
  },

  editTask: async (updated) => {
    try {
      const token = Cookies.get("token");
      const res = await api.put(`/tasks/${updated.id}`, updated, {
        headers: { Authorization: `Bearer ${token}` },
      });
      get().updateTask(res.data);
      toast.success("Tarefa atualizada!");
    } catch (err) {
      console.error("Erro ao editar tarefa");
      toast.error("Não foi possível editar a tarefa.");
    }
  },

  toggleTask: async (task) => {
    try {
      const token = Cookies.get("token");
      const res = await api.put(
        `/tasks/${task.id}`,
        { completed: !task.completed },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      get().updateTask(res.data);
    } catch (err) {
      console.error("Erro ao atualizar tarefa");
    }
  },
}));
