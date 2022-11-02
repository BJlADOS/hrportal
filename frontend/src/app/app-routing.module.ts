import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/components/auth/auth.component';
import { RegistrationComponent } from './auth/components/registration/registration.component';
import { AuthGuard } from './Guards/auth-guard/auth-guard';
import { MainComponent } from './main/main.component';


const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'auth', component: AuthComponent },
  { path: 'register', component: RegistrationComponent },
  { path: 'profile', loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule), canActivate: [AuthGuard] },
  { path: 'vacancies', loadChildren: () => import('./vacancies/vacancies.module').then(m => m.VacanciesModule), canActivate: [AuthGuard] },
];

export const appRouting: ModuleWithProviders<RouterModule> = RouterModule.forRoot(routes);
