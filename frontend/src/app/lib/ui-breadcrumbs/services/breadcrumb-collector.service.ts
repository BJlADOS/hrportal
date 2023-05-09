import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, Observable, takeUntil } from 'rxjs';
import { ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, Router, UrlSegment } from '@angular/router';
import { IBreadcrumb } from '../interfaces/breadcrumb.interface';
import { DestroyService } from '../../utils';

@Injectable()
export class BreadcrumbCollectorService {
    public get breadcrumbs$(): Observable<IBreadcrumb[] | null> {
        return this._breadcrumbs$.asObservable();
    }

    private _breadcrumbs$: BehaviorSubject<IBreadcrumb[] | null> = new BehaviorSubject<IBreadcrumb[] | null>(null);

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _destroy$: DestroyService,
        private _router: Router
    ) {
        this.setupCollecting();
    }

    /**
     * Установить обновление хлебных крошек по смене роута
     * */
    public setupCollecting(): void {
        this._breadcrumbs$.next(this.collectBreadcrumbs(this._activatedRoute.root.snapshot));

        this._router.events
            .pipe(
                filter((event: any) => event instanceof NavigationEnd),
                takeUntil(this._destroy$)
            )
            .subscribe(() => {
                this._breadcrumbs$.next(this.collectBreadcrumbs(this._activatedRoute.root.snapshot));
            });
    }

    /**
     * Собрать хлебные крошки
     * */
    private collectBreadcrumbs(snapshot: ActivatedRouteSnapshot, url: string = '', breadcrumbs: IBreadcrumb[] = []): IBreadcrumb[] {
        const routeURL: string = snapshot.url.map((segment: UrlSegment) => segment.path).join('/');
        const label: string = snapshot.data['breadcrumb'];

        if (routeURL !== '') {
            url += `/${routeURL}`;
        }

        const isMatchWithLast: boolean = breadcrumbs.length > 0 && breadcrumbs[breadcrumbs.length - 1].label === label;

        if (label && !isMatchWithLast) {
            breadcrumbs.push({ label, url });
        }

        if (!snapshot.firstChild) {
            return breadcrumbs;
        } else {
            return this.collectBreadcrumbs(snapshot.firstChild, url, breadcrumbs);
        }
    }
}
