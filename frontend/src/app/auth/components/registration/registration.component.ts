import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormGenerator } from 'src/app/classes/form-generator/form-generator';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  public signUpForm: FormGroup = FormGenerator.getInstance().getSignUpForm();

  constructor() { }

  ngOnInit(): void {
    
  }

  public signUp(): void { //not implemented

  }
}
