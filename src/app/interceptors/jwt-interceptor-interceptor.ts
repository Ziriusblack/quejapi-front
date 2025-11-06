import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth-service';
import { inject } from '@angular/core';

export const jwtInterceptorInterceptor: HttpInterceptorFn = (req, next) => { 
  
  const token = inject(AuthService).getToken();

  if (token) {

    const newRequest = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });

    return next(newRequest);    
  }   

  return next(req);
  
};
