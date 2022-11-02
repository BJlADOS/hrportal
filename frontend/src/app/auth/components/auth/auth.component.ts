import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { SHA256 } from 'crypto-js';
import { FormGenerator } from 'src/app/classes/form-generator/form-generator';
import { FormManager } from 'src/app/classes/form-manager/form-manager';
import { IInputError } from 'src/app/interfaces/errors';
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
  public errors: IInputError[] = [];

  constructor(
    public auth: AuthService,
    public router: Router,
  ) { }

  ngOnInit(): void {
  }

  public signIn(): void { //not implemented
    this.checkErrors();
    if (this.errors.length !== 0) {
      return;
    }
    this.auth.signIn(this.signInForm.value.email, this.signInForm.value.password);
  }

  public forgotPassword(): void { //not implemented
  }

  public checkErrors(): void {
    this.errors = FormManager.getInstance().checkErrorsForSignInForm(this.signInForm);
  }

  public toSignUp(): void { 
    this.router.navigate(['register']);
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
