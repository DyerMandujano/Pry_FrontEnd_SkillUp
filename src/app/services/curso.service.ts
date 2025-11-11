import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Curso } from '../models/curso.model';
import { DocenteC } from '../models/docenteC.model';

@Injectable({
  providedIn: 'root'
})
export class CursoService {
  private apiUrl = 'http://localhost:8888/api/docentes';
  
  private apiUrl2 = 'http://localhost:8888/api/cursos/docente';

   private apiUrl3 = 'http://localhost:8888/api/cursos';

  constructor(private http: HttpClient) {}

  /*
  listarCursos(): Observable<Curso[]> {
    return this.http.get<Curso[]>(this.apiUrl2);
  }*/
 
  listarDocentes(): Observable<DocenteC[]> {
    return this.http.get<DocenteC[]>(this.apiUrl);
  }

  listarCursosPorDocente(idDocente: number): Observable<Curso[]> {
  return this.http.get<Curso[]>(`${this.apiUrl2}/${idDocente}`);
  }

  obtenerCursoPorId(id: number): Observable<Curso> {
    return this.http.get<Curso>(`${this.apiUrl3}/${id}`);
  }

  insertarCurso(curso: Curso): Observable<string> {
    return this.http.post(this.apiUrl3, curso, { responseType: 'text' });
  }

  actualizarCurso(id: number, curso: Curso): Observable<string> {
    return this.http.put(`${this.apiUrl3}/${id}`, curso, { responseType: 'text' });
  }

  eliminarCurso(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl3}/${id}`, { responseType: 'text' });
  }
}