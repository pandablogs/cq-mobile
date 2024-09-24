import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthlayoutRoutingModule } from './authlayout-routing.module';
import { VerifyComponent } from './verify/verify.component';
import { ForgetpasswordComponent } from './forgetpassword/forgetpassword.component';
import { LandingComponent } from './landing/landing.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { SplashComponent } from './splash/splash.component';
import { ThankyouComponent } from './thankyou/thankyou.component';
import { Thankyou2Component } from './thankyou2/thankyou2.component';
import { AuthlayoutComponent } from './authlayout.component';
import { RouterModule } from '@angular/router';
import { SwiperModule } from 'swiper/angular';

@NgModule({
  declarations: [
    AuthlayoutComponent,
    VerifyComponent,
    Thankyou2Component,
    ThankyouComponent,
    SplashComponent,
    SignupComponent,
    SigninComponent,
    ResetpasswordComponent,
    LandingComponent,
    ForgetpasswordComponent
  ],
  imports: [
    CommonModule,
    AuthlayoutRoutingModule,
    RouterModule,
    SwiperModule
  ]
})
export class AuthlayoutModule { }