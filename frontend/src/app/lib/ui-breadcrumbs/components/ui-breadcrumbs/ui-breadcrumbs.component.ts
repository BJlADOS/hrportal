import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BreadcrumbCollectorService } from '../../services/breadcrumb-collector.service';
import { Observable } from 'rxjs';
import { IBreadcrumb } from '../../interfaces/breadcrumb.interface';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DestroyService } from '../../../utils';

@Component({
    selector: 'ui-breadcrumbs',
    templateUrl: './ui-breadcrumbs.component.html',
    styleUrls: ['./ui-breadcrumbs.component.scss'],
    providers: [
        DestroyService,
        BreadcrumbCollectorService
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        RouterModule,
        CommonModule
    ]
})
export class UiBreadcrumbsComponent {
    public breadcrumbs$: Observable<IBreadcrumb[] | null>;

    constructor(
        private _destroy$: DestroyService,
        private _breadcrumbsCollector: BreadcrumbCollectorService,
    ) {
        this.breadcrumbs$ = this._breadcrumbsCollector.breadcrumbs$;
    }
}
