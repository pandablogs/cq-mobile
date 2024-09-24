import { NgModule ,CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { ApphomelayoutComponent } from './apphomelayout/apphomelayout.component';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule, routes } from './app.routes';



@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    AppRoutingModule,
  ],
  bootstrap: [AppComponent],
  schemas : [CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule { }
