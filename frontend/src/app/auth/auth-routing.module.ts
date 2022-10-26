import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthMainComponent } from './components/auth-main/auth-main.component';


const routes: Routes = [
    { path: '', pathMatch: 'full', component: AuthMainComponent },

];

export const authRouting: ModuleWithProviders<RouterModule> = RouterModule.forChild(routes);
