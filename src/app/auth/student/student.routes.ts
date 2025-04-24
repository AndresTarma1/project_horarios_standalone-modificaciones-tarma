
import { Routes } from '@angular/router';
import { StudentComponent } from './student.component';

const routes: Routes = [{
  path: '', component: StudentComponent,
  children: [
    {
      path: 'main', loadComponent: () => import('./main/main.component').then( c => c.MainComponent)
    },
    {
      path: 'profile', loadComponent: () => import('./perfil/perfil.component').then( c => c.PerfilComponent)
    }
    ,{
      path: 'schedule', loadComponent: () => import('./horario/horario.component').then( c => c.HorarioComponent)
    },{
      path: '**', redirectTo: 'main'
    }
]
  },
  {
    path: '**', redirectTo: ''
  },
];

export default routes;