import { computed, effect, Injectable, signal } from '@angular/core';
import { ToastService } from './toast.service';
import { delay_ms } from '../constant';
import { TodoModel } from '../models/todo.model';
import { UpdateTodoModel } from '../models/update-todo.model';
import { TodoStorageService } from './todo-storage.service';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  readonly #items$ = signal<TodoModel[]>([]);
  readonly #isLoading$ = signal(false);

  public readonly isLoading$ = this.#isLoading$.asReadonly();
  public readonly items$ = this.#items$.asReadonly();

  public constructor(
    private readonly toastService: ToastService,
    private readonly todoStorageService: TodoStorageService,
  ) {
    this.#items$.set(this.todoStorageService.load());

    this.todoStorageService.save(this.#items$().filter((i) => !i.isCompleted));
  }

  public async create(item: Omit<TodoModel, 'id' | 'isCompleted'>): Promise<void> {
    await this.#operation(async () => {
      const newItem = {
        ...item,
        id: crypto.randomUUID(),
        isCompleted: false,
      };
      this.#items$.update((items) => [...items, newItem]);
    });
  }

  public async update(id: string, changes: UpdateTodoModel): Promise<void> {
    await this.#operation(() => {
      this.#items$.update((items) => items.map((i) => (i.id === id ? { ...i, ...changes } : i)));
    });
  }

  public async markCompleted(id: string): Promise<void> {
    await this.update(id, { isCompleted: true });
  }

  public async undoCompleted(id: string): Promise<void> {
    if (confirm('Are you sure you want to mark this item as unfinished?')) {
      await this.update(id, { isCompleted: false });
    }
  }

  public async delete(id: string): Promise<void> {
    if (confirm('Are you sure you want to delete this item?')) {
      await this.#operation(() => {
        this.#items$.update((items) => items.filter((i) => i.id !== id));
      });
    }
  }

  #delay(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, delay_ms));
  }

  #operation(fn: () => void): Promise<void> {
    return (async (): Promise<void> => {
      try {
        this.#isLoading$.set(true);
        await this.#delay();
        fn();
        this.toastService.show('Saved!', 'success');
      } catch (error) {
        console.error(error);
        this.toastService.show('Something went wrong!', 'error');
      } finally {
        this.#isLoading$.set(false);
      }
    })();
  }
}
