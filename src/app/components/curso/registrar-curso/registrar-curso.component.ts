import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Curso } from '../../../models/curso.model';
import { CursoService } from '../../../services/curso.service';


@Component({
  selector: 'app-registrar-curso',
  imports: [CommonModule,FormsModule],
  templateUrl: './registrar-curso.component.html',
  styleUrl: './registrar-curso.component.css'
})
export class RegistrarCursoComponent implements OnInit{

  idDocente!: number;

    nuevoCurso: Curso = {
    idCurso: 0,
    idDocente: 0,
    idCategoria: 0,
    nombreCurso: '',
    descripcion: '',
    resumen: '',
    nivel: '',
    duracionMin: 0,
    fechaPublicacion: '',
    imagenCurso1: '',
    imagenCurso2: '',
    estado: 1
  };

  categorias = [
    { id: 1, nombre: 'Gasfitería' },
    { id: 2, nombre: 'Construcción' },
    { id: 3, nombre: 'Electricidad' },
    { id: 4, nombre: 'Carpintería' },
    { id: 5, nombre: 'Soldadura' }
  ];


  constructor(private route: ActivatedRoute,
    private cursoService: CursoService,
    private router: Router) {}
/*
  ngOnInit(): void {
    this.idDocente = Number(this.route.snapshot.paramMap.get('id'));
    console.log('Id del docente recibido:', this.idDocente);
  }*/
   ngOnInit(): void {
    // Obtener el id del docente desde la URL
    this.idDocente = Number(this.route.snapshot.paramMap.get('id'));
    this.nuevoCurso.idDocente = this.idDocente;
    console.log('📘 Id del docente recibido:', this.idDocente);
  }
  registrarCurso() {
    // Fecha actual
    this.nuevoCurso.fechaPublicacion = new Date().toISOString().split('T')[0];

    this.cursoService.insertarCurso(this.nuevoCurso).subscribe({
      next: (mensaje) => {
        alert('✅ ' + mensaje);
        console.log('Curso insertado:', this.nuevoCurso);

        // 🔁 Opcional: Redirigir al panel del docente después de guardar
        this.router.navigate(['/docente', this.idDocente]);
      },
      error: (err) => {
        console.error('Error al insertar curso:', err);
        alert('❌ Error al registrar el curso.');
      }
    });
  }

  
}
