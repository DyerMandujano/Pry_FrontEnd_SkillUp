import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { EvaluacionCurso } from '../../models/evaluacionCurso';
import { Evaluacion } from '../../models/evaluacion';
import { EvaluacionCursoService } from '../../services/evaluacion-curso.service';
import { ResultadoVerificacion } from '../../models/resultado-verificacion.model';

@Component({
  selector: 'app-evaluacion-curso',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './evaluacion-curso.component.html',
  styleUrls: ['./evaluacion-curso.component.css']
})
export class EvaluacionCursoComponent implements OnInit {

  cursoId!: number;
  idSeccion!: number;
  idEstudiante!: number;
  idEvaluacion!: number;

  evaluaciones: EvaluacionCurso[] = [];
  evaluacion: Evaluacion[] = [];

  respuestasUsuario: { idPregunta: number; idOpcionPregunta: number }[] = [];

  intentoActual = 1;
  maxIntentos = 3;

  aprobado = false;
  mostrarResultado = false;
  resultado?: ResultadoVerificacion;
  enviando = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private evaluacionService: EvaluacionCursoService
  ) {}

  ngOnInit(): void {
    
    this.cursoId = Number(this.route.snapshot.paramMap.get('id'));          // curso/:id
    this.idSeccion = Number(this.route.snapshot.paramMap.get('idSeccion')); // .../evaluacion/:idSeccion
    this.idEstudiante = Number(this.route.snapshot.queryParamMap.get('idEstudiante')) || 0;
    console.log('cursoId', this.cursoId);
    console.log('idSeccion', this.idSeccion);
    console.log('idEstudiante', this.idEstudiante);

    if (!this.idSeccion || !this.idEstudiante) {
      console.error('❌ Faltan parámetros en la ruta (idSeccion o idEstudiante).');
      return;
    }

    const keyIntentos = `intentos_${this.idEstudiante}_${this.idSeccion}`;
    this.intentoActual = Number(localStorage.getItem(keyIntentos)) || 1;

    if (this.intentoActual > this.maxIntentos) {
      alert('Has utilizado tus 3 intentos. Regresa al curso y repasa.');
      this.volverACursos();
      return;
    }

    this.cargarDatosEvaluacion();
  }

  cargarDatosEvaluacion(): void {
    this.evaluacionService.listarTituloEvaluacion(this.idSeccion).subscribe({
      next: (data) => {
        this.evaluacion = data;
        if (data && data.length > 0) {
          this.idEvaluacion = data[0].idEvaluacion;
        }
      },
      error: (err) => console.error('Error cargando título de la evaluación', err)
    });

    this.evaluacionService.listarEvaluacion(this.idSeccion).subscribe({
      next: (data) => this.evaluaciones = data,
      error: (err) => console.error('Error cargando preguntas de la evaluación', err)
    });
  }

  seleccionarRespuesta(idPregunta: number, idOpcionPregunta: number): void {
    const index = this.respuestasUsuario.findIndex(r => r.idPregunta === idPregunta);
    if (index >= 0) {
      this.respuestasUsuario[index].idOpcionPregunta = idOpcionPregunta;
    } else {
      this.respuestasUsuario.push({ idPregunta, idOpcionPregunta });
    }
  }

  isOpcionSeleccionada(idPregunta: number, idOpcionPregunta: number): boolean {
    return this.respuestasUsuario.some(
      r => r.idPregunta === idPregunta && r.idOpcionPregunta === idOpcionPregunta
    );
  }

  enviarEvaluacion(): void {
    if (this.respuestasUsuario.length !== this.evaluaciones.length) {
      alert(`Debes responder todas las preguntas (${this.evaluaciones.length}).`);
      return;
    }

    this.enviando = true;
    const hoy = new Date().toISOString().split('T')[0];

    const payload = this.respuestasUsuario.map(r => ({
      estudiante: { idEstudiante: this.idEstudiante },
      opcionPregunta: { idOpcPregunta: r.idOpcionPregunta },
      textoRespuesta: '',
      puntaje: 0,
      fecRespuesta: hoy,
      estado: 1
    }));
  
    this.evaluacionService.guardarRespuestasBatch(payload).subscribe({
      next: (res) => {
          console.log('✅ Respuestas guardadas (texto):', res);
        this.evaluacionService.verificarAprobacion(this.idEstudiante, this.idEvaluacion).subscribe({
          next: (res) => {
            this.resultado = res;
            this.aprobado = res.resultado === 'APROBADO';
            this.mostrarResultado = true;
            this.enviando = false;

            this.intentoActual++;
            const keyIntentos = `intentos_${this.idEstudiante}_${this.idSeccion}`;
            localStorage.setItem(keyIntentos, String(this.intentoActual));

            if (!this.aprobado && this.intentoActual > this.maxIntentos) {
              setTimeout(() => {
                alert('Has utilizado tus 3 intentos. Regresa al curso y repasa.');
                this.volverACursos();
              }, 2000);
            }
          },
          error: (err) => {
            console.error('Error verificando aprobación', err);
            alert('Error al verificar resultados.');
            this.enviando = false;
          }
        });
      },
      error: (err) => {
        console.error('Error guardando respuestas', err);
        alert('Error al enviar respuestas.');
        this.enviando = false;
      }
    });
  }

  volverACursos(): void {
    this.router.navigate(['/curso', this.cursoId, 'lecciones'], {
      queryParams: { idEstudiante: this.idEstudiante }
    });
  }

  descargarCertificado(): void {
    alert('Descargar certificado (lo implementará tu compañero).');
  }
}
