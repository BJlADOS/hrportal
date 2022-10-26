import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponent } from './components/auth/auth.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { AuthMainComponent } from './components/auth-main/auth-main.component';
import { authRouting } from './auth-routing.module';
import { ReactiveFormsModule } from '@angular/forms';



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
  ]
})
export class AuthModule { }
