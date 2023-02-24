import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import {
    AuthorizationComponent,
    ConfirmEmailComponent,
    ConfirmEmailModalComponent,
    ErrorsComponent,
    RecoveryPasswordComponent,
    RecoveryRequestComponent,
    RegistrationComponent
} from './components';
import { AccountLayoutComponent } from './components/account-layout/account-layout.component';
import { RouterOutlet } from '@angular/router';
import { AccountRoutingModule } from './account-routing.module';
import { SharedModule } from '../../lib';


@NgModule({
    declarations: [
        AuthorizationComponent,
        RegistrationComponent,
        ErrorsComponent,
        ConfirmEmailModalComponent,
        ConfirmEmailComponent,
        RecoveryPasswordComponent,
        RecoveryRequestComponent,
        AccountLayoutComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SharedModule,
        RouterOutlet,
        AccountRoutingModule
    ]
})
export class AccountModule {

}
