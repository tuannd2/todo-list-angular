import { Component, inject, input, output } from '@angular/core';
import { TodoService } from '../../services/todo.service';
import { TodoModel } from '../../models/todo.model';
import { DatePipe } from '@angular/common';
import { toMinute } from '../../utils/datetime.utils';
import { minute_per_day } from '../../constant';

@Component({
  selector: 'app-todo-item',
  imports: [DatePipe],
  templateUrl: './todo-item.html',
  styleUrl: './todo-item.scss',
})
export class TodoItem {
  readonly #store = inject(TodoService);

  public readonly item = input.required<TodoModel>();
  public readonly completed = input(false);

  protected readonly edit = output<void>();

  protected get deadlineState(): 'normal' | 'highlight' | 'overdue' {
    const item = this.item();

    if (item.isCompleted || !item.completeBy) return 'normal';

    const nowMinute = toMinute(new Date());
    const deadlineMinute = toMinute(new Date(item.completeBy));

    const diffMinutes = deadlineMinute - nowMinute;

    if (diffMinutes < 0) return 'overdue';
    if (diffMinutes <= minute_per_day) return 'highlight'; // <= 1 day

    return 'normal';
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
