import { Routes } from '@angular/router';
import { NavBarComponent } from './nav-bar.component';

export const routes: Routes = [
  {
    path: '',
    component: NavBarComponent,
    children: [
      {
        path: 'subjects', loadComponent: () => import('../subjects/index/index.component').then( c => c.IndexComponent)
      },
      {
        path: 'carreras/index', loadComponent: () => import('../carreras/index/index-v2.component').then( c  => c.IndexV2Component)
      },
      {
        path: 'dashboard',
        loadComponent: () => import('../dashboard/dashboard.component').then( (c) => c.CoordinatorDashboardComponent )
      },
      {
        path: 'config',
        redirectTo: 'profile',
      },
      {
        path: 'groups',
        loadComponent: () =>
          import('../grupos/index/index.component').then(
            (c) => c.IndexComponent
          ),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('../profile/profile.component').then(
            (c) => c.ProfileComponent
          ),
      },
      {
        path: 'subject/teacher',
        loadComponent: () =>
          import('../add-subject-teacher/add-subject-teacher.component').then(
            (c) => c.AddSubjectTeacherComponent
          ),
      },
      {
        path: 'horario',
        loadChildren: () => import('../horarios/horarios.routes'),
      },{
        path: 'carreras/create',
        loadComponent: () => import('../carreras/create/create.component').then( (c) => c.CreateComponent)
      },
      {
        path: '**',
        redirectTo: 'profile',
      },
    ],
  },
];

export default routes;
