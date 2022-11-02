import { Component, Input, OnInit } from '@angular/core';
import { IInputError } from 'src/app/interfaces/errors';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {

  @Input() public error!: IInputError;

  constructor() { }

  ngOnInit(): void {
  }

}
