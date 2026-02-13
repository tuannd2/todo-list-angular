import { TodoModel } from '../models/todo.model';

export function todoSortFn(a: TodoModel, b: TodoModel): number {
  if (a.priority !== b.priority) return a.priority - b.priority;

  return a.completeBy.localeCompare(b.completeBy);
}
