import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CursoService } from '../../services/curso.service';
import { Curso } from '../../models/curso.model';

@Component({
  selector: 'app-curso',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './curso.component.html',
  styleUrls: ['./curso.component.css']
})

export class CursoComponent implements OnInit {
  cursos: Curso[] = [];

  constructor(private cursoService: CursoService) {}

  ngOnInit(): void {
    this.cargarCursos();
  }

  cargarCursos() {
    this.cursoService.listarCursos().subscribe({
      next: (data) => (this.cursos = data),
      error: (err) => console.error('Error al cargar cursos', err)
    });
  }
}
