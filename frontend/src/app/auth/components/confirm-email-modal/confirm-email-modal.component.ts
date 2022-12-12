import { Component, OnInit } from '@angular/core';
import { Modal } from 'src/app/classes/modal/modal';

@Component({
  selector: 'app-confirm-email-modal',
  templateUrl: './confirm-email-modal.component.html',
  styleUrls: ['./confirm-email-modal.component.scss']
})
export class ConfirmEmailModalComponent extends Modal implements OnInit {

  public email: string = '';

  constructor() {
    super();
  }

  public ngOnInit(): void {
  }

  public onInjectInputs(inputs: any): void { 
    this.email = inputs.email;
  }

}
