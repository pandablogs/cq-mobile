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



@NgModule({
  declarations: [
    ApplicationLayoutComponent,
    DashboardComponent,
    StaticfooterComponent,
    SidebarComponent,
    HeadermenuComponent,
    LiquidityComponent
  ],
  imports: [
    CommonModule,
    ApphomelayoutRoutingModule,
    SwiperModule,
    ToastrModule
  ],
  schemas : [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomeLayoutModuleModule { }
