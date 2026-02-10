import { Component, inject, signal } from '@angular/core';
import { TodoService } from '../../services/todo.service';
import { TodoItem } from '../todo-item/todo-item';
import { TodoForm } from '../todo-form/todo-form';

@Component({
  selector: 'app-todo-list',
  imports: [TodoItem, TodoForm],
  templateUrl: './todo-list.html',
  styleUrl: './todo-list.scss',
})
export class TodoList {
  readonly #store = inject(TodoService);

  public readonly unfinishedItems$ = this.#store.unfinishedItems$;
  public readonly finishedItems$ = this.#store.finishedItems$;
  public readonly editingId$ = signal<string | null>(null);
  public readonly isCreating$ = signal(false);

  public startCreate(): void {
    this.isCreating$.set(true);
  }

  public cancelCreate(): void {
    this.isCreating$.set(false);
  }

  public startEdit(id: string): void {
    console.log('Editing', id);
    this.editingId$.set(id);
  }

  public cancelEdit(): void {
    this.editingId$.set(null);
  }
}
