import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, UrlSegment } from '@angular/router';
import { filter, map, Observable, takeUntil } from 'rxjs';
import { AuthorizationService, CreateResumeComponent, IUser, UserService } from '../../../../common';
import { IBreadcrumb, IRoute } from '../../interfaces';
import { BUTTONS_DATA_TOKEN, DestroyService, ModalService, UserType } from '../../../../lib';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    providers: [
        {
            provide: BUTTONS_DATA_TOKEN,
            useValue: {
                [UserType.employee]: [
                    {
                        path: 'cabinet/vacancies',
                        name: 'Вакансии',
                    }
                ],
                [UserType.manager]: [
                    {
                        path: 'cabinet/vacancies',
                        name: 'Вакансии',
                    },
                    {
                        path: 'cabinet/resumes',
                        name: 'Резюме',
                    }
                ],
                [UserType.administrator]: [
                    {
                        path: 'cabinet/vacancies',
                        name: 'Вакансии',
                    },
                    {
                        path: 'cabinet/department',
                        name: 'Департаменты',
                    },
                    {
                        path: 'cabinet/resumes',
                        name: 'Резюме',
                    }
                ]
            }
        }
    ]
})
export class HeaderComponent implements OnInit {

    public user: Observable<IUser | null> = this._user.currentUser$;
    public breadcrumbs: IBreadcrumb[] = [];
    public routes: IRoute[] = [];

    public isCreatingResume: boolean = false;
    public profileFilled$: Observable<boolean> = this._user.profileFilledStatus$;

    constructor(
        public activatedRoute: ActivatedRoute,
        private _user: UserService,
        private _auth: AuthorizationService,
        private _router: Router,
        private _modal: ModalService,
        private _destroy$: DestroyService,
        @Inject(BUTTONS_DATA_TOKEN) private _buttonsData: Record<UserType, IRoute[]>
    ) { }

    public ngOnInit(): void {
        this.breadcrumbs = this.createBreadcrumbs(this.activatedRoute.root);

        this._router.events
            .pipe(
                filter((event: any) => event instanceof NavigationEnd),
                takeUntil(this._destroy$)
            )
            .subscribe(() => this.breadcrumbs = this.createBreadcrumbs(this.activatedRoute.root));

        this.user
            .pipe(
                takeUntil(this._destroy$)
            )
            .subscribe((user: IUser | null) => {
                if (user?.isAdmin) {
                    this.routes = this._buttonsData[UserType.administrator];
                } else if (user?.isManager) {
                    this.routes = this._buttonsData[UserType.manager];
                } else {
                    this.routes = this._buttonsData[UserType.employee];
                }
            });
    }

    public redirectTo(to: string): void {
        this._router.navigate([to]);
    }

    public isActive(path: string): boolean {
        return this._router.url === path;
    }

    public getUserName(fullname: string): string {
        const name: string[] = fullname.split(' ');

        return `${name[0]} ${name[1]}`;
    }

    public createResume(): void {
        this.isCreatingResume = true;
        this._modal.open(CreateResumeComponent).onResult()
            .pipe(
                takeUntil(this._destroy$),
                map(result => result === null)
            )
            .subscribe((result: boolean) => {
                this.isCreatingResume = result;
            });
    }

    public logout(): void {
        this._auth.logOut();
    }

    public closeNotification(): void {
        this._user.profileFilledStatusSubject$.next(true);
    }

    public toProfile(): void {
        this._router.navigate(['cabinet/profile']);
    }

    private createBreadcrumbs(route: ActivatedRoute, url: string = '', breadcrumbs: IBreadcrumb[] = []): IBreadcrumb[] {
        const children: ActivatedRoute[] = route.children;
        if (children.length === 0) {
            return breadcrumbs;
        }

        for (const child of children) {
            const routeURL: string = child.snapshot.url.map((segment: UrlSegment) => segment.path).join('/');
            if (routeURL !== '') {
                url += `/${routeURL}`;
            }
            const label: string = child.snapshot.data['breadcrumb'];
            if (label) {
                breadcrumbs.push({ label, url });
            }

            return this.createBreadcrumbs(child, url, breadcrumbs);
        }

        return breadcrumbs;
    }

}
