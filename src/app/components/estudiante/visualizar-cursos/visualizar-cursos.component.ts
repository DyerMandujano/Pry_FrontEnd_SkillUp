import { Component, OnInit } from '@angular/core';
import { CursoMatricula } from '../../../models/CursoMatricula';
import { EstudianteService } from '../../../services/estudiante.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { RouterModule } from '@angular/router'; // ← AÑADE ESTE IMPORT
import { Curso } from '../../../models/curso.model';
import { CursoService } from '../../../services/curso.service';
import { CursoNoMatricula } from '../../../models/CursoNoMatricula';


@Component({
  selector: 'app-visualizar-cursos',
  imports: [CommonModule, RouterModule], // ← AÑADE RouterModule AQUÍ
  templateUrl: './visualizar-cursos.component.html',
  styleUrl: './visualizar-cursos.component.css'
})
export class VisualizarCursosComponent implements OnInit {

  idEstudiante!: number;
  cursos: CursoMatricula[] = [];
  cursosT: Curso[] = [];
  cursosNoM: CursoNoMatricula[] = [];

  constructor(
    private route: ActivatedRoute,
    private estudianteService: EstudianteService,
    private cursoService: CursoService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.idEstudiante = +id;
        this.obtenerCursosPorEstudiante(this.idEstudiante);
        this.obtenerCursosSinMatricula(this.idEstudiante);
      }
    });
  }

  obtenerCursosPorEstudiante(id: number): void {
    this.estudianteService.obtenerCursosMatricula(id).subscribe({
      next: (data) => {
        this.cursos = data;
      },
      error: (err) => {
        console.error('Error al obtener los cursos del estudiante:', err);
      }
    });
  }

  obtenerCursosSinMatricula(id: number): void {
    this.cursoService.listarCursosSinMatriculaporEstu(id).subscribe({
      next: (data) => {
        this.cursosNoM = data;
        console.log('Cursos del estudiante:', data);
      },
      error: (err) => {
        console.error('Error al obtener los cursos del estudiante:', err);
      }
    });
  }
}