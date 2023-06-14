import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { IHoverSelectItem } from '../../interfaces/hover-select-item.interface';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { OuterClickDirective } from '../../../../../../lib/directives/outer-click.directive';
import { BehaviorSubject, Subject } from 'rxjs';
import { LetDirective } from '../../../../../../lib/directives/let.directive';

@Component({
    selector: 'header-dropdown-selector',
    templateUrl: './header-dropdown-selector.component.html',
    styleUrls: ['./header-dropdown-selector.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        CommonModule,
        OuterClickDirective,
        LetDirective
    ]
})
export class HeaderDropdownSelectorComponent {
    @Input()
    public set model(value: IHoverSelectItem) {
        this.model$.next(value);
    }

    protected model$: BehaviorSubject<IHoverSelectItem | null> =
        new BehaviorSubject<IHoverSelectItem | null>(null);
    protected updater$: Subject<void> = new Subject<void>();
    protected isHover: boolean = false;

    constructor(
        private _router: Router,
        private _cdr: ChangeDetectorRef
    ) { }

    protected setOpenState(value: boolean): void {
        this.isHover = value;
    }

    protected itemSelected(selectItemModel: IHoverSelectItem): void {
        if (!this.isSelected(selectItemModel)) {
            this._router.navigate([selectItemModel.path])
                .then(() => {
                    this.updater$.next();
                });
            this.setOpenState(false);
        }
    }

    protected isSelected(item: IHoverSelectItem): boolean {
        return this._router.url === '/' + item.path;
    }

    protected get isHeaderSelected(): boolean {
        return this.model$.value?.children
            ?.find((child: IHoverSelectItem) => this.isSelected(child)) !== undefined;
    }

    protected get childrenSelected(): boolean {
        return (this.model$.value?.children?.length ?? 0) > 0;
    }
}
