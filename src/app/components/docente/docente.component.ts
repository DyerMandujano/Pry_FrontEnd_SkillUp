import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CursoService } from '../../services/curso.service';
import { Curso } from '../../models/curso.model';
import { ActivatedRoute,Router} from '@angular/router';


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
              private route: ActivatedRoute,
              private router: Router) {}

  ngOnInit(): void {
     this.idDocente = Number(this.route.snapshot.paramMap.get('id'));
     this.cursoService.listarCursosPorDocente(this.idDocente)
                      .subscribe(data => (this.cursos = data));
  }


  navegarRegistrarCurso(): void {
    this.router.navigate([`/docente/${this.idDocente}/registrar-curso`]);
  }

  navegarActualizarCurso(idCurso: number): void {
    this.router.navigate(['/actualizar-curso', idCurso]);
  }

  navegarSeccion(idCurso: number) {
    localStorage.setItem('idDocente', this.idDocente.toString());
    this.router.navigate(['/seccion/curso', idCurso]);
  }
  
eliminarCurso(idCurso: number): void {
  if (confirm('¿Estás seguro de eliminar este curso?')) {
    this.cursoService.eliminarCurso(idCurso).subscribe({
      next: (respuesta) => {
        alert('✅ Curso eliminado correctamente');
        // Volvemos a cargar la lista actualizada
        this.cursoService.listarCursosPorDocente(this.idDocente)
            .subscribe(data => this.cursos = data);
      },
      error: (err) => {
        console.error('Error al eliminar el curso:', err);
        alert('❌ No se pudo eliminar el curso');
      }
    });
  }
}
  
}
