import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EvaluacionCurso } from '../models/evaluacionCurso';
import { Evaluacion } from '../models/evaluacion';
import { ResultadoVerificacion } from '../models/resultado-verificacion.model';

@Injectable({
  providedIn: 'root'
})
export class EvaluacionCursoService {

  private baseUrl = 'http://localhost:8888/api';

  constructor(private http: HttpClient) {}

  listarEvaluacion(idSeccion: number): Observable<EvaluacionCurso[]> {
    return this.http.get<EvaluacionCurso[]>(`${this.baseUrl}/evaluacion/seccion/${idSeccion}`);
  }

  listarTituloEvaluacion(idSeccion: number): Observable<Evaluacion[]> {
    return this.http.get<Evaluacion[]>(`${this.baseUrl}/evaluaciones/seccion/${idSeccion}`);
  }

  //nuevo
guardarRespuestasBatch(respuestas: any[]): Observable<string> {
  return this.http.post(`${this.baseUrl}/respuestas/batch`, respuestas, {
    responseType: 'text'
  });
}


  verificarAprobacion(idEstudiante: number, idEvaluacion: number): Observable<ResultadoVerificacion> {
    return this.http.get<ResultadoVerificacion>(
      `${this.baseUrl}/evaluaciones/verificar/${idEstudiante}/${idEvaluacion}`
    );
  }
}
