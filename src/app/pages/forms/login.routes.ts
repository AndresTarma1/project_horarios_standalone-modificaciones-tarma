import { Routes } from "@angular/router";

export const routes: Routes = [{
  path: 'admin', loadComponent: () => import('./admin-login/admin-login.component'), title: 'Admin'
},{
  path: 'student', loadComponent: () => import('./student-login/student-login.component'), title: 'Estudiante'
},{
  path: 'teacher', loadComponent: () => import('./teacher-login/teacher-login.component'), title: 'Profesor'
},{
  path: 'coordinator', loadComponent: () => import('./coordinator-login/coordinator-login.component'), title: 'Coordinador'
}];

export default routes;
