import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Curso } from '../models/curso.model';

@Injectable({
  providedIn: 'root'
})
export class CursoService {
  private apiUrl = 'http://localhost:8080/api/cursos';
  private apiUrl2 = 'http://localhost:8888/api/cursos/docente/5';

  constructor(private http: HttpClient) {}

  listarCursos(): Observable<Curso[]> {
    return this.http.get<Curso[]>(this.apiUrl2);
  }

  insertarCurso(curso: Curso): Observable<string> {
    return this.http.post(this.apiUrl, curso, { responseType: 'text' });
  }

  actualizarCurso(id: number, curso: Curso): Observable<string> {
    return this.http.put(`${this.apiUrl}/${id}`, curso, { responseType: 'text' });
  }

  eliminarCurso(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' });
  }
}