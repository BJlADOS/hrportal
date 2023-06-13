import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActivityToReviewListComponent } from './components/activity-to-review-list/activity-to-review-list.component';

const routes: Routes = [
    {
        path: '',
        component: ActivityToReviewListComponent,
    }
];

export const trajectoryRouterModule: ModuleWithProviders<RouterModule> = RouterModule.forChild(routes);
