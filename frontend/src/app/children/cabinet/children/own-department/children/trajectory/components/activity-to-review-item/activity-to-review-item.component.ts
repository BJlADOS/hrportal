import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivityListItemViewModel } from '../../view-models/activity-list-item.view-model';
import { ActivityState } from '../../../../../../../../common/cabinet/grade/enums/activity-state.enum';

@Component({
    selector: 'activity-to-review-item',
    templateUrl: './activity-to-review-item.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['./activity-to-review-item.component.scss'],
})
export class ActivityToReviewItemComponent {
    @Input()
    public viewModel!: ActivityListItemViewModel;

    @Output()
    public updateList: EventEmitter<void> = new EventEmitter<void>();

    protected readonly ActivityState: typeof ActivityState = ActivityState;

    public update(loading: boolean): void {
        if (!loading) {
            this.updateList.next();
        }
    }
}
