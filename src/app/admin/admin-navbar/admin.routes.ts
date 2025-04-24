import { Routes } from "@angular/router";
import { AdminNavbarComponent } from "./admin-navbar.component";

export const routes: Routes = [
  {
    path: '', component: AdminNavbarComponent,
    children: [
      {
        path: 'student', loadChildren: () => import('../student/student.routes')
      },
      {
        path: 'teacher', loadChildren: () => import('../teacher/teacher.routes')
      },
      {
        path: 'coordinator', loadChildren: () => import('../coordinator/coordinator.routes')
      },
      {
        path: 'profile', loadComponent: () => import('../components/profile/profile.component').then( c => c.ProfileComponent)
      },
      {
        path: '**', redirectTo : 'profile'
      }
    ]
  }
];

export default routes;