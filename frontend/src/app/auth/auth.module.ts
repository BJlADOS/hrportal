import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponent } from './components/auth/auth.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { AuthMainComponent } from './components/auth-main/auth-main.component';
import { authRouting } from './auth-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';



@NgModule({
  declarations: [
    AuthComponent,
    RegistrationComponent,
    AuthMainComponent,
  ],
  imports: [
    CommonModule,
    authRouting,
    ReactiveFormsModule,
    HttpClientModule,
  ]
})
export class AuthModule { }
