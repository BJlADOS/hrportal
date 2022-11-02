import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { FormGenerator } from 'src/app/classes/form-generator/form-generator';
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

  constructor(
    public auth: AuthService,
    public router: Router
  ) { }

  ngOnInit(): void {
    
  }

  public signUp(): void { //not implemented
    this.auth.checkEmail(this.signUpForm.value.email).subscribe((data) => {
      const isEmailUnique: boolean = (data as { unique: boolean }).unique;
      console.log(data);
      this.isEmailUnique = isEmailUnique;
    });
    this.auth.signUp(this.signUpForm.value.fullname, this.signUpForm.value.email, this.signUpForm.value.password);
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
