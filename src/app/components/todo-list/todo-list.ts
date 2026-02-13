import { Component, computed, inject, signal } from '@angular/core';
import { TodoService } from '../../services/todo.service';
import { TodoItem } from '../todo-item/todo-item';
import { TodoFormComponent } from '../todo-form/todo-form';
import { todoSortFn } from '../../utils/todo.utils';

@Component({
  selector: 'app-todo-list',
  imports: [TodoItem, TodoFormComponent],
  templateUrl: './todo-list.html',
  styleUrl: './todo-list.scss',
})
export class TodoList {
  readonly #store = inject(TodoService);

  public readonly unfinishedItems$ = computed(() =>
    this.#store
      .items$()
      .filter((i) => !i.isCompleted)
      .sort(todoSortFn),
  );

  public readonly finishedItems$ = computed(() =>
    this.#store.items$().filter((i) => i.isCompleted),
  );
  protected readonly editingId$ = signal<string | null>(null);
  protected readonly isCreating$ = signal<boolean>(false);

  protected startCreate(): void {
    this.isCreating$.set(true);
  }

  protected cancelCreate(): void {
    this.isCreating$.set(false);
  }

  protected startEdit(id: string): void {
    this.editingId$.set(id);
  }

  protected cancelEdit(): void {
    this.editingId$.set(null);
  }
}
