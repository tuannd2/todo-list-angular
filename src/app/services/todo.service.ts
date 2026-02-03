import { computed, Injectable, signal } from '@angular/core';
import { TodoModel } from '../models/todo.model';
import { TODO_MOCK_DATA } from '../mocks/todo.mock';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private readonly _items = signal<TodoModel[]>([]);

  constructor() {
    this._items.set(TODO_MOCK_DATA);
  }

  readonly items = this._items.asReadonly();

  readonly unfinishedItems = computed(() =>
    this.items()
      .filter((i) => !i.isCompleted)
      .sort(this.sortFn),
  );

  readonly finishedItems = computed(() => this.items().filter((i) => i.isCompleted));

  create(item: Omit<TodoModel, 'id' | 'isCompleted'>): boolean {
    try {
      this._items.update((items) => [
        ...items,
        {
          ...item,
          id: crypto.randomUUID(),
          isCompleted: false,
        },
      ]);
      return true;
    } catch {
      return false;
    }
  }

  update(id: string, changes: Partial<TodoModel>) {
    this._items.update((items) => items.map((i) => (i.id === id ? { ...i, ...changes } : i)));
  }

  markCompleted(id: string) {
    this.update(id, {
      isCompleted: true,
    });
  }

  delete(id: string) {
    this._items.update((items) => items.filter((i) => i.id !== id));
  }

  private sortFn(a: TodoModel, b: TodoModel): number {
    if (a.priority !== b.priority) {
      return a.priority - b.priority;
    }

    return a.completeBy.getTime() - b.completeBy.getTime();
  }
}
