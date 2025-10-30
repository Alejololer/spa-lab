import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
  user: string | null = '';

  constructor(private auth: AuthService, private router: Router) {
    this.user = this.auth.getUser();
  }

  irClientes() {
    this.router.navigate(['/clientes']);
  }

  irProductos() {
    this.router.navigate(['/productos']);
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
