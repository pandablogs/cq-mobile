import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component'; // The Home component for the main view
import { ApplicationLayoutComponent } from './application-layout.component';
import { ProfileComponent } from './profile/profile.component';
import { PipelineComponent } from './pipeline/pipeline.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent, // Load the HomeComponent as the default child of AppHomeLayoutComponent
  },
  {
    path: 'profile',
    component: ProfileComponent,
  },
  {
    path:'pipeline',
    component: PipelineComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApphomelayoutRoutingModule {}
