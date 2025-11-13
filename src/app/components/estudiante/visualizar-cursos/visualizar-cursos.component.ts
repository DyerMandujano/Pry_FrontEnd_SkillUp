import { Component, OnInit } from '@angular/core';
import { CursoMatricula } from '../../../models/CursoMatricula';
import { EstudianteService } from '../../../services/estudiante.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Curso } from '../../../models/curso.model';
import { CursoService } from '../../../services/curso.service';
import { CursoNoMatricula } from '../../../models/CursoNoMatricula';

@Component({
  selector: 'app-visualizar-cursos',
  imports: [CommonModule],
  templateUrl: './visualizar-cursos.component.html',
  styleUrl: './visualizar-cursos.component.css'
})
export class VisualizarCursosComponent implements OnInit   {

  idEstudiante!: number; // <-- Aquí guardamos el ID de la ruta
  cursos: CursoMatricula[] = []; // Cursos del estudiante

  cursosT: Curso[] = [];
  cursosNoM: CursoNoMatricula[] = [];

  constructor(
    private route: ActivatedRoute,
    private estudianteService: EstudianteService,
    private cursoService:CursoService
  ) {}

  ngOnInit(): void {
    // Capturar el parámetro 'id' de la URL
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
        //console.log('Cursos del estudiante:', data);
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
