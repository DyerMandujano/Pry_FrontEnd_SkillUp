import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CertificadoCurso } from '../models/certificadoEstudiante';


@Injectable({
  providedIn: 'root'
})
export class CertificadoCursoService {

   private baseUrl = 'http://localhost:8888/api/certificados';

  constructor(private http: HttpClient) { }

    listarCertificadosPorEstudiante(idEstudiante: number): Observable<CertificadoCurso[]> {
    return this.http.get<CertificadoCurso[]>(`${this.baseUrl}/estudiante/${idEstudiante}`);
  }

}
