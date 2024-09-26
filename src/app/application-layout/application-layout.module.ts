import { NgModule ,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationLayoutComponent } from './application-layout.component';
import { ApphomelayoutRoutingModule } from './application-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeadermenuComponent } from './partials/headermenu/headermenu.component';
import { SidebarComponent } from './partials/sidebar/sidebar.component';
import { StaticfooterComponent } from './partials/staticfooter/staticfooter.component';
import { SwiperModule } from 'swiper/angular';
import { LiquidityComponent } from './dashboard/components/liquidity/liquidity.component';
import { ToastrModule } from 'ngx-toastr';
import { BreakDownComponent } from './dashboard/components/breakdown/breakdown.component';

import {MatDatepickerModule} from '@angular/material/datepicker';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';

import {MatButtonModule} from '@angular/material/button'
import {MatCardModule} from '@angular/material/card';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatTabsModule} from '@angular/material/tabs';

import { DashboardCalendarComponent } from './dashboard/components/dashboard-calender/dashboard-calendar.component';
import { ProfileComponent } from './profile/profile.component';
import { GeneralComponent } from './profile/component/general/general.component';
import { PasswordComponent } from './profile/component/password/password.component';



@NgModule({
  declarations: [
    ApplicationLayoutComponent,
    DashboardComponent,
    StaticfooterComponent,
    SidebarComponent,
    HeadermenuComponent,
    LiquidityComponent,
    BreakDownComponent,
    DashboardCalendarComponent,
    ProfileComponent,
    PasswordComponent,
    GeneralComponent
  ],
  imports: [
    CommonModule,
    ApphomelayoutRoutingModule,
    SwiperModule,
    ToastrModule,
    MatDatepickerModule,
    MatCardModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
    MatTabsModule
  ],
  providers:[provideNativeDateAdapter()],
  schemas : [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomeLayoutModuleModule { }
