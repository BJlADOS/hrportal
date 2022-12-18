import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/components/auth/auth.component';
import { ConfirmEmailComponent } from './auth/components/confirm-email/confirm-email.component';
import { RecoveryPasswordComponent } from './auth/components/recovery-password/recovery-password.component';
import { RecoveryRequestComponent } from './auth/components/recovery-request/recovery-request.component';
import { RegistrationComponent } from './auth/components/registration/registration.component';
import { AdminGuard } from './Guards/admin-guard/admin.guard';
import { AuthGuard } from './Guards/auth-guard/auth.guard';
import { LoggedInGuard } from './Guards/logged-in-guard/logged-in.guard';
import { ManagerGuard } from './Guards/manager-guard/manager.guard';
import { MainComponent } from './main/main.component';


const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  { path: 'auth', component: AuthComponent, canActivate: [LoggedInGuard] },
  { path: 'register', component: RegistrationComponent, canActivate: [LoggedInGuard] },
  { path: 'confirm-email', component: ConfirmEmailComponent },
  { path: 'forgot-password', component: RecoveryRequestComponent, canActivate: [LoggedInGuard] },
  { path: 'recovery-password', component: RecoveryPasswordComponent },
  { path: 'profile', loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule), canActivate: [AuthGuard] },
  { path: 'vacancies', loadChildren: () => import('./vacancies/vacancies.module').then(m => m.VacanciesModule), canActivate: [AuthGuard] },
  { path: 'resumes', loadChildren: () => import('./resume/resume.module').then(m => m.ResumeModule), canActivate: [AuthGuard, ManagerGuard] },
  { path: 'departments', loadChildren: () => import('./departments/departments.module').then(m => m.DepartmentsModule), canActivate: [AuthGuard, AdminGuard] },
];

export const appRouting: ModuleWithProviders<RouterModule> = RouterModule.forRoot(routes);
