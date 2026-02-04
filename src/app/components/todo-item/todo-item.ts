import { Component, inject, input, output } from '@angular/core';
import { TodoService } from '../../services/todo.service';
import { TodoModel } from '../../models/todo.model';
import { DAY } from '../../constant';

@Component({
  selector: 'app-todo-item',
  imports: [],
  templateUrl: './todo-item.html',
  styleUrl: './todo-item.scss',
})
export class TodoItem {
  item = input.required<TodoModel>();
  completed = input(false);

  edit = output<void>();

  private readonly store = inject(TodoService);

  get formattedDeadline() {
    const formatter = new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    return formatter.format(this.item().completeBy);
  }

  get deadlineState(): 'normal' | 'highlight' | 'overdue' {
    if (this.item().isCompleted || !this.item().completeBy) return 'normal';

    const diff = this.item().completeBy.getTime() - Date.now();

    if (diff < 0) return 'overdue';
    if (diff <= DAY) return 'highlight';

    return 'normal';
  }

  startEdit() {
    this.edit.emit();
  }

  deleteItem() {
    this.store.delete(this.item().id);
  }

  undoCompleted() {
    this.store.undoCompleted(this.item().id);
  }

  markCompleted() {
    this.store.markCompleted(this.item().id);
  }
}
