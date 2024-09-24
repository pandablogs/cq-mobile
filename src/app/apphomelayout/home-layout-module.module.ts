import { NgModule ,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApphomelayoutComponent } from './apphomelayout.component';
import { ApphomelayoutRoutingModule } from './apphome-routing.module';
import { HomeComponent } from './home/home.component';
import { HeadermenuComponent } from './partials/headermenu/headermenu.component';
import { SidebarComponent } from './partials/sidebar/sidebar.component';
import { StaticfooterComponent } from './partials/staticfooter/staticfooter.component';
import { SwiperModule } from 'swiper/angular';



@NgModule({
  declarations: [
    ApphomelayoutComponent,
    HomeComponent,
    StaticfooterComponent,
    SidebarComponent,
    HeadermenuComponent
  ],
  imports: [
    CommonModule,
    ApphomelayoutRoutingModule,
    SwiperModule
  ],
  schemas : [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomeLayoutModuleModule { }
