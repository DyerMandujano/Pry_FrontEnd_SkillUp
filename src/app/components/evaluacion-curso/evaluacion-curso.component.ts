import { Component, OnInit } from '@angular/core';
import { EvaluacionCurso } from '../../models/evaluacionCurso';
import { EvaluacionCursoService } from '../../services/evaluacion-curso.service';
import { Evaluacion } from '../../models/evaluacion';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-evaluacion-curso',
  imports: [CommonModule,FormsModule],
  templateUrl: './evaluacion-curso.component.html',
  styleUrl: './evaluacion-curso.component.css'
})
export class EvaluacionCursoComponent implements OnInit {

  evaluaciones: EvaluacionCurso[] = [];
  evaluacion: Evaluacion[] = [];

  idSeccion!: number;

  constructor(
    private evaluacionService: EvaluacionCursoService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {

    // Obtener el parámetro idSeccion que viene en la URL
    this.idSeccion = Number(this.route.snapshot.paramMap.get('id'));

    if (!this.idSeccion) {
      console.error("❌ No se recibió el idSeccion en la ruta");
      return;
    }

    console.log("📌 ID de sección recibido:", this.idSeccion);

    // 🔵 Título de la evaluación
    this.evaluacionService.listarTituloEvaluacion(this.idSeccion).subscribe({
      next: (data) => this.evaluacion = data,
      error: (err) => console.error('Error cargando Título de la evaluación', err)
    });

    // 🔵 Preguntas de la evaluación
    this.evaluacionService.listarEvaluacion(this.idSeccion).subscribe({
      next: (data) => this.evaluaciones = data,
      error: (err) => console.error('Error cargando preguntas de la evaluación', err)
    });
  }
}