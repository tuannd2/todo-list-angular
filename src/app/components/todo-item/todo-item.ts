import { Component, inject, input } from '@angular/core';
import { TodoService } from '../../services/todo.service';
import { TodoModel } from '../../models/todo.model';

@Component({
  selector: 'app-todo-item',
  imports: [],
  templateUrl: './todo-item.html',
  styleUrl: './todo-item.scss',
})
export class TodoItem {
  item = input.required<TodoModel>();
  completed = input(false);

  private readonly store = inject(TodoService);

  get formattedDeadline() {
    const formatter = new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    return formatter.format(this.item().completeBy);
  }

  isHighlighted(): boolean {
    if (this.item().isCompleted || this.item().priority !== 1 || !this.item().completeBy) {
      return false;
    }

    const diff = this.item().completeBy.getTime() - Date.now();

    return diff <= 24 * 60 * 60 * 1000;
  }
}
