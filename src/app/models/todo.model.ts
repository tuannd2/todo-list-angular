import { Priority } from '../constant';

export type TodoModel = {
  id: string;
  summary: string;
  description?: string;
  priority: Priority;
  isCompleted: boolean;
  completeBy: string;
};

export type CreateTodoModel = Omit<TodoModel, 'id' | 'isCompleted'>;

export type UpdateTodoModel = Partial<Omit<TodoModel, 'id'>>;