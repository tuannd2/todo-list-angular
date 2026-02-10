import { Injectable, signal } from '@angular/core';
import { Toast, ToastType } from '../models/toast.model';

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly #toasts$ = signal<Toast[]>([]);
  #id = 0;

  public readonly toasts$ = this.#toasts$.asReadonly();

  public show(message: string, type: ToastType = 'info', duration = 2500): void {
    const toast: Toast = {
      id: ++this.#id,
      message,
      type,
    };

    this.#toasts$.update((t) => [...t, toast]);

    setTimeout(() => {
      this.#toasts$.update((t) => t.filter((i) => i.id !== toast.id));
    }, duration);
  }
}
