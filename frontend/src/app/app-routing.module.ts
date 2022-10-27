import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthModule } from './auth/auth.module';
import { MainComponent } from './main/main.component';


const routes: Routes = [
  { path: '', component: MainComponent},
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then((m: typeof import('./auth/auth.module')): typeof AuthModule => m.AuthModule) },

];

export const appRouting: ModuleWithProviders<RouterModule> = RouterModule.forRoot(routes);
