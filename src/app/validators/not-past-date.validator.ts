import { AbstractControl, ValidationErrors } from '@angular/forms';
import { toMinute } from '../utils/datetime.utils';

export function validateNotPastDate(control: AbstractControl): ValidationErrors | null {
  const value = control.value;

  if (!value) return null;

  const inputTime = new Date(value);

  return toMinute(inputTime) < toMinute(new Date()) ? { pastDate: true } : null;
}
