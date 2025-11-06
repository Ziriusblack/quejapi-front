import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../../services/auth-service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RegisterRequest } from '../../../models/register-request';
import { ActivatedRoute, Router, ActivatedRouteSnapshot, Params} from '@angular/router';
import { passwordMatchValidator } from '../../../shared/validators/password-match-validator';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  private authService = inject(AuthService);
  private router = inject(Router);
  role = signal(0);
  private activatedRoute = inject(ActivatedRoute);
  errorMessage: string | null = null; // Agrega variable para el mensaje de error

  genderOptions = [
    {label:"Masculino", value:0},
    {label:"Femenino", value:1},
    {label:"Otro", value:2}
  ];

  registerForm = new FormGroup({
    firstname: new FormControl('',[ Validators.required, Validators.minLength(2)]),
    lastname: new FormControl('',[ Validators.required, Validators.minLength(2)]),
    email: new FormControl('',[ Validators.required, Validators.email]),
    password: new FormControl('',[ Validators.required, Validators.minLength(8)]),  
    confirmPassword: new FormControl('',[ Validators.required, Validators.minLength(8)]),
    birthdate: new FormControl('',[ Validators.required]),    
    gender: new FormControl(0,[ Validators.required])    
  },{validators: passwordMatchValidator()});

  constructor() {
    this.activatedRoute.params.subscribe((params) => {
      this.setRoleForForm(params);
    });    
  }

  setRoleForForm(params:Params){
    if (this.checkifParamHasValue(params,'role')) {
      this.role.set(params['role'] === 'admin' ? 1 : 0);
      return;
    } 
    
    this.role.set(0);
    return;
  }

  checkifParamHasValue(params:any, key:string): boolean {
    return params[key] !== undefined && params[key] !== null && params[key] !== '';
  }

  registerUser() {
    let registerRequest:RegisterRequest = {
      firstname: this.registerForm.value.firstname||'',
      lastname: this.registerForm.value.lastname||'',
      email: this.registerForm.value.email||'',
      password: this.registerForm.value.password||'',
      birthdate: this.registerForm.value.birthdate||'',
      gender: Number(this.registerForm.value.gender) || 0,
      role: this.role()
    }

    this.authService.register(registerRequest).subscribe({
      next: (response) => {
        this.router.navigate(['/login']); 
      },
      error: (error) => {        
        this.errorMessage = 'Parace que hubo un error intente nuevamente un momento.'; // Mensaje de error
      }
    });
  }

  goHome() {
    this.router.navigate(['/']); 
  }


  get firstname() { return this.registerForm.get('firstname'); }
  get lastname() { return this.registerForm.get('lastname'); }
  get email() { return this.registerForm.get('email'); }
  get password() { return this.registerForm.get('password'); }
  get confirmPassword() { return this.registerForm.get('confirmPassword'); }
  get birthdate() { return this.registerForm.get('birthdate'); }
  get gender() { return this.registerForm.get('gender'); }
}
