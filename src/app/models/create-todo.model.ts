import { TodoModel } from "./todo.model";

export type CreateTodoModel = Omit<TodoModel, 'id' | 'isCompleted'>;