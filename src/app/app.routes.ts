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

export const routes: Routes = [

{
    path : '',
    //CON EL redirectTo REDIRIGIMOS AL path que DESEAMOS
    redirectTo: 'cursos',
    pathMatch: 'full'
},

{
    //El path nos permite ASIGNARLE EL COMPONENTE QUE SE DESEA MOSTRAR CON LA PROPIEDAD Component
    path : 'cursos',
    component:CursoComponent
},

{
    //El path nos permite ASIGNARLE EL COMPONENTE QUE SE DESEA MOSTRAR CON LA PROPIEDAD Component
    path : 'actualizar-curso/:id',
    component:ActualizarCursoComponent
},

{
    path : 'docente/:id',
    component: DocenteComponent
},

{ path: 'docente/:id/registrar-curso', component: RegistrarCursoComponent },

 //SECCION
{ path: 'seccion/curso/:id', component: SeccionComponent },
{ path: 'curso/:id/registrar-seccion', component: RegistrarSeccionComponent },
{ path: 'actualizar-seccion/:id', component: ActualizarSeccionComponent },

//LECCION
{ path: 'leccion/seccion/:id', component: LeccionComponent },
{ path: 'seccion/:id/registrar-leccion', component: RegistrarLeccionComponent },
{ path: 'actualizar-leccion/:id', component: ActualizarLeccionComponent },

{
    path : '**',
    redirectTo: ''
}


];
