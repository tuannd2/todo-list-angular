import { computed, Injectable, signal } from '@angular/core';
import { TodoModel, UpdateTodoModel } from '../models/todo.model';
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

  create(item: Omit<TodoModel, 'id' | 'isCompleted'>) {
    const newItem = {
      ...item,
      id: crypto.randomUUID(),
      isCompleted: false,
    }

    this._items.update((items) => [
      ...items,
      newItem,
    ]);
  }

  update(id: string, changes: UpdateTodoModel) {
    this._items.update((items) => items.map((i) => (i.id === id ? { ...i, ...changes } : i)));
  }

  markCompleted(id: string) {
    this.update(id, {
      isCompleted: true,
    });
  }

  undoCompleted(id: string) {
    if (confirm('Are you sure you want to mark this item as unfinished?')) {
      this.update(id, {
        isCompleted: false,
      });
    }
  }

  delete(id: string) {
    if (confirm('Are you sure you want to delete this item?')) {
      this._items.update((items) => items.filter((i) => i.id !== id));
    }
  }

  private sortFn(a: TodoModel, b: TodoModel): number {
    if (a.priority !== b.priority) {
      return a.priority - b.priority;
    }

    return a.completeBy.localeCompare(b.completeBy);
  }
}
