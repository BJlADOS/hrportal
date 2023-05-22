import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ISkill } from '../interfaces';

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
        this.http.get<ISkill[]>(`${this._apiUrl}/skills/`).subscribe({
            next: (data: ISkill[]) => {
                this.skillsSubject$.next(data);
            }
        });

        return this.http.get<ISkill[]>(`${this._apiUrl}/skills/`) as Observable<ISkill[]>;
    }

    public getSkillsById(ids: number[]): ISkill[] {
        return this.skillsSubject$.value.filter((skill: ISkill) => ids.includes(skill.id));
    }

    public addSkill(skillName: string): Observable<ISkill> {
        return this.http.post<ISkill>(`${this._apiUrl}/skills/`, { name: skillName });
    }

    public removeSkill(id: number): Observable<{ detail: string }> {
        return this.http.delete<{ detail: string }>(`${this._apiUrl}/skills/${id}/`);
    }

}
