import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';

export const UserGuard: CanActivateFn = (route, state) => {
  const authenticationService = inject(AuthService);
  const routed = inject(Router);
  
  if (authenticationService.isTokenExpired()) {
    authenticationService.logout();   
  }
    
  if(authenticationService.isUser()){
    return true;
  }
    
  routed.navigate(['/login']);
  return false;
};
