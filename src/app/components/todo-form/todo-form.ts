import { Component, effect, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TodoService } from '../../services/todo.service';
import { validateNotPastDate } from '../../validators/not-past-date.validator';
import { day } from '../../constant';
import { TodoModel } from '../../models/todo.model';
import { priority, Priority } from '../../models/priority.model';

@Component({
  selector: 'app-todo-form',
  imports: [ReactiveFormsModule],
  templateUrl: './todo-form.html',
  styleUrl: './todo-form.scss',
})
export class TodoFormComponent {
  readonly #fb = inject(FormBuilder);
  readonly #store = inject(TodoService);

  protected readonly isSubmitting = this.#store.isLoading$();
  protected readonly form = this.#fb.nonNullable.group({
    summary: ['', [Validators.required, Validators.maxLength(30)]],
    description: [''],
    priority: [priority.MEDIUM as Priority],
    completeBy: ['', [validateNotPastDate]],
  });

  protected PRIORITY = priority;

  public todo = input<TodoModel | null>(null);

  public formSubmitted = output<void>();

  constructor() {
    effect(() => {
      if (this.todo()) {
        this.form.patchValue(this.todo()!);
      } else {
        this.form.reset();
      }
    });
  }

  protected hasError(controlName: keyof typeof this.form.controls): boolean {
    const control = this.form.get(controlName);

    if (!control) return false;

    return control.invalid && !control.pending && (control.dirty || control.touched);
  }

  protected getErrorMessage(controlName: keyof typeof this.form.controls): string {
    const control = this.form.get(controlName);

    if (!control) return '';

    if (control.hasError('required')) return 'This field is required.';

    if (control.hasError('maxlength'))
      return `Maximum length is ${control.getError('maxlength')?.requiredLength} characters.`;

    if (control.hasError('pastDate')) return 'The date cannot be in the past.';

    return 'Invalid field.';
  }

  protected async submit(): Promise<void> {
    if (this.form.invalid || this.form.pending) return;

    const value = {
      ...this.form.getRawValue(),
      completeBy:
        this.form.value.completeBy || new Date(Date.now() + 3 * day).toISOString().slice(0, 16),
    };

    if (this.todo()) {
      await this.#store.update(this.todo()!.id, value);
    } else {
      await this.#store.create(value);
    }

    this.formSubmitted.emit();
  }
}
