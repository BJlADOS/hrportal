import { Component, Input, OnInit } from '@angular/core';
import { contentExpansion } from 'src/app/animations/content-expansion/content-expansion';
import { IAuthError, IInputError } from 'src/app/interfaces/errors';

@Component({
  selector: 'app-errors',
  templateUrl: './errors.component.html',
  styleUrls: ['./errors.component.scss'],
  animations: [
    contentExpansion,
  ]
})
export class ErrorsComponent implements OnInit {

  @Input() public errors!: IAuthError;

  constructor() { }

  public ngOnInit(): void {
  }

}
