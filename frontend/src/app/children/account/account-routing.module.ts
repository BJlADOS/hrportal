import {
    AuthorizationComponent,
    ConfirmEmailComponent, RecoveryPasswordComponent,
    RecoveryRequestComponent,
    RegistrationComponent
} from './components';
import { LoggedInGuard } from '../../common';
import { RouterModule, Routes } from '@angular/router';
import { AccountLayoutComponent } from './components/account-layout/account-layout.component';
import { NgModule } from '@angular/core';


const routes: Routes = [
    {
        path: '',
        component: AccountLayoutComponent,
        children: [
            {
                path: '',
                redirectTo: 'authorization',
                pathMatch: 'full'
            },
            {
                path: 'authorization',
                component: AuthorizationComponent,
                canActivate: [LoggedInGuard]
            },
            {
                path: 'register',
                component: RegistrationComponent,
                canActivate: [LoggedInGuard]
            },
            {
                path: 'confirm-email',
                component: ConfirmEmailComponent
            },
            {
                path: 'forgot-password',
                component: RecoveryRequestComponent,
                canActivate: [LoggedInGuard]
            },
            {
                path: 'recovery-password',
                component: RecoveryPasswordComponent
            }
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ]
})
export class AccountRoutingModule {

}
