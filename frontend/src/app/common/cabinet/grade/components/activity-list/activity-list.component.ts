import { Component, Input, OnInit } from '@angular/core';
import { ActivityService } from '../../services/activity.service';
import { ActivityComponent } from '../activity/activity.component';
import { NgForOf } from '@angular/common';
import { ActivityState } from '../../enums/activity-state.enum';

@Component({
    selector: 'app-activity-list',
    templateUrl: './activity-list.component.html',
    styleUrls: ['./activity-list.component.scss'],
    standalone: true,
    imports: [
        ActivityComponent,
        NgForOf
    ],
})
export class ActivityListComponent implements OnInit {

    @Input() public userId!: number;
    @Input() public activityState: ActivityState = ActivityState.userReport;
    @Input() public gradeId: number | undefined;

    constructor(
        public activityService: ActivityService,
    ) { }

    public ngOnInit(): void {

    }

}
