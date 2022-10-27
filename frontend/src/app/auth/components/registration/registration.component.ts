import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormGenerator } from 'src/app/classes/form-generator/form-generator';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  public signUpForm: FormGroup = FormGenerator.getInstance().getSignUpForm();

  constructor(
    public auth: AuthService,
  ) { }

  ngOnInit(): void {
    
  }

  public signUp(): void { //not implemented
    this.auth.signUp(this.signUpForm.value.name, this.signUpForm.value.firstName, this.signUpForm.value.middleName, this.signUpForm.value.email, this.signUpForm.value.password);
  }
}
