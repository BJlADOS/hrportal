import { environment } from '../../../../../../../../../environments/environment';

const apiEndpoint: string = environment.apiURL;

export class EmployeeEndpoints {
    public static employeeList: string = apiEndpoint + '/users';
    public static employeeById(id: number): string {
        return `${EmployeeEndpoints.employeeList}/${id}/`;
    }

    public static deleteUser(id: number): string {
        return `${EmployeeEndpoints.employeeById(id)}final/`;
    }
}
