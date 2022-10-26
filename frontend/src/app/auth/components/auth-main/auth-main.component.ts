import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormGenerator } from 'src/app/classes/form-generator/form-generator';
import { authType } from 'src/app/types/auth-type';

@Component({
  selector: 'app-auth-main',
  templateUrl: './auth-main.component.html',
  styleUrls: ['./auth-main.component.scss']
})
export class AuthMainComponent implements OnInit {

  public authType: authType = 'sign-in';
  

  constructor() { }

  ngOnInit(): void {
  }

  public setAuthType(authType: authType): void {
    this.authType = authType;
  }

}
