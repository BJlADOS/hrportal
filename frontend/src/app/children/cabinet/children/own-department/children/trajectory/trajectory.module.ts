import { NgModule } from '@angular/core';
import { trajectoryRouterModule } from './trajectory.routing-module';
import { ActivityToReviewListComponent } from './components/activity-to-review-list/activity-to-review-list.component';
import { ActivityToReviewItemComponent } from './components/activity-to-review-item/activity-to-review-item.component';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { AccordionArrowIconComponent } from '../../../../../../../assets/img';
import { FormsModule } from '@angular/forms';
import { ActivityComponent } from '../../../../../../common/cabinet/grade/components/activity/activity.component';


@NgModule({
    imports: [
        trajectoryRouterModule,
        NgForOf,
        AsyncPipe,
        NgIf,
        AccordionArrowIconComponent,
        FormsModule,
        ActivityComponent
    ],
    declarations: [
        ActivityToReviewListComponent,
        ActivityToReviewItemComponent
    ],
    exports: [
    ]
})
export class TrajectoryModule {

}
