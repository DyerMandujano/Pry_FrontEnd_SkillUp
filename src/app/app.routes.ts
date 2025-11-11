import { Routes } from '@angular/router';
import { CursoComponent } from './components/curso/curso.component';
import { DocenteComponent } from './components/docente/docente.component';
import { RegistrarCursoComponent } from './components/curso/registrar-curso/registrar-curso.component';
import { ActualizarCursoComponent } from './components/curso/actualizar-curso/actualizar-curso.component';
import { SeccionComponent } from './components/seccion/seccion.component';
import { RegistrarSeccionComponent } from './components/seccion/registrar-seccion/registrar-seccion.component';
import { ActualizarSeccionComponent } from './components/seccion/actualizar-seccion/actualizar-seccion.component';
import { LeccionComponent } from './components/leccion/leccion.component';
import { RegistrarLeccionComponent } from './components/leccion/registrar-leccion/registrar-leccion.component';
import { ActualizarLeccionComponent } from './components/leccion/actualizar-leccion/actualizar-leccion.component';

// 1. Importamos el nuevo componente
import { AutenticacionComponent } from './components/autenticacion/autenticacion.component';

export const routes: Routes = [

{
    path : '',
    redirectTo: 'login', // <-- OJO: Más adelante quizás quieras cambiar esto a 'login'
    pathMatch: 'full'
},

// 2. Añadimos las nuevas rutas
{
    path: 'login',
    component: AutenticacionComponent
},
{
    path: 'registro', // Para que funcione el hash del JSP que migramos
    component: AutenticacionComponent
},


// --- TUS RUTAS EXISTENTES ---
{
    path : 'cursos',
    component:CursoComponent
},
{
    path : 'actualizar-curso/:id',
    component:ActualizarCursoComponent
},
{
    path : 'docente/:id',
    component: DocenteComponent
},
// ... (todas tus otras rutas)
{ path: 'actualizar-leccion/:id', component: ActualizarLeccionComponent },

{
    path : '**',
    redirectTo: ''
}

];