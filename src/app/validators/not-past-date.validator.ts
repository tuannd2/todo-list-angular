import { AbstractControl, ValidationErrors } from '@angular/forms';

export function notPastDate(control: AbstractControl): ValidationErrors | null {
  const value = control.value;

  if (!value) return null;

  const normalized = value.includes('T') ? value : `${value}T00:00`;

  const inputDate = new Date(normalized);
  if (isNaN(inputDate.getTime())) return { pastDate: true };

  return inputDate >= new Date() ? null : { pastDate: true };
}
