import { Routes } from '@angular/router';
import { CursoComponent } from './components/curso/curso.component';

export const routes: Routes = [

{
    path : '',
    component:CursoComponent
},



{
    path : '**',
    redirectTo: ''
}


];
