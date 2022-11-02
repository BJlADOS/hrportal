import { Component, Input, OnInit } from '@angular/core';
import { IInputError } from 'src/app/interfaces/errors';

@Component({
  selector: 'app-errors',
  templateUrl: './errors.component.html',
  styleUrls: ['./errors.component.scss']
})
export class ErrorsComponent implements OnInit {

  @Input() public errors: IInputError[] = [];

  constructor() { }

  public ngOnInit(): void {
  }

}
