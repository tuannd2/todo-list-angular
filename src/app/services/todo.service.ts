import { computed, effect, Injectable, signal } from '@angular/core';
import { TodoModel, UpdateTodoModel } from '../models/todo.model';
import { ToastService } from './toast.service';
import { DELAY_MS } from '../constant';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  readonly #items$ = signal<TodoModel[]>([]);
  readonly #isLoading$ = signal(false);

  public readonly isLoading$ = this.#isLoading$.asReadonly();
  public readonly items$ = this.#items$.asReadonly();
  public readonly unfinishedItems$ = computed(() =>
    this.items$()
      .filter((i) => !i.isCompleted)
      .sort(this.#sortFn),
  );
  public readonly finishedItems$ = computed(() => this.items$().filter((i) => i.isCompleted));

  public constructor(private readonly toastService: ToastService) {
    // this.#loadFromSession();
    // effect(() => {
    //   this.#saveToSession();
    // });
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
    return new Promise((resolve) => setTimeout(resolve, DELAY_MS));
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

  #loadFromSession(): void {
    try {
      const data = sessionStorage.getItem('todoItems');
      if (data) {
        const items: TodoModel[] = JSON.parse(data);
        this.#items$.set(items);
      }
    } catch (error) {
      console.error('Failed to load todo items from session storage:', error);
    }
  }

  #saveToSession(): void {
    try {
      const data = JSON.stringify(this.#items$());
      sessionStorage.setItem('todoItems', data);
    } catch (error) {
      console.error('Failed to save todo items to session storage:', error);
    }
  }

  #sortFn(a: TodoModel, b: TodoModel): number {
    if (a.priority !== b.priority) {
      return a.priority - b.priority;
    }

    return a.completeBy.localeCompare(b.completeBy);
  }
}
