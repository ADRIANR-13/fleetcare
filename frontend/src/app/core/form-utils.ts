import { AbstractControl } from '@angular/forms';

export function errorCampo(c: AbstractControl | null): string {
  if (!c || !c.errors || !(c.touched || c.dirty)) return '';
  const e = c.errors;
  if (e['required']) return 'Este campo es obligatorio';
  if (e['minlength']) return `Mínimo ${e['minlength'].requiredLength} caracteres`;
  if (e['maxlength']) return `Máximo ${e['maxlength'].requiredLength} caracteres`;
  if (e['min']) return `El valor mínimo es ${e['min'].min}`;
  if (e['max']) return `El valor máximo es ${e['max'].max}`;
  return 'Valor no válido';
}