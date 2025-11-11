import { Component, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core'; // 1. Importa Inject y PLATFORM_ID
import { isPlatformBrowser, CommonModule } from '@angular/common'; // 2. Importa isPlatformBrowser
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../models/login-request.model';
import { RegistroRequest } from '../../models/registro-request.model';

@Component({
  selector: 'app-autenticacion',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './autenticacion.component.html',
  styleUrls: ['./autenticacion.component.css']
})
export class AutenticacionComponent implements AfterViewInit {

  // ... (tus modelos loginData, registerData y variables de error quedan igual) ...
  loginData: LoginRequest = {
    username: '',
    contrasenia: ''
  };
  registerData = {
    nombres: '',
    apellidos: '',
    username: '',
    contrasenia: '',
    fecha_nacimiento: '',
    genero: '',
    rol: '',
    nivel_educativo: '',
    especialidad: '',
    grado_academico: ''
  };
  loginError: string | null = null;
  registroExitoso: string | null = null;
  registroError: string | null = null;


  // 3. Inyecta el AuthService, el Router y AHORA el PLATFORM_ID
  constructor(
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object // <-- ¡Añadido!
  ) { }

  // ... (Tu función onLoginSubmit() queda exactamente igual) ...
  onLoginSubmit() {
    this.loginError = null; 
    
    this.authService.login(this.loginData).subscribe(
      response => {
        console.log('Login exitoso!', response);
        this.authService.saveSession(response);
        this.router.navigate(['/cursos']);
      },
      error => {
        console.error('Error en el login:', error);
        this.loginError = error.error?.message || 'Usuario o contraseña incorrectos.';
      }
    );
  }

  // ... (Tu función onRegisterSubmit() queda exactamente igual) ...
  onRegisterSubmit() {
    this.registroError = null;
    this.registroExitoso = null;

    if (!this.registerData.rol) {
      this.registroError = "Por favor, selecciona un rol (Estudiante o Docente).";
      return;
    }

    const payload: RegistroRequest = {
      persona: {
        nombres: this.registerData.nombres,
        apellidos: this.registerData.apellidos,
        fecha_nacimiento: this.registerData.fecha_nacimiento,
        genero: this.registerData.genero
      },
      usuario: {
        username: this.registerData.username,
        contrasenia: this.registerData.contrasenia,
        rol: this.registerData.rol
      },
      estudiante: this.registerData.rol === 'estudiante' ? {
        nivel_educativo: this.registerData.nivel_educativo
      } : null,
      docente: this.registerData.rol === 'docente' ? {
        especialidad: this.registerData.especialidad,
        grado_academico: this.registerData.grado_academico
      } : null
    };

    this.authService.register(payload).subscribe(
      response => {
        console.log('Registro exitoso!', response);
        this.registroExitoso = '¡Cuenta creada! Por favor, inicia sesión.';
        
        // Esta línea también debe estar dentro del 'if' de abajo
        document.getElementById('botonInicioSesion')?.click();
      },
      error => {
        console.error('Error en el registro:', error);
        this.registroError = error.error?.message || 'Error al crear la cuenta. Verifique los datos.';
      }
    );
  }


  // --- LÓGICA DE ANIMACIÓN (del JSP original) ---
  
  ngAfterViewInit(): void {
    
    // 4. ¡LA SOLUCIÓN!
    //    Este 'if' comprueba si estamos en el navegador.
    //    Todo el código que usa 'document' o 'window' debe ir DENTRO de este 'if'.
    if (isPlatformBrowser(this.platformId)) {
      
      // --- CÓDIGO PARA LA ANIMACIÓN DEL PANEL ---
      const botonRegistro = document.getElementById('botonRegistro');
      const botonInicioSesion = document.getElementById('botonInicioSesion');
      const contenedorPrincipal = document.getElementById('contenedorPrincipal');
      
      botonRegistro?.addEventListener('click', () => {
        contenedorPrincipal?.classList.add('panel-derecho-activo');
      });
      
      botonInicioSesion?.addEventListener('click', () => {
        contenedorPrincipal?.classList.remove('panel-derecho-activo');
      });
      
      if (window.location.hash === '#registro') {
        contenedorPrincipal?.classList.add('panel-derecho-activo');
      }

      // --- CÓDIGO PARA CAMPOS DINÁMICOS DE ROL ---
      const rolEstudianteRadio = document.getElementById('rolEstudiante') as HTMLInputElement;
      const rolDocenteRadio = document.getElementById('rolDocente') as HTMLInputElement;
      
      const toggleRoleFields = () => {
        const camposEstudianteDiv = document.getElementById('camposEstudiante');
        const camposDocenteDiv = document.getElementById('camposDocente');
        
        if (rolEstudianteRadio.checked) {
          camposEstudianteDiv!.style.display = 'block';
          camposDocenteDiv!.style.display = 'none';
          this.registerData.rol = 'estudiante';
        } else if (rolDocenteRadio.checked) {
          camposEstudianteDiv!.style.display = 'none';
          camposDocenteDiv!.style.display = 'block';
          this.registerData.rol = 'docente';
        }
      };

      rolEstudianteRadio?.addEventListener('change', toggleRoleFields);
      rolDocenteRadio?.addEventListener('change', toggleRoleFields);

    } // Fin del 'if (isPlatformBrowser)'

  } // Fin de ngAfterViewInit

}