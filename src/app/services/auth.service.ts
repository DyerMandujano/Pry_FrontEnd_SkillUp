import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginRequest } from '../models/login-request.model';
import { LoginResponse } from '../models/login-response.model';
import { RegistroRequest } from '../models/registro-request.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private BASE_URL = 'http://localhost:8888/api/auth';

  constructor(private http: HttpClient) { }

  // --- MÉTODOS DE API ---
  
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.BASE_URL}/login`, credentials);
  }

  register(userData: RegistroRequest): Observable<any> {
    return this.http.post(`${this.BASE_URL}/registrar`, userData);
  }

  // --- MÉTODOS DE MANEJO DE SESIÓN ---

  saveSession(response: LoginResponse): void {
    localStorage.setItem('token', response.token);
    
    // CORRECCIÓN 1: Asegúrate de que 'idPersona' esté aquí
    const userData = {
      idUsuario: response.idUsuario,
      username: response.username,
      nombreCompleto: response.nombreCompleto,
      rol: response.rol,
      idRolEspecifico: response.idRolEspecifico,
      idPersona: response.idPersona // <-- ¡VITAL!
    };
    localStorage.setItem('currentUser', JSON.stringify(userData));
  }

  // CORRECCIÓN 2: ¡ESTE ES EL MÉTODO QUE FALTABA!
  getCurrentUser(): LoginResponse | null {
    if (typeof localStorage === 'undefined') {
        return null; // Manejo para SSR
    }
    
    const user = localStorage.getItem('currentUser');
    if (!user) {
      return null;
    }
    return JSON.parse(user) as LoginResponse;
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    const user = localStorage.getItem('currentUser');
    return token !== null && user !== null;
  }
}