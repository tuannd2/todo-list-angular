import { Component, inject } from '@angular/core';
import { TodoService } from '../../services/todo.service';
import { TodoItem } from '../todo-item/todo-item';

@Component({
  selector: 'app-todo-list',
  imports: [TodoItem],
  templateUrl: './todo-list.html',
  styleUrl: './todo-list.scss',
})
export class TodoList {
  private readonly store = inject(TodoService);

  readonly unfinishedItems = this.store.unfinishedItems;
  readonly finishedItems = this.store.finishedItems;
}
