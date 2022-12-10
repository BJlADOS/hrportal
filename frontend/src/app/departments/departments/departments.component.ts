import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IDepartment } from 'src/app/interfaces/User';
import { DepartmentService } from 'src/app/services/department/department.service';


@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.scss']
})
export class DepartmentsComponent implements OnInit {

  public departments$: Observable<IDepartment[]> = this._departments.departments$;
  public loadingError: string | undefined;

  constructor(
    private _departments: DepartmentService,
  ) { }

  public ngOnInit(): void {
  }

}
