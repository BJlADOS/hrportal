import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { contentExpansion, DestroyService } from '../../../../lib';
import { finalize, Observable } from 'rxjs';
import { INotification } from './interfaces/notification.interface';
import { NotificationsPageLazyLoadingService } from './services/notifications-page-lazy-loading.service';
import { PageBase } from '../../../../lib/shared/components/page-base/page-base.component';

@Component({
    selector: 'app-notifications',
    templateUrl: './notifications.component.html',
    styleUrls: ['./notifications.component.scss'],
    providers: [DestroyService],
    animations: [contentExpansion],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationsComponent extends PageBase implements OnInit, OnDestroy {

    public notifications$: Observable<INotification[] | null> = this.page.list$;

    public dropdownOpen: boolean = false;
    public visibleOptions: number = 1;

    constructor(
        public page: NotificationsPageLazyLoadingService,
        private elem: ElementRef,
        private _destroy$: DestroyService,
    ) {
        super();
    }

    public ngOnInit(): void {
        this.notifications$.subscribe((n) => n && this.checkOptions(n.length));
        this.startLoading();
        this.page.addPage()
            .pipe(finalize(() => this.stopLoading()))
            .subscribe();
    }

    public ngOnDestroy(): void {
        this.page.clearPageData();
    }

    public get dropdownElement(): Element { return this.elem.nativeElement.querySelector('.dropdown-list'); }

    public onScrolledToBottom(): void {
        if (this.page.itemsLoaded === this.page.itemsCount) {
            return;
        }
        this.startLoading();

        this.page.addPage({
            offset: this.page.itemsLoaded,
            limit: 4,
        }).pipe(finalize(() => this.stopLoading()))
            .subscribe();
    }

    public toggleDropdown(): void {
        this.dropdownOpen = !this.dropdownOpen;
        this.dropdownElement.setAttribute('aria-expanded', this.dropdownOpen ? 'true' : 'false');
    }

    private checkOptions(length: number): void {
        if(length < 3) {
            this.visibleOptions = length === 0 ? 1 : length;
        } else {
            this.visibleOptions = 3;
        }
    }
}
