import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable, takeUntil } from 'rxjs';
import { AuthorizationService, CreateResumeComponent, IUser, UserService } from '../../../../common';
import { IHeaderButton } from '../../interfaces';
import { DestroyService, ModalService, UserType } from '../../../../lib';
import { BUTTONS_DATA_TOKEN, BUTTONS_MAPPER_TOKEN } from '../../tokens';
import { HeaderButton } from '../../enums/header-button.enum';


import { BUTTONS_DATA_PROVIDER } from '../../providers/buttons-data.provider';
import { BUTTONS_DATA_MAPPER_PROVIDER } from '../../providers/buttons-data-mapper.provider';
import { IHoverSelectItem } from '../ui-hover-selector/interfaces/hover-select-item.interface';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    providers: [
        BUTTONS_DATA_PROVIDER,
        BUTTONS_DATA_MAPPER_PROVIDER
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit {

    public user: Observable<IUser | null> = this._user.currentUser$;
    public buttons: IHeaderButton[] = [];

    public isCreatingResume: boolean = false;
    public profileFilled$: Observable<boolean> = this._user.profileFilledStatus$;

    constructor(
        private _user: UserService,
        private _auth: AuthorizationService,
        private _router: Router,
        private _modal: ModalService,
        private _destroy$: DestroyService,
        @Inject(BUTTONS_DATA_TOKEN) private _buttonsData: Record<HeaderButton, IHeaderButton>,
        @Inject(BUTTONS_MAPPER_TOKEN) private _buttonsMapper: Record<UserType, HeaderButton[]>
    ) { }

    public ngOnInit(): void {
        this.user
            .pipe(
                takeUntil(this._destroy$)
            )
            .subscribe((user: IUser | null) => {
                this.setButtonsData(user?.isAdmin ?? false, user?.isManager ?? false);
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
                map((result: any) => result === null)
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

    /**
     * Получить модель селектора
     * */
    public getSelectorModel(buttonInterface: IHeaderButton): IHoverSelectItem {
        const hoverSelectItem: IHoverSelectItem = {
            buttonTitle: buttonInterface.name,
            path: buttonInterface.path
        };

        if (buttonInterface.children) {
            hoverSelectItem.children = buttonInterface.children.map((childButtonInterface: HeaderButton) => {
                const childButtonData: IHeaderButton = this._buttonsData[childButtonInterface];

                return {
                    buttonTitle: childButtonData.name,
                    path: childButtonData.path
                };
            });
        }

        return hoverSelectItem;
    }

    /**
     * Установить данные для кнопок в хэдере
     * */
    private setButtonsData(isAdmin: boolean, isManager: boolean): void {
        let userType: UserType;
        if (isAdmin) {
            userType = UserType.administrator;
        } else if (isManager) {
            userType = UserType.manager;
        } else {
            userType = UserType.employee;
        }

        this.buttons = this._buttonsMapper[userType].map((buttonType: HeaderButton) =>
            this._buttonsData[buttonType]);
    }
}
