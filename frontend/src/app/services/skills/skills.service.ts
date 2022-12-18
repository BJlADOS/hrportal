import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ISkill } from 'src/app/interfaces/User';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SkillsService {

  public skillsSubject$ = new BehaviorSubject<ISkill[]>([]);
  public skills$ = this.skillsSubject$.asObservable();

  private _apiUrl = environment.apiURL;

  constructor(
    public http: HttpClient,
  ) { }

  public getSkills(): Observable<ISkill[]> {
    this.http.get<ISkill[]>(`${this._apiUrl}/skills`).subscribe({
      next: (data: ISkill[]) => {
        this.skillsSubject$.next(data);
      }
    });
    return this.http.get<ISkill[]>(`${this._apiUrl}/skills`) as Observable<ISkill[]>;
  }

  public getSkillsById(ids: number[]): ISkill[] {
    return this.skillsSubject$.value.filter((skill: ISkill) => ids.includes(skill.id));
  }

}
