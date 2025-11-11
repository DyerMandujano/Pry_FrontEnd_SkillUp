import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// 1. Importa los modelos (¡esto ahora funcionará gracias a la Solución 1!)
import { LoginRequest } from '../models/login-request.model';
import { LoginResponse } from '../models/login-response.model';
import { RegistroRequest } from '../models/registro-request.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // 2. ¡Usamos el puerto 8888 que descubrimos!
  private BASE_URL = 'http://localhost:8888/api/auth';

  constructor(private http: HttpClient) { }

  // --- MÉTODOS DE API ---
  // (Esta es la función que te faltaba)
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.BASE_URL}/login`, credentials);
  }

  // (Esta es la función que te faltaba)
  register(userData: RegistroRequest): Observable<any> {
    return this.http.post(`${this.BASE_URL}/registrar`, userData);
  }

  // --- MÉTODOS DE MANEJO DE SESIÓN ---

  // (Esta es la función que te faltaba)
  saveSession(response: LoginResponse): void {
    localStorage.setItem('token', response.token);
    
    const userData = {
      idUsuario: response.idUsuario,
      username: response.username,
      nombreCompleto: response.nombreCompleto,
      rol: response.rol,
      idRolEspecifico: response.idRolEspecifico
    };
    localStorage.setItem('currentUser', JSON.stringify(userData));
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }
}