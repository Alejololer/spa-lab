import { Injectable } from '@angular/core';
import { of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private demo = { user: 'admin', pass: '1234' };

  login(usuario: string, password: string) {
    if (usuario === this.demo.user && password === this.demo.pass) {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('auth', 'true');
        localStorage.setItem('user', usuario);
      }
      return of({ success: true }).pipe(delay(700));
    } else {
      return throwError(() => new Error('Usuario o contraseña incorrectos'));
    }
  }

  logout() {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('auth');
      localStorage.removeItem('user');
    }
  }

  isAuthenticated(): boolean {
    if (typeof window === 'undefined' || !window.localStorage) return false;
    return localStorage.getItem('auth') === 'true';
  }

  getUser(): string | null {
    if (typeof window === 'undefined' || !window.localStorage) return null;
    return localStorage.getItem('user');
  }
}
