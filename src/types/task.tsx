export type Task = {
    id: number;
    title: string;
    description: string;
    completed: boolean;
    priority: 'baixa' | 'média' | 'alta';
    created_at: string;
    due_date?: string | null;
  };
  