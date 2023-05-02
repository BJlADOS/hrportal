import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DepartmentService } from '../../department';
import { IResume, IResumeUpdate } from '../../resume';
import { IUser, IUserUpdate } from '../interfaces';
import { SkillsService } from '../../skill';
import { environment } from '../../../../environments/environment';


@Injectable({
    providedIn: 'root'
})
export class UserService {

    public currentUserSubject$: BehaviorSubject<IUser | null> = new BehaviorSubject<IUser | null>(null);
    public currentUser$: Observable<IUser | null> = this.currentUserSubject$.asObservable();
    public profileFilledStatusSubject$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public profileFilledStatus$: Observable<boolean> = this.profileFilledStatusSubject$.asObservable();

    private _apiURL: string = environment.apiURL;
    private _mediaURL: string = environment.mediaURL;

    constructor(
        public http: HttpClient,
        private _department: DepartmentService,
        private _skills: SkillsService,
    ) { }

    public get currentUserValue(): IUser | null {
        return this.currentUserSubject$.value;
    }

    public updateCurrentUser(user: IUser): void {
        this.currentUserSubject$.next(this.fixPhotoUrl(user));
    }

    public getUserInfo(): void {
        this.http.get(`${this._apiURL}/user`).subscribe({ next: (data) => {
            const user = data as IUser;
            if (!this.currentUserValue) {
                this.profileFilledStatusSubject$.next(user.filled);
            }
            this.currentUserSubject$.next(this.fixPhotoUrl(user));
            this._department.getDepartments();
            this._skills.getSkills();
        } });
    }

    public updateUserInfo(user: IUserUpdate): Observable<IUser> {
        const data = this.parseToFormData(user);
        this.profileFilledStatusSubject$.next(true);

        return this.http.patch(`${this._apiURL}/user/`, data) as Observable<IUser>;
    }

    public confirmEmail(token: string): Observable<any> {
        return this.http.post(`${this._apiURL}/verify-email/`, { code: token }) as Observable<any>;
    }

    public getUserById(id: number): Observable<IUser> {
        return this.http.get(`${this._apiURL}/users/${id}`) as Observable<IUser>;
    }

    public getUsers(): Observable<IUser[]> {
        return this.http.get(`${this._apiURL}/users`) as Observable<IUser[]>;
    }

    public getResume(): Observable<IResume> {
        return this.http.get(`${this._apiURL}/user/resume`) as Observable<IResume>;
    }

    public createResume(resume: IResumeUpdate): Observable<IResume> {
        const data = this.parseToFormData(resume);

        return this.http.post(`${this._apiURL}/user/resume/`, data) as Observable<IResume>;
    }

    public updateResume(resume: IResumeUpdate): Observable<IResume> {
        const data = this.parseToFormData(resume);

        return this.http.patch(`${this._apiURL}/user/resume/`, data) as Observable<IResume>;
    }

    public getUserName(): string {
        return `${this.currentUserValue?.fullname.split(' ')[0]} ${this.currentUserValue?.fullname.split(' ')[1]}`;
    }

    public logOut(): void {
        this.currentUserSubject$.next(null);
    }

    public parseToFormData(data: any): FormData { //move to utils
        const formData = new FormData();
        Object.keys(data).forEach((key, i) => {
            if (Object.values(data)[i]) {
                Array.isArray(Object.values(data)[i]) ? (Object.values(data)[i] as any[]).forEach((element: any) => {
                    formData.append(key, element);
                }) : formData.append(key, Object.values(data)[i] as string | Blob);
            }
        });

        return formData;
    }


    private fixPhotoUrl(user: IUser): IUser {
        if (user.photo) {
            user.photo = `${this._mediaURL}${user.photo}`;
        }

        return user;
    }
}
