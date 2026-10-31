import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { User } from '../models/user';
import { UserSession } from '../models/user-session';
import { RegisterRequest } from '../models/register-request';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl + '/auth'; 

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    let credentials = {
      "email": username,
      "password": password
    }
    this.cleanSession();
    return this.http.post<UserSession>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          localStorage.setItem('jwt', response.authenticationToken);
          localStorage.setItem('userdata', JSON.stringify(response.userData));
        })
      );
  }

  register(userform:RegisterRequest): Observable<any> { 
    this.cleanSession();  
    return this.http.post<UserSession>(`${this.apiUrl}/register`, userform);
  }


  getToken(): string | null {
    return localStorage.getItem('jwt');
  }

  getUserdata(): User | null {
    let userStringfy = localStorage.getItem('userdata')||'{}';
    let user:User = JSON.parse(userStringfy);    
    if (Object.keys(user).length === 0) {
      return null;
    }
    return user;
  }

  getTokenExpiration(): Date | null {    
    const userData = this.getUserdata();
    return userData ? this.processExpiration(userData.expiration) : null;
  }

  processExpiration(expiration: any): Date | null {
    const date = new Date(expiration);

    if (!isNaN(date.getTime())) {
      return date;
    }
    return null;
  }

  isTokenExpired(): boolean {
    const expiration = this.getTokenExpiration();
    
    if (!expiration){
      return true;
    }  // no token or invalid
    return expiration.getTime() < Date.now();
  }

  getUserRoles(): string[] {
    return this.getUserdata()?.roles || [];
  }

  isAdmin(): boolean {
    return this.getUserRoles().includes('ADMINISTRATOR');
  }

  isUser(): boolean {
    return this.getUserRoles().includes('USER');
  }  

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired();
  }

  logout(): void {
    localStorage.removeItem('jwt');
    localStorage.removeItem('userdata');
  }  

  cleanSession(): void {
    this.logout();
  }
}
