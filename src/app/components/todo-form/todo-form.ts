import { Component, effect, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TodoService } from '../../services/todo.service';
import { TodoModel } from '../../models/todo.model';
import { DAY, type Priority, PRIORITY } from '../../constant';

@Component({
  selector: 'app-todo-form',
  imports: [ReactiveFormsModule],
  templateUrl: './todo-form.html',
  styleUrl: './todo-form.scss',
})


export class TodoForm {
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(TodoService);

  PRIORITY = PRIORITY;

  todo = input<TodoModel | null>(null);
  done = output<void>();

  readonly form = this.fb.nonNullable.group({
    summary: ['', [Validators.required, Validators.maxLength(30)]],
    description: [''],
    priority: [PRIORITY.MEDIUM as Priority],
    completeBy: [undefined as string | undefined],
  });

  constructor() {
    effect(() => {
      if (this.todo()) {
        this.form.patchValue({ ...this.todo()!, completeBy: this.todo()!.completeBy.toISOString().split('T')[0] });
      } else {
        this.form.reset({
          summary: '',
          description: '',
          priority: PRIORITY.MEDIUM,
          completeBy: '',
        });
      }
    })
  }

  submit() {
    if (this.form.invalid) return;

    const value = {
      ...this.form.getRawValue(),
      completeBy: this.form.value.completeBy ? new Date(this.form.value.completeBy + 'T00:00:00') : new Date(Date.now() + 3 * DAY),
    }

    if (this.todo()) {
      this.store.update(this.todo()!.id, value);
    } else {
      this.store.create(value);
    }

    this.done.emit();
  }
}
