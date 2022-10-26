import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormGenerator } from 'src/app/classes/form-generator/form-generator';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  public signInForm: FormGroup = FormGenerator.getInstance().getSignInForm();

  constructor() { }

  ngOnInit(): void {
  }

  public signIn(): void { //not implemented
    console.log(this.signInForm.value);
  }

  public forgotPassword(): void { //not implemented
  }

}
