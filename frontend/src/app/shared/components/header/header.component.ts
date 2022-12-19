import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivationEnd, ActivationStart, ChildActivationEnd, ChildActivationStart, NavigationEnd, RouteConfigLoadEnd, RouteConfigLoadStart, Router, RouterEvent, Scroll, UrlSegment } from '@angular/router';
import { filter, map, Observable, takeUntil } from 'rxjs';
import { IBreadcrumb } from 'src/app/interfaces/breadcrumb';
import { IRoute, IUser } from 'src/app/interfaces/User';
import { AuthService } from 'src/app/services/auth/auth.service';
import { DestroyService } from 'src/app/services/destoy/destroy.service';
import { ModalService } from 'src/app/services/modal/modal.service';
import { UserService } from 'src/app/services/user/user.service';
import { adminButtons } from 'src/app/user-type-data/admin-header-buttons';
import { managerButtons } from 'src/app/user-type-data/manager-header-buttons';
import { userButtons } from 'src/app/user-type-data/user-header-buttons';
import { CreateResumeComponent } from '../create-resume/create-resume.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
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
    private _auth: AuthService,
    private _router: Router,
    private _modal: ModalService,
    private _destroy$: DestroyService,
  ) { }

  public ngOnInit(): void {
    this.breadcrumbs = this.createBreadcrumbs(this.activatedRoute.root);
        this._router.events
            .pipe(filter((event: RouterEvent | RouteConfigLoadStart | RouteConfigLoadEnd | ChildActivationStart | ChildActivationEnd | ActivationStart | ActivationEnd | Scroll) => event instanceof NavigationEnd), takeUntil(this._destroy$))
            .subscribe(() => this.breadcrumbs = this.createBreadcrumbs(this.activatedRoute.root));
    this.user.pipe(takeUntil(this._destroy$)).subscribe((user: IUser | null) => {
      this.routes = user?.isAdmin ? adminButtons : user?.isManager ? managerButtons : userButtons;
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
    this._modal.open(CreateResumeComponent).onResult().pipe(takeUntil(this._destroy$), map(result => result === null)).subscribe((result: boolean) => {
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
    this._router.navigate(['profile']);
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
