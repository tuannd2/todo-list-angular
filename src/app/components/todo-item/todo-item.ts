import { Component, inject, input, output } from '@angular/core';
import { TodoService } from '../../services/todo.service';
import { TodoModel } from '../../models/todo.model';
import { day } from '../../constant';

@Component({
  selector: 'app-todo-item',
  imports: [],
  templateUrl: './todo-item.html',
  styleUrl: './todo-item.scss',
})
export class TodoItem {
  readonly #store = inject(TodoService);

  protected readonly item = input.required<TodoModel>();
  protected readonly completed = input(false);

  protected readonly edit = output<void>();

  protected get deadlineState(): 'normal' | 'highlight' | 'overdue' {
    if (this.item().isCompleted || !this.item().completeBy) return 'normal';

    const diff = new Date(this.item().completeBy).getTime() - Date.now();

    if (diff < 0) return 'overdue';
    if (diff <= day) return 'highlight';

    return 'normal';
  }

  protected get formattedCompletedBy(): string {
    const date = new Date(this.item().completeBy);

    if (isNaN(date.getTime())) return '';

    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  }

  protected startEdit(): void {
    this.edit.emit();
  }

  protected deleteItem(): void {
    this.#store.delete(this.item().id);
  }

  protected undoCompleted(): void {
    this.#store.undoCompleted(this.item().id);
  }

  protected markCompleted(): void {
    this.#store.markCompleted(this.item().id);
  }
}
