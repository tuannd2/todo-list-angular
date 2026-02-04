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
  private readonly store = inject(TodoService);

  readonly unfinishedItems = this.store.unfinishedItems;
  readonly finishedItems = this.store.finishedItems;

  readonly editingId = signal<string | null>(null);
  readonly isCreating = signal(false);

  startCreate() {
    this.isCreating.set(true);
  }

  cancelCreate() {
    this.isCreating.set(false);
  }

  startEdit(id: string) {
    console.log('Editing', id);
    this.editingId.set(id);
  }

  cancelEdit() {
    this.editingId.set(null);
  }
}
