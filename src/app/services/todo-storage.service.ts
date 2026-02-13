import { effect, Injectable, Signal } from '@angular/core';
import { TodoModel } from '../models/todo.model';

@Injectable({
  providedIn: 'root',
})
export class TodoStorageService {
  readonly #storageKey = 'todoItems';

  public load(): TodoModel[] {
    try {
      const data = sessionStorage.getItem(this.#storageKey);

      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load todo items from session storage:', error);
      return [];
    }
  }

  public save(items: TodoModel[]): void {
    effect(() => {
      try {
        const data = JSON.stringify(items);
        sessionStorage.setItem(this.#storageKey, data);
      } catch (error) {
        console.error('Failed to save todo items to session storage:', error);
      }
    });
  }
}
