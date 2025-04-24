import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: 'index', loadComponent: () => import('./index/index.component').then( c => c.IndexComponent)
  },{
    path: 'index/:id', loadComponent: () => import('./index/index.component').then( c => c.IndexComponent)
  },
  {
    path: 'create', loadComponent: () => import('./create/index/index.component').then( c => c.IndexComponent)
  }
];

export default routes;