import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { API_URL } from '../config';
import { AuthResponse, LoginRequest, Rol } from '../models/models';

const SESSION_KEY = 'fleetcare_session';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private _session = signal<AuthResponse | null>(this.leerSesion());

  readonly session = this._session.asReadonly();
  readonly username = computed(() => this._session()?.username ?? '');
  readonly rol = computed(() => this._session()?.rol ?? null);

  login(datos: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_URL}/auth/login`, datos).pipe(
      tap((resp) => {
        localStorage.setItem(SESSION_KEY, JSON.stringify(resp));
        this._session.set(resp);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(SESSION_KEY);
    this._session.set(null);
    this.router.navigate(['/login']);
  }

  get token(): string | null {
    return this._session()?.token ?? null;
  }

  estaAutenticado(): boolean {
    const token = this.token;
    if (!token) return false;
    if (this.tokenVencido(token)) {
      localStorage.removeItem(SESSION_KEY);
      this._session.set(null);
      return false;
    }
    return true;
  }

  tieneRol(...roles: Rol[]): boolean {
    const rol = this.rol();
    return rol !== null && roles.includes(rol);
  }

  rutaInicial(): string {
    return this.rol() === 'TECNICO' ? '/mantenimientos' : '/dashboard';
  }

  private leerSesion(): AuthResponse | null {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      return raw ? (JSON.parse(raw) as AuthResponse) : null;
    } catch {
      return null;
    }
  }

  private tokenVencido(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }
}