import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApplicationLayoutComponent } from './application-layout/application-layout.component';

export const routes: Routes = [
  // {
  //   path: '',
  //   loadChildren: () => import('./application-layout/application-layout.module').then(m => m.HomeLayoutModuleModule) // Correct lazy loading for AppLayoutModule
  // },
  {
    path: "",
    redirectTo: "signin",
    pathMatch: "full"
  },

  {
    path: '',
    component: ApplicationLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./application-layout/application-layout.module').then(m => m.HomeLayoutModuleModule)
      },
    ],
  },
  {
    path: '',
    loadChildren: () => import('./auth-layout/authlayout.module').then(m => m.AuthlayoutModule) // Correct lazy loading for AppLayoutModule
  },
  {
    path: '**',  // Fallback for any undefined routes
    redirectTo: 'signin'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
