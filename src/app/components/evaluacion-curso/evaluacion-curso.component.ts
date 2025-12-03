import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { jsPDF } from 'jspdf';

import { EvaluacionCurso } from '../../models/evaluacionCurso';
import { Evaluacion } from '../../models/evaluacion';
import { Certificado } from '../../models/certificado.model';

import { EvaluacionCursoService } from '../../services/evaluacion-curso.service';
import { CertificadoService } from '../../services/certificado.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-evaluacion-curso',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './evaluacion-curso.component.html',
  styleUrl: './evaluacion-curso.component.css'
})
export class EvaluacionCursoComponent implements OnInit {

  evaluaciones: EvaluacionCurso[] = [];
  evaluacion: Evaluacion[] = [];
  idSeccion!: number;

  // Datos para el certificado
  idEstudiante!: number;
  idCurso!: number;

  constructor(
    private evaluacionService: EvaluacionCursoService,
    private certificadoService: CertificadoService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    console.log('--- ngOnInit EvaluacionCursoComponent ---');
    
    this.idSeccion = Number(this.route.snapshot.paramMap.get('id'));
    console.log('📌 ID de Sección desde URL:', this.idSeccion);

    // 1. Obtener el usuario actual para saber el ID Estudiante
    const currentUser = this.authService.getCurrentUser();
    console.log('👤 Usuario actual recuperado:', currentUser);

    if (currentUser && currentUser.rol === 'estudiante') {
      this.idEstudiante = currentUser.idRolEspecifico || 0;
      console.log('🎓 ID Estudiante establecido:', this.idEstudiante);
    } else {
      console.warn('⚠️ No se encontró un usuario estudiante logueado o el rol no es estudiante.');
    }

    // 2. Recuperar idCurso del localStorage
    const storedCursoId = localStorage.getItem('cursoId');
    console.log('💾 ID Curso recuperado de localStorage:', storedCursoId);

    if (storedCursoId) {
      this.idCurso = Number(storedCursoId);
      console.log('📘 ID Curso establecido:', this.idCurso);
    } else {
      console.warn('⚠️ No se encontró "cursoId" en localStorage.');
    }

    // Cargar datos de la evaluación
    if (this.idSeccion) {
      this.evaluacionService.listarTituloEvaluacion(this.idSeccion).subscribe({
        next: (data) => {
            this.evaluacion = data;
            console.log('✅ Título de evaluación cargado:', data);
        },
        error: (err) => console.error('❌ Error cargando título:', err)
      });

      this.evaluacionService.listarEvaluacion(this.idSeccion).subscribe({
        next: (data) => {
            this.evaluaciones = data;
            console.log('✅ Preguntas cargadas:', data);
        },
        error: (err) => console.error('❌ Error cargando preguntas:', err)
      });
    }
  }

  // --- MÉTODO PRINCIPAL ---
  obtenerCertificado(): void {
    console.log('--- Iniciando proceso obtenerCertificado ---');
    console.log(`🔍 Verificando datos -> idEstudiante: ${this.idEstudiante}, idCurso: ${this.idCurso}`);

    if (!this.idEstudiante || !this.idCurso) {
      console.error('❌ Error: Faltan IDs necesarios para generar el certificado.');
      alert('Error: No se pudo identificar al estudiante o el curso. Verifique la consola para más detalles.');
      return;
    }

    console.log('🚀 Llamando al servicio generarCertificado...');
    
    // 1. Llamamos al backend para guardar/generar el certificado en la BD
    // Fíjate bien en los paréntesis aquí: generarCertificado(param1, param2).subscribe(...)
    this.certificadoService.generarCertificado(this.idEstudiante, this.idCurso).subscribe({
      next: (cert: Certificado) => {
        console.log('✅ Certificado obtenido exitosamente del Backend:', cert);
        
        if (!cert) {
            console.error('❌ El backend devolvió una respuesta vacía o nula.');
            alert('Error: El servidor no devolvió datos del certificado.');
            return;
        }

        // 2. Generamos el PDF con los datos reales
        console.log('🎨 Iniciando generación de PDF...');
        this.generarPDF(cert);
      },
      error: (err) => {
        console.error('❌ Error en la petición al generar certificado:', err);
        if (err.status === 404) {
             alert('No se encontró información para generar el certificado.');
        } else {
             alert('Hubo un error al comunicarse con el servidor. Revise la consola.');
        }
      }
    });
  }

  generarPDF(datos: Certificado) {
    console.log('📄 Generando documento PDF con datos:', datos);
    
    // Orientación Horizontal (Landscape), unidad mm, formato A4
    const doc = new jsPDF('l', 'mm', 'a4');
    const width = doc.internal.pageSize.getWidth();
    const height = doc.internal.pageSize.getHeight();

    // --- 1. FONDO ---
    const imgFondo = '/img/certificado/certificado_bg.jpg'; 
    try {
        // Agrega tu imagen cubriendo toda la hoja
        doc.addImage(imgFondo, 'JPEG', 0, 0, width, height); 
        console.log('🖼️ Imagen de fondo agregada (o intentada).');
    } catch (e) {
        console.warn("⚠️ No se cargó imagen de fondo. Asegúrate que la ruta sea correcta en 'public'. Error:", e);
    }

    // --- 2. DATOS DINÁMICOS (Ajustados a tu diseño) ---

    // "Este certificado se otorga a:" (Texto pequeño encima del nombre)
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(14);
    doc.setTextColor(100, 100, 100); // Gris
    doc.text("Este documento certifica que:", width / 2, 85, { align: 'center' });

    // NOMBRE ESTUDIANTE (Grande y centrado)
    doc.setFont('times', 'bolditalic');
    doc.setFontSize(42);
    doc.setTextColor(10, 25, 47); // Azul oscuro SkillUp
    const nombreCompleto = this.authService.getCurrentUser()?.nombreCompleto || "Nombre del Estudiante";
    console.log('✍️ Escribiendo nombre estudiante:', nombreCompleto);
    doc.text(nombreCompleto, width / 2, 105, { align: 'center' });

    // "Por completar exitosamente el curso de:"
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(datos.mensaje || "Por haber aprobado satisfactoriamente el curso de:", width / 2, 120, { align: 'center' });

    // NOMBRE DEL CURSO
    // Nota: Idealmente deberías tener el nombre del curso en una variable. 
    const nombreCurso = "CURSO DE ESPECIALIZACIÓN TÉCNICA"; // Reemplazar con variable real si la tienes disponible
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(26);
    doc.setTextColor(212, 175, 55); // Color Dorado
    doc.text(nombreCurso, width / 2, 135, { align: 'center' });

    // FECHA DE EMISIÓN
    doc.setFont('times', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(50, 50, 50);
    doc.text(`Fecha de emisión: ${datos.fechaEmision}`, width / 2, 155, { align: 'center' });

    // ID DE VERIFICACIÓN
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150); // Gris claro
    doc.text(`ID: ${datos.codigoCertificado}`, width - 20, height - 10, { align: 'right' });

    // Descargar
    const nombreArchivo = `Certificado_SkillUp_${datos.codigoCertificado}.pdf`;
    console.log('💾 Guardando archivo:', nombreArchivo);
    doc.save(nombreArchivo);
  }
}