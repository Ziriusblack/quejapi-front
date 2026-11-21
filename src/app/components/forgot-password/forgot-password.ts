import { Component, OnDestroy, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PasswordResetService } from '../../services/password-reset-service';

@Component({
  selector: 'app-forgot-password',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password.html'
})
export class ForgotPassword implements OnDestroy {
  private service = inject(PasswordResetService);

  step: 1 | 2 | 3 = 1; // 1 = correo, 2 = código + contraseña nueva, 3 = listo
  isLoading = false;
  errorMessage: string | null = null;
  showPassword = false;
  cooldown = 0; // segundos restantes para poder reenviar
  private timer: ReturnType<typeof setInterval> | null = null;

  emailForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  });

  resetForm = new FormGroup({
    code: new FormControl('', [Validators.required, Validators.pattern(/^\d{6}$/)]),
    newPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
    confirmPassword: new FormControl('', [Validators.required])
  });

  get email(): string {
    return (this.emailForm.value.email || '').trim();
  }

  get passwordsMatch(): boolean {
    return this.resetForm.value.newPassword === this.resetForm.value.confirmPassword;
  }

  sendCode() {
    if (this.emailForm.invalid || this.isLoading) return;
    this.errorMessage = null;
    this.isLoading = true;

    this.service.forgotPassword(this.email).subscribe({
      next: () => {
        this.isLoading = false;
        this.step = 2;
        this.startCooldown();
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'No se pudo enviar el código. Intenta de nuevo en unos segundos.';
      }
    });
  }

  resetPassword() {
    if (this.resetForm.invalid || !this.passwordsMatch || this.isLoading) return;
    this.errorMessage = null;
    this.isLoading = true;
    const { code, newPassword } = this.resetForm.value;

    this.service.resetPassword(this.email, code || '', newPassword || '').subscribe({
      next: () => {
        this.isLoading = false;
        this.step = 3;
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err?.error?.message || 'No se pudo cambiar la contraseña. Intenta de nuevo.';
      }
    });
  }

  changeEmail() {
    this.step = 1;
    this.errorMessage = null;
  }

  private startCooldown() {
    this.cooldown = 60;
    if (this.timer) clearInterval(this.timer);
    this.timer = setInterval(() => {
      this.cooldown--;
      if (this.cooldown <= 0 && this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    }, 1000);
  }

  ngOnDestroy() {
    if (this.timer) clearInterval(this.timer);
  }
}
