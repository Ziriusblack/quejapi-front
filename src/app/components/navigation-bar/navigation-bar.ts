import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth-service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'navigation-bar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navigation-bar.html',
  styleUrl: './navigation-bar.css'
})
export class NavigationBar {
  private authService = inject(AuthService);
  private router = inject(Router);
  isAuthenticated = this.authService.isAuthenticated();
  isAdmin = this.authService.isAdmin();
  isUser = this.authService.isUser();
  navItems: any[] = [];
  
  userNavItems = [
    { name: 'Mis Radicados', route: '/user' },
    { name: 'Nuevo', route: '/user/complaint' },   
  ];

  adminNavItems = [
    { name: 'Dashboard', route: '/admin' },
    { name: 'Radicados', route: '/admin/complaints' } 
  ];

  guestNavItems = [
    { name: 'Inicio', route: '/' },
    { name: 'Ingresar', route: '/login' },
    { name: 'Registrarse', route: '/register/user' }   
  ];

  constructor() {  
    this.checkAuth();
    this.setNavItems();
  }
  
  checkAuth() {
    this.isAuthenticated = this.authService.isAuthenticated();
    this.isAdmin = this.authService.isAdmin();
    this.isUser = this.authService.isUser();
  }

  setNavItems() {
    if (this.isAdmin) {
      this.navItems = this.adminNavItems;
    } else if (this.isUser) {
      this.navItems = this.userNavItems;
    } else {
      this.navItems = this.guestNavItems;
    }
  }

  getUserName(): string {
    const user = this.authService.getUserdata();
    return user ? user.name : 'Guest';
  }

  getUserRole(): string {
    if (this.isAdmin) {
      return 'Administrador';
    }
    if (this.isUser) {
      return 'Usuario';
    }
    return 'Invitado';
  }

  logout(): void {
    this.authService.logout();    
    this.checkAuth();
    this.setNavItems();
    this.router.navigate(['/']);
  }  

  mobileMenuOpen = false;

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  // Método para cerrar el menú móvil al navegar
  navigate(route: string): void {
    this.mobileMenuOpen = false;
    this.router.navigate([route]);
  }
}