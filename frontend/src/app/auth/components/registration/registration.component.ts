import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { FormGenerator } from 'src/app/classes/form-generator/form-generator';
import { FormManager } from 'src/app/classes/form-manager/form-manager';
import { IAuthError } from 'src/app/interfaces/errors';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  public signUpForm: FormGroup = FormGenerator.getInstance().getSignUpForm();
  public passwordPlaceholder: string = 'Пароль';
  public emailPlaceholder: string = 'Электронная почта';
  public isEmailUnique: boolean = true;
  public errors: IAuthError = { fullname: null, email: null, password: null, confirmPassword: null };

  private _FormManager: FormManager = FormManager.getInstance();

  constructor(
    public auth: AuthService,
    public router: Router
  ) { }

  ngOnInit(): void {
    
  }

  public signUp(): void { //not implemented
    this.auth.checkEmail(this.signUpForm.value.email).subscribe((data) => {
      const isEmailUnique: boolean = (data as { unique: boolean }).unique;
      if (isEmailUnique) {
        this.auth.signUp(this.signUpForm.value.fullname, this.signUpForm.value.email, this.signUpForm.value.password);
      } else {
      console.log(data);
      this.isEmailUnique = isEmailUnique;
      }
    });
    
  }

  public fullnameChange(): void {
    this.errors.fullname = this._FormManager.checkFullname(this.signUpForm);
  }

  public emailChange(): void {
    this.errors.email = this._FormManager.checkEmail(this.signUpForm);
  }

  public passwordChange(): void {
    this.errors.password = this._FormManager.checkPassword(this.signUpForm);
  }

  public confirmPasswordChange(): void {
    this.errors.confirmPassword = this._FormManager.checkConfirmPassword(this.signUpForm);
  }

  public toSignIn(): void {
    this.router.navigate(['/auth']);
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
