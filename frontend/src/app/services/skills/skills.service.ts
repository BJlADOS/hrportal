import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ISkill } from 'src/app/interfaces/User';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SkillsService {

  private _apiUrl = environment.apiURL;

  constructor(
    public http: HttpClient,
  ) { }

  public getSkills(): Observable<ISkill[]> {
    return this.http.get(`${this._apiUrl}/skills`) as Observable<ISkill[]>;
  }

}
