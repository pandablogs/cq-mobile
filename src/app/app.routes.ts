import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'dashboard',
    loadChildren: () => import('./application-layout/application-layout.module').then(m => m.HomeLayoutModuleModule) // Correct lazy loading for AppLayoutModule
  },
  {
    path: '',
    loadChildren: () => import('./auth-layout/authlayout.module').then(m => m.AuthlayoutModule) // Correct lazy loading for AppLayoutModule
  },
  {
    path: '**',  // Fallback for any undefined routes
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
