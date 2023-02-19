import { RegistrationComponent } from './components/registration/registration.component';
import { RouterModule, Routes } from '@angular/router';
import { RecoveryRequestComponent } from './components/recovery-request/recovery-request.component';
import { NgModule } from '@angular/core';
import { RecoveryPasswordComponent } from './components/recovery-password/recovery-password.component';
import { AuthorizationComponent } from './components/authorization/authorization.component';
import { LoggedInGuard } from '../../guards';
import { AccountLayoutComponent } from './components/account-layout/account-layout.component';
import {ConfirmEmailComponent} from "./components";


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
