import { Component, effect, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TodoService } from '../../services/todo.service';
import { TodoModel } from '../../models/todo.model';
import { DAY, type Priority, PRIORITY } from '../../constant';
import { validateNotPastDate } from '../../validators/not-past-date.validator';

@Component({
  selector: 'app-todo-form',
  imports: [ReactiveFormsModule],
  templateUrl: './todo-form.html',
  styleUrl: './todo-form.scss',
})
export class TodoForm {
  readonly #fb = inject(FormBuilder);
  readonly #store = inject(TodoService);

  public readonly isSubmitting = this.#store.isLoading$();
  public readonly form = this.#fb.nonNullable.group(
    {
      summary: ['', [Validators.required, Validators.maxLength(30)]],
      description: [''],
      priority: [PRIORITY.MEDIUM as Priority],
      completeBy: ['', [validateNotPastDate]],
    },
    {
      updateOn: 'change',
    },
  );

  public PRIORITY = PRIORITY;

  public todo = input<TodoModel | null>(null);

  public done = output<void>();

  public constructor() {
    effect(() => {
      if (this.todo()) {
        this.form.patchValue(this.todo()!);
      } else {
        this.form.reset({
          summary: '',
          description: '',
          priority: PRIORITY.MEDIUM,
          completeBy: '',
        });
      }
    });
  }

  public hasError(controlName: keyof typeof this.form.controls): boolean {
    const control = this.form.controls[controlName];

    return control.invalid && (control.dirty || control.touched);
  }

  public getErrorMessage(controlName: keyof typeof this.form.controls): string {
    const control = this.form.controls[controlName];

    if (!control.errors) return '';

    if (control.errors?.['required']) return 'This field is required.';
    if (control.errors?.['maxlength'])
      return `Maximum length is ${control.errors['maxlength'].requiredLength} characters.`;
    if (control.errors?.['pastDate']) return 'The date cannot be in the past.';

    return 'Invalid field.';
  }

  public async submit(): Promise<void> {
    if (this.form.invalid) return;

    const value = {
      ...this.form.getRawValue(),
      completeBy:
        this.form.value.completeBy || new Date(Date.now() + 3 * DAY).toISOString().slice(0, 16),
    };

    if (this.todo()) {
      await this.#store.update(this.todo()!.id, value);
    } else {
      await this.#store.create(value);
    }

    this.done.emit();
  }
}
