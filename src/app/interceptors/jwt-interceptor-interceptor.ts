import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth-service';
import { inject } from '@angular/core';

export const jwtInterceptorInterceptor: HttpInterceptorFn = (req, next) => {

  const token = localStorage.getItem('jwt');

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req);
};