import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SHA256 } from 'crypto-js';
import { CookieService } from 'ngx-cookie';
import { BehaviorSubject, Observable } from 'rxjs';
import { IToken } from 'src/app/interfaces/Token';
import { IUser } from 'src/app/interfaces/User';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public currentUserSubject: BehaviorSubject<IUser | null> = new BehaviorSubject<IUser | null>(null);
  public currentUser: Observable<IUser | null> = this.currentUserSubject.asObservable();

  private apiURL: string = environment.apiURL;

  constructor(
    public http: HttpClient,
    private cookie: CookieService,
    ) { 
    }

  public get currentUserValue(): IUser | null {
    return { fullName: 'test', email: 'test', contact: 'test', expirience: 1, currentDepartment: { id: 1, name: 'test', managerId: 1 }, imageURL: 'test', existingSkills: [{ id: 1, name: 'test' }], isManager: true, isAdmin: true, id: 1 };
  }

  public signUp(name: string, firstName: string, middleName: string, email: string, password: string): void {
    const passwordHash: string = SHA256(password).toString();
    const fullname: string = `${name} ${firstName} ${middleName}`;
    this.http.post(`${ this.apiURL }/reg`, { fullname: fullname, email: email, password: passwordHash  }).subscribe((data) => {
      console.log(data);
    });
  }

  public signIn(email: string, password: string): void {
    const passwordHash: string = SHA256(password).toString();
    this.http.post(`${this.apiURL}/auth`, { email: email, password: passwordHash }).subscribe((data) => {
      const token: IToken = data as IToken;
      this.cookie.put('token', token.token);
      console.log(data);
      console.log(this.cookie.get('token'));
    });
  }

  public validateToken(): void {
    this.http.get(`${this.apiURL}/valid-token`).subscribe((data) => {
      console.log(data);
    });
  }

  public logOut(): void { 
    this.currentUserSubject.next(null);
    this.cookie.remove('token');
  }

}
