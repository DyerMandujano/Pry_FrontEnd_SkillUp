import { Routes } from '@angular/router';
import { CursoComponent } from './components/curso/curso.component';
import { DocenteComponent } from './components/docente/docente.component';
import { RegistrarCursoComponent } from './components/curso/registrar-curso/registrar-curso.component';

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
    path : 'docente/:id',
    component: DocenteComponent
},

 { path: 'docente/:id/registrar-curso', component: RegistrarCursoComponent },

{
    path : '**',
    redirectTo: ''
}


];
