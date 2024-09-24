import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component'; // The Home component for the main view
import { ApphomelayoutComponent } from './apphomelayout.component';

const routes: Routes = [
  {
    path: '', // The base path
    component: ApphomelayoutComponent,
    children: [
      {
        path: '',
        component: HomeComponent // Load the HomeComponent as the default child of AppHomeLayoutComponent
      }
    ]
  },
  {
    path: 'home', // Redirect root path to 'home'
    redirectTo: '',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApphomelayoutRoutingModule { }
