import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private authentication = inject(AuthService);
  private router = inject(Router);


  loginResquest = new FormGroup({
    email: new FormControl('',[ Validators.required, Validators.email]),
    password: new FormControl('',[ Validators.required, Validators.minLength(8)])
  });

  errorMessage: string | null = null; // Agrega variable para el mensaje de error
  isLoading: boolean = false; // Variable para el estado de carga

  onSubmit() {
    this.errorMessage = null; // Limpia el mensaje antes de intentar login
    this.isLoading = true; // Activa el estado de carga
    
    this.authentication.login(this.loginResquest.value.email||'', this.loginResquest.value.password||'').subscribe({
      next: (response) => {
        console.log('Login successful', response);
        this.isLoading = false; // Desactiva el estado de carga
        this.router.navigate([this.getUserHome()]); // Redirige a la página de inicio después del login exitoso
      },
      error: (error) => {
        console.error('Login failed', error);
        this.isLoading = false; // Desactiva el estado de carga
        this.errorMessage = 'Usuario o contraseña incorrectos intente nuevamente.'; // Mensaje de error
      }
    });
  }

  getUserHome(): string {
    const roles = this.authentication.getUserRoles(); 
    
    if (roles.includes('ADMINISTRATOR')) {
      return '/admin';
    }
    return '/user';
  }
}
