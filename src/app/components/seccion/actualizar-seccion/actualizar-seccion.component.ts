import { Component, OnInit } from '@angular/core';
import { Seccion } from '../../../models/seccion.model';
import { SeccionService } from '../../../services/seccion.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-actualizar-seccion',
  imports: [CommonModule, FormsModule],
  templateUrl: './actualizar-seccion.component.html',
  styleUrl: './actualizar-seccion.component.css'
})
export class ActualizarSeccionComponent implements OnInit{

  idSeccion!: number;
  seccion: Seccion = {
    idSeccion:0,
    idCurso:0,
    nombreSeccion:'',
    ordenSeccion:0,
    estado:1
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private seccionService: SeccionService
  ) {}

  ngOnInit(): void {
    this.idSeccion = Number(this.route.snapshot.paramMap.get('id'));
    console.log('🟢 ID del curso recibido:', this.idSeccion);

    // 🔹 Obtener curso por ID al cargar la página
    this.seccionService.obtenerSeccionPorId(this.idSeccion).subscribe({
      next: (data) => {
        this.seccion = data;
        console.log('📘 Datos de seccion cargados:', data);
      },
      error: (err) => {
        console.error('❌ Error al obtener seccion:', err);
        alert('No se pudo cargar la información de seccion.');
      }
    });
  }

  actualizarSeccion(): void {
    this.seccionService.actualizarSeccion(this.idSeccion, this.seccion).subscribe({
      next: (mensaje) => {
        alert(mensaje);
        this.router.navigate(['/seccion/curso', this.seccion.idCurso]);
      },
      error: (err) => {
        console.error(err);
        alert('❌ Error al actualizar la seccion');
      }
    });
  }
}
