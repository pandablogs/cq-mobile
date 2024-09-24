import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component'; // The Home component for the main view
import { ApplicationLayoutComponent } from './application-layout.component';

const routes: Routes = [
  {
    path: '', // The base path
    component: ApplicationLayoutComponent,
    children: [
      {
        path: '',
        component: DashboardComponent // Load the HomeComponent as the default child of AppHomeLayoutComponent
      }
    ]
  },
  {
    path: 'dashboard', // Redirect root path to 'home'
    redirectTo: '',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApphomelayoutRoutingModule { }
