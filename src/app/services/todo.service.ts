import { computed, effect, Injectable, signal } from '@angular/core';
import { TodoModel, UpdateTodoModel } from '../models/todo.model';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private readonly _items = signal<TodoModel[]>([]);

  constructor(private readonly toastService: ToastService) {
    this.loadFromSession();

    effect(() => {
      this.saveToSession();
    });
  }

  private loadFromSession() {
    try {
      const data = sessionStorage.getItem('todoItems');
      if (data) {
        const items: TodoModel[] = JSON.parse(data);
        this._items.set(items);
      }
    } catch (error) {
      console.error('Failed to load todo items from session storage:', error)
    }
  }

  private saveToSession() {
    try {
      const data = JSON.stringify(this._items());
      sessionStorage.setItem('todoItems', data);
    } catch (error) {
      console.error('Failed to save todo items to session storage:', error)
    }
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

    this.toastService.show('Item created successfully.', 'success');

  }

  update(id: string, changes: UpdateTodoModel) {
    this._items.update((items) => items.map((i) => (i.id === id ? { ...i, ...changes } : i)));

    this.toastService.show('Item updated successfully.', 'success');
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

    this.toastService.show('Todo item deleted successfully.', 'success');

  }

  private sortFn(a: TodoModel, b: TodoModel): number {
    if (a.priority !== b.priority) {
      return a.priority - b.priority;
    }

    return a.completeBy.localeCompare(b.completeBy);
  }
}
