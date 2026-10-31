import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

// Validador personalizado
export function passwordMatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const formGroup = control as FormGroup;
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;

    if (!password || !confirmPassword) {
      return null; // No validar si alguno está vacío
    }

    return password === confirmPassword ? null : { passwordMismatch: true };
  };
}
