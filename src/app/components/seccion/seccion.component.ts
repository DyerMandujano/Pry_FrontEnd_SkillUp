import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router} from '@angular/router';
import { SeccionService } from '../../services/seccion.service';
import { Seccion } from '../../models/seccion.model';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-seccion',
  imports: [CommonModule],
  templateUrl: './seccion.component.html',
  styleUrl: './seccion.component.css'
})
export class SeccionComponent{

   idCurso!: number;
   secciones: Seccion[] = [];
  constructor(private route: ActivatedRoute,
              private seccionService: SeccionService,
              private router: Router
  ) {}

  ngOnInit(): void {
    this.idCurso = Number(this.route.snapshot.paramMap.get('id'));
    console.log('ID del curso recibido:', this.idCurso);
    
    this.seccionService.listarSeccionesPorCurso(this.idCurso)
    .subscribe(data => (this.secciones = data));
  }

  navegarRegistrarSeccion(): void {
    this.router.navigate([`/curso/${this.idCurso}/registrar-seccion`]);
  }

  navegarActualizarSeccion(idSeccion: number): void {
    this.router.navigate(['/actualizar-seccion', idSeccion]);
  }

  eliminarSeccion(idSeccion: number): void {
  if (confirm('¿Estás seguro de eliminar esta seccion?')) {
    this.seccionService.eliminarSeccion(idSeccion).subscribe({
      next: (respuesta) => {
       
        // Volvemos a cargar la lista actualizada
        this.seccionService.listarSeccionesPorCurso(this.idCurso)
            .subscribe(data => this.secciones = data);
      },
      error: (err) => {
        console.error('Error al eliminar seccion:', err);
        alert('❌ No se pudo eliminar seccion');
      }
    });
  }
}

}
