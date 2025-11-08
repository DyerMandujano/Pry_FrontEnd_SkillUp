import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CursoService } from '../../services/curso.service';
import { Curso } from '../../models/curso.model';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-docente',
  imports: [CommonModule],
  templateUrl: './docente.component.html',
  styleUrl: './docente.component.css'
})
export class DocenteComponent{
   
   idDocente!: number;
   cursos: Curso[] = [];

  constructor(private cursoService: CursoService,
              private route: ActivatedRoute) {}

  ngOnInit(): void {
     this.idDocente = Number(this.route.snapshot.paramMap.get('id'));
     this.cursoService.listarCursosPorDocente(this.idDocente)
                      .subscribe(data => (this.cursos = data));
  }

}
