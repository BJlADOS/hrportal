import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SHA256 } from 'crypto-js';
import { FormGenerator } from 'src/app/classes/form-generator/form-generator';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  public passwordPlaceholder: string = 'Пароль';
  public emailPlaceholder: string = 'Электронная почта'
  public signInForm: FormGroup = FormGenerator.getInstance().getSignInForm();

  constructor(
    public auth: AuthService,
  ) { }

  ngOnInit(): void {
  }

  public signIn(): void { //not implemented
    console.log(this.signInForm.value);
  }

  public forgotPassword(): void { //not implemented
  }

  public makeRequest(): void { 
    this.auth.signIn(this.signInForm.value.email, this.signInForm.value.password);
  }

  public passwordBlur(): void { 
    this.passwordPlaceholder = 'Пароль';
  }

  public passwordFocus(): void {
    this.passwordPlaceholder = 'Используйте 6-20 символов (только A-Z, a-z, 0-9)';
  }

  public emailBlur(): void {
    this.emailPlaceholder = 'Электронная почта';
  }

  public emailFocus(): void {
    this.emailPlaceholder = 'Используйте корпоративную почту';
  }

}
