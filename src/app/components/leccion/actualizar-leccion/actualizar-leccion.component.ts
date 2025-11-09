import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Leccion } from '../../../models/leccion.model';
import { ActivatedRoute, Router } from '@angular/router';
import { LeccionService } from '../../../services/leccion.service';

@Component({
  selector: 'app-actualizar-leccion',
  imports: [CommonModule, FormsModule],
  templateUrl: './actualizar-leccion.component.html',
  styleUrl: './actualizar-leccion.component.css'
})
export class ActualizarLeccionComponent implements OnInit{

  idLeccion!:number;
  leccion: Leccion = {
      idLeccion:0,
      idSeccion:0,
      nombreLeccion:'',
      duracion:0,
      material1:'',
      material2:'',
      ordenLeccion:0,
      estado:1
    } 


   constructor(private route: ActivatedRoute,
    private leccionService: LeccionService,
    private router: Router) {}

  ngOnInit(): void {
    this.idLeccion = Number(this.route.snapshot.paramMap.get('id'));
    console.log('🟢 ID de leccion recibido:', this.idLeccion);

    // 🔹 Obtener leccion por ID al cargar la página
    this.leccionService.obtenerLeccionPorId(this.idLeccion).subscribe({
      next: (data) => {
        this.leccion = data;
        console.log('📘 Datos de leccion cargados:', data);
      },
      error: (err) => {
        console.error('❌ Error al obtener leccion:', err);
        alert('No se pudo cargar la información de leccion.');
      }
    });
  }

  actualizarSeccion(): void {
    this.leccionService.actualizarLeccion(this.idLeccion, this.leccion).subscribe({
      next: (mensaje) => {
        alert(mensaje);
        this.router.navigate(['leccion/seccion', this.leccion.idSeccion]);
      },
      error: (err) => {
        console.error(err);
        alert('❌ Error al actualizar la Leccion');
      }
    });
  }
  
}
