import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { AuthorizationGuard } from './guards/authorization-guard.guard';


const routes: Routes = [
    {
        path: '',
        redirectTo: 'account',
        pathMatch: 'full'
    },
    {
        path: 'account',
        loadChildren: () => import('./children/account/account.module')
            .then(m => m.AccountModule)
    },
    {
        path: 'cabinet',
        canActivate: [AuthorizationGuard],
        loadChildren: () => import('./children/cabinet/cabinet.module')
            .then(m => m.CabinetModule)
    },
    {
        path: '**',
        component: NotFoundComponent
    },
];

export const appRouting: ModuleWithProviders<RouterModule> = RouterModule.forRoot(routes);
