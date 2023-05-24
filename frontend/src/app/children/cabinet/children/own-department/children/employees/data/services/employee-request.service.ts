import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IEmployeeResponse } from '../response-interfaces/employee-response.interface';
import { EmployeeEndpoints } from '../endpoints/employee.endpoints';
import { IEmployeeRequestParams } from '../param-interfaces/employee-request-params.interface';
import { IPage } from '../../../../../../../../lib';

@Injectable()
export class EmployeeRequestService {

    constructor(private _httpClient: HttpClient) { }

    public getEmployeeList(params: IEmployeeRequestParams): Observable<IEmployeeResponse[]> {
        return this._httpClient.get<IEmployeeResponse[]>(
            EmployeeEndpoints.employeeList,
            {
                params: { ...params }
            }
        );
    }

    public deleteEmployee(id: string): Observable<void> {
        return this._httpClient.delete<void>(`${EmployeeEndpoints.employeeList}/${id}/`);
    }

    public getEmployeePage(params: IEmployeeRequestParams): Observable<IPage<IEmployeeResponse>> {
        return this._httpClient.get<IPage<IEmployeeResponse>>(
            EmployeeEndpoints.employeeList,
            {
                params: { ...params }
            }
        );
    }

    public getEmployeeById(id: number): Observable<IEmployeeResponse> {
        return this._httpClient.get<IEmployeeResponse>(
            EmployeeEndpoints.employeeById(id)
        );
    }
}
