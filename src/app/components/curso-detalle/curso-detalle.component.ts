import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CursoService } from '../../services/curso.service';
import { SeccionService } from '../../services/seccion.service';
import { LeccionService } from '../../services/leccion.service';
import { Curso } from '../../models/curso.model';
import { Seccion } from '../../models/seccion.model';
import { Leccion } from '../../models/leccion.model';

@Component({
  selector: 'app-curso-detalle',
  templateUrl: './curso-detalle.component.html',
  styleUrls: ['./curso-detalle.component.css'],
  imports: [CommonModule]
})
export class CursoDetalleComponent implements OnInit {
  curso: Curso | null = null;
  secciones: Seccion[] = [];
  leccionesPorSeccion: { [key: number]: Leccion[] } = {};
  currentLesson: Leccion | null = null;
  currentSeccion: Seccion | null = null;
  cursoId!: number;
  cargando: boolean = true;
  error: string = '';
  
  // Estado para acordeones y progreso
  expandedSections: { [key: number]: boolean } = {};
  expandedResources: { [key: number]: boolean } = {};
  completedLessons: Set<number> = new Set();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cursoService: CursoService,
    private seccionService: SeccionService,
    private leccionService: LeccionService
  ) {}

  ngOnInit() {
    this.cursoId = +this.route.snapshot.paramMap.get('id')!;
    this.cargarCurso();
  }

  cargarCurso() {
    this.cargando = true;
    this.cursoService.obtenerCursoPorId(this.cursoId).subscribe({
      next: (curso) => {
        this.curso = curso;
        this.cargarSecciones();
      },
      error: (error) => {
        console.error('Error cargando curso:', error);
        this.error = 'Error al cargar el curso';
        this.cargando = false;
      }
    });
  }

    regresarCursos(): void {
    const idEstudianteLS = localStorage.getItem('idEstudiante');

    if (!idEstudianteLS) {
      console.error("❌ No se encontró idEstudiante en el localStorage");
      return;
    }

    const idEstudiante = +idEstudianteLS;

    // Redirige a visualizar-cursos/:id
    this.router.navigate([`/visualizar-cursos/${idEstudiante}`]);
    // 🔥 BORRAR valores guardados
        localStorage.removeItem('idEstudiante');
        localStorage.removeItem('cursoId');
  }

  cargarSecciones() {
    this.seccionService.listarSeccionesPorCurso(this.cursoId).subscribe({
      next: (secciones) => {
        this.secciones = secciones.sort((a, b) => a.ordenSeccion - b.ordenSeccion);
        this.cargarLeccionesPorSeccion();
      },
      error: (error) => {
        console.error('Error cargando secciones:', error);
        this.cargando = false;
      }
    });
  }

  cargarLeccionesPorSeccion() {
    let seccionesCargadas = 0;
    
    if (this.secciones.length === 0) {
      this.cargando = false;
      return;
    }

    this.secciones.forEach(seccion => {
      this.leccionService.listarLeccionesPorSeccion(seccion.idSeccion).subscribe({
        next: (lecciones) => {
          this.leccionesPorSeccion[seccion.idSeccion] = lecciones.sort((a, b) => a.ordenLeccion - b.ordenLeccion);
          seccionesCargadas++;
          
          // Expandir la primera sección por defecto
          if (seccion.ordenSeccion === 1) {
            this.expandedSections[seccion.idSeccion] = true;
          }
          
          // Seleccionar la primera lección de la primera sección
          if (seccion.ordenSeccion === 1 && lecciones.length > 0 && !this.currentLesson) {
            this.seleccionarLeccion(lecciones[0], seccion);
          }
          
          if (seccionesCargadas === this.secciones.length) {
            this.cargando = false;
          }
        },
        error: (error) => {
          console.error('Error cargando lecciones:', error);
          seccionesCargadas++;
          if (seccionesCargadas === this.secciones.length) {
            this.cargando = false;
          }
        }
      });
    });
  }

  seleccionarLeccion(leccion: Leccion, seccion: Seccion): void {
    this.currentLesson = leccion;
    this.currentSeccion = seccion;
    
    // Marcar como completada si es nueva
    if (!this.completedLessons.has(leccion.idLeccion)) {
      // Aquí podrías llamar a un servicio para guardar el progreso
      this.completedLessons.add(leccion.idLeccion);
    }
  }

  // Retorna true si la lección actual es la última del curso
  esUltimaLeccion(): boolean {
    if (!this.currentLesson || !this.secciones || !this.leccionesPorSeccion) {
      return false;
    }

    const ultimaSeccion = this.secciones[this.secciones.length - 1];
    const leccionesUltimaSeccion = this.leccionesPorSeccion[ultimaSeccion.idSeccion];

    if (!leccionesUltimaSeccion || leccionesUltimaSeccion.length === 0) {
      return false;
    }

    const ultimaLeccion = leccionesUltimaSeccion[leccionesUltimaSeccion.length - 1];

    return this.currentLesson.idLeccion === ultimaLeccion.idLeccion;
}




  //

  toggleSection(sectionId: number): void {
    this.expandedSections[sectionId] = !this.expandedSections[sectionId];
  }

  toggleResources(lessonId: number): void {
    this.expandedResources[lessonId] = !this.expandedResources[lessonId];
  }

  isSectionExpanded(sectionId: number): boolean {
    return this.expandedSections[sectionId];
  }

  areResourcesExpanded(lessonId: number): boolean {
    return this.expandedResources[lessonId];
  }

  getProgressPercentage(): number {
    const totalLessons = Object.values(this.leccionesPorSeccion)
      .reduce((total, lecciones) => total + lecciones.length, 0);
    return totalLessons > 0 ? (this.completedLessons.size / totalLessons) * 100 : 0;
  }

  getProgressText(): string {
    const totalLessons = Object.values(this.leccionesPorSeccion)
      .reduce((total, lecciones) => total + lecciones.length, 0);
    return `${this.completedLessons.size} de ${totalLessons} lecciones completadas`;
  }

  siguienteLeccion(): void {
    if (this.currentLesson && this.currentSeccion) {
      const currentSeccionLecciones = this.leccionesPorSeccion[this.currentSeccion.idSeccion];
      const currentIndex = currentSeccionLecciones.findIndex(l => l.idLeccion === this.currentLesson!.idLeccion);
      
      if (currentIndex < currentSeccionLecciones.length - 1) {
        // Siguiente lección en la misma sección
        this.seleccionarLeccion(currentSeccionLecciones[currentIndex + 1], this.currentSeccion);
      } else {
        // Buscar siguiente sección
        const currentSeccionIndex = this.secciones.findIndex(s => s.idSeccion === this.currentSeccion!.idSeccion);
        if (currentSeccionIndex < this.secciones.length - 1) {
          const nextSeccion = this.secciones[currentSeccionIndex + 1];
          const nextSeccionLecciones = this.leccionesPorSeccion[nextSeccion.idSeccion];
          if (nextSeccionLecciones && nextSeccionLecciones.length > 0) {
            this.seleccionarLeccion(nextSeccionLecciones[0], nextSeccion);
            this.expandedSections[nextSeccion.idSeccion] = true;
          }
        }
      }
    }
  }

  anteriorLeccion(): void {
    if (this.currentLesson && this.currentSeccion) {
      const currentSeccionLecciones = this.leccionesPorSeccion[this.currentSeccion.idSeccion];
      const currentIndex = currentSeccionLecciones.findIndex(l => l.idLeccion === this.currentLesson!.idLeccion);
      
      if (currentIndex > 0) {
        // Lección anterior en la misma sección
        this.seleccionarLeccion(currentSeccionLecciones[currentIndex - 1], this.currentSeccion);
      } else {
        // Buscar sección anterior
        const currentSeccionIndex = this.secciones.findIndex(s => s.idSeccion === this.currentSeccion!.idSeccion);
        if (currentSeccionIndex > 0) {
          const prevSeccion = this.secciones[currentSeccionIndex - 1];
          const prevSeccionLecciones = this.leccionesPorSeccion[prevSeccion.idSeccion];
          if (prevSeccionLecciones && prevSeccionLecciones.length > 0) {
            this.seleccionarLeccion(prevSeccionLecciones[prevSeccionLecciones.length - 1], prevSeccion);
            this.expandedSections[prevSeccion.idSeccion] = true;
          }
        }
      }
    }
  }

  getLeccionesBySeccion(seccionId: number): Leccion[] {
    return this.leccionesPorSeccion[seccionId] || [];
  }

  isLessonCompleted(lessonId: number): boolean {
    return this.completedLessons.has(lessonId);
  }

  marcarComoCompletada(): void {
    if (this.currentLesson) {
      this.completedLessons.add(this.currentLesson.idLeccion);
    }
  }

    // Agrega este método a tu clase
  getVideoUrl(leccionId: number): string {
    // Mapeo manual de lecciones a videos
    const videoMap: { [key: number]: string } = {
      1: 'https://www.sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
      2: 'https://www.sample-videos.com/video123/mp4/480/big_buck_bunny_480p_1mb.mp4',
      3: 'https://www.sample-videos.com/video123/mp4/360/big_buck_bunny_360p_1mb.mp4',
      // Agrega más lecciones según necesites
    };
    
    return videoMap[leccionId] || 'https://www.sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4';
  }

  irAEvaluacion(): void {
  if (!this.currentSeccion) {
    console.error("❌ No hay sección actual seleccionada.");
    return;
  }

  const idSeccion = this.currentSeccion.idSeccion;

  this.router.navigate(['/evaluacion/seccion', idSeccion]);
}


}