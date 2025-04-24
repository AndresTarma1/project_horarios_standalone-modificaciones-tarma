import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: 'index', loadComponent: () => import('./index/index.component').then( c => c.IndexComponent)
  },
  {
    path: 'create', loadComponent: () => import('./create/create.component').then( c => c.CreateComponent)
  }
];

export default routes;