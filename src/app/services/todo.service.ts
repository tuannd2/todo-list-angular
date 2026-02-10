import { computed, effect, Injectable, signal } from '@angular/core';
import { TodoModel, UpdateTodoModel } from '../models/todo.model';
import { ToastService } from './toast.service';
import { DELAY_MS } from '../constant';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private readonly _items = signal<TodoModel[]>([]);
  private readonly _isLoading = signal(false);
  readonly isLoading = this._isLoading.asReadonly();

  private async delay(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, DELAY_MS));
  }

  private async operation(fn: () => void): Promise<void> {
    try {
      this._isLoading.set(true);
      await this.delay();
      fn();
      this.toastService.show('Saved!', 'success');
    } catch (error) {
      console.error(error);
      this.toastService.show('Something went wrong!', 'error');
    } finally {
      this._isLoading.set(false);
    }
  }

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
      console.error('Failed to load todo items from session storage:', error);
    }
  }

  private saveToSession() {
    try {
      const data = JSON.stringify(this._items());
      sessionStorage.setItem('todoItems', data);
    } catch (error) {
      console.error('Failed to save todo items to session storage:', error);
    }
  }

  readonly items = this._items.asReadonly();

  readonly unfinishedItems = computed(() =>
    this.items()
      .filter((i) => !i.isCompleted)
      .sort(this.sortFn),
  );

  readonly finishedItems = computed(() => this.items().filter((i) => i.isCompleted));

  async create(item: Omit<TodoModel, 'id' | 'isCompleted'>) {
    await this.operation(async () => {
      const newItem = {
        ...item,
        id: crypto.randomUUID(),
        isCompleted: false,
      };
      this._items.update((items) => [...items, newItem]);
    });
  }

  async update(id: string, changes: UpdateTodoModel) {
    await this.operation(() => {
      this._items.update((items) => items.map((i) => (i.id === id ? { ...i, ...changes } : i)));
    });
  }

  async markCompleted(id: string) {
    await this.update(id, { isCompleted: true });
  }

  async undoCompleted(id: string) {
    if (confirm('Are you sure you want to mark this item as unfinished?')) {
      await this.update(id, { isCompleted: false });
    }
  }

  async delete(id: string) {
    if (confirm('Are you sure you want to delete this item?')) {
      await this.operation(() => {
        this._items.update((items) => items.filter((i) => i.id !== id));
      });
    }
  }

  private sortFn(a: TodoModel, b: TodoModel): number {
    if (a.priority !== b.priority) {
      return a.priority - b.priority;
    }

    return a.completeBy.localeCompare(b.completeBy);
  }
}
