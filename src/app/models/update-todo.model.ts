import { TodoModel } from "./todo.model";

export type UpdateTodoModel = Partial<Omit<TodoModel, 'id'>>;
