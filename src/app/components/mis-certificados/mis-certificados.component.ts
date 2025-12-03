import { Component, OnInit } from '@angular/core';

import { CertificadoCursoService } from '../../services/certificado-curso.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CertificadoCurso } from '../../models/certificadoEstudiante';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mis-certificados',
  imports: [CommonModule, FormsModule],
  templateUrl: './mis-certificados.component.html',
  styleUrl: './mis-certificados.component.css'
})
export class MisCertificadosComponent implements OnInit {

  certificados: CertificadoCurso[] = [];

  // ✔ NUEVA VARIABLE PARA EVITAR PARPADEOS
  isLoading: boolean = true;

  constructor(
    private certificadoService: CertificadoCursoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const idEstudiante = Number(localStorage.getItem('idEstudiante'));

    this.certificadoService.listarCertificadosPorEstudiante(idEstudiante)
      .subscribe({
        next: (data) => {
          this.certificados = data;
          this.isLoading = false;   // ✔ YA TERMINÓ DE CARGAR
        },
        error: (err) => {
          console.error('Error cargando certificados', err);
          this.isLoading = false;   // ✔ AUN SI FALLA, NO QUEREMOS PARPADEO
        }
      });
  }

  volverACursos(): void {
    const idEstudiante = Number(localStorage.getItem('idEstudiante'));

    if (!idEstudiante) {
      console.error("No existe idEstudiante en localStorage");
      return;
    }

    this.router.navigate(['/visualizar-cursos', idEstudiante]);
  }
}
