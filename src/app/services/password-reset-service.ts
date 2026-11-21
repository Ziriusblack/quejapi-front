import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PasswordResetService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/auth`;

  forgotPassword(email: string) {
    return this.http.post<{ message: string }>(`${this.baseUrl}/forgot-password`, { email });
  }

  resetPassword(email: string, code: string, newPassword: string) {
    return this.http.post<{ message: string }>(`${this.baseUrl}/reset-password`, { email, code, newPassword });
  }
}