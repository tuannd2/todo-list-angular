import { Component, signal } from '@angular/core';
import { TodoList } from './components/todo-list/todo-list';
import { Toast } from './components/toast/toast';
import { Loading } from './components/loading/loading';

@Component({
  selector: 'app-root',
  imports: [TodoList, Toast, Loading],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title$ = signal('todo-list');
}
