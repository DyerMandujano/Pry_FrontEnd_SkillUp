import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // CommonModule ya incluye *ngFor, [ngClass], etc.
import { CursoService } from '../../services/curso.service';
import { Curso } from '../../models/curso.model';
import { ActivatedRoute, Router } from '@angular/router';

// 1. IMPORTA TU SERVICIO DE AUTENTICACIÓN
// (Asegúrate de que esta ruta sea correcta)
import { AuthService } from '../../services/auth.service'; 

@Component({
  selector: 'app-docente',
  standalone: true, // Asumo que es standalone por tu 'imports'
  imports: [CommonModule],
  templateUrl: './docente.component.html',
  styleUrl: './docente.component.css'
})
export class DocenteComponent implements OnInit { // <-- 2. Implementa OnInit
    
    idDocente!: number;
    cursos: Curso[] = [];
    
    // 3. AÑADE LA VARIABLE PARA EL NOMBRE
    nombreDelDocente: string = '';

  constructor(
    private cursoService: CursoService,
    private route: ActivatedRoute,
    private router: Router,
    // 4. INYECTA EL SERVICIO DE AUTENTICACIÓN
    private authService: AuthService 
  ) {}

  ngOnInit(): void {
    // Carga el nombre del docente desde la sesión
    this.cargarDatosDeSesion(); 
    
    // Carga el ID del docente desde la URL (esto ya lo tenías)
    this.idDocente = Number(this.route.snapshot.paramMap.get('id'));

    // Carga los cursos (esto ya lo tenías)
    if (this.idDocente) {
      this.cursoService.listarCursosPorDocente(this.idDocente)
          .subscribe(data => (this.cursos = data));
    }
  }

  // 5. AÑADE ESTA FUNCIÓN PARA CARGAR LOS DATOS DE SESIÓN
  cargarDatosDeSesion(): void {
    // Pide a tu servicio de Auth la sesión actual
    const sesion = this.authService.getCurrentUser(); // O como se llame tu método

    if (sesion && sesion.nombreCompleto) {
      // Asigna el nombre de la sesión a tu variable
      this.nombreDelDocente = sesion.nombreCompleto;
    } else {
      this.nombreDelDocente = 'Docente'; // Un valor por defecto
    }
  }


  // --- TUS MÉTODOS (SIN CAMBIOS) ---

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
    // (Mantengo tu lógica de confirm/alert, aunque en producción
    // es mejor usar un modal personalizado)
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
