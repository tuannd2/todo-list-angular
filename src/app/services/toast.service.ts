import { Injectable, signal } from '@angular/core';
import { Toast, ToastType } from '../models/toast.model';

@Injectable({ providedIn: 'root' })
export class ToastService {
    private _toasts = signal<Toast[]>([]);
    readonly toasts = this._toasts.asReadonly();

    private id = 0;

    show(message: string, type: ToastType = 'info', duration = 2500) {
        const toast: Toast = {
            id: ++this.id,
            message,
            type,
        };

        this._toasts.update((t) => [...t, toast]);

        setTimeout(() => {
            this._toasts.update((t) => t.filter((i) => i.id !== toast.id));
        }, duration);
    }
}
