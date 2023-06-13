import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivityService } from '../../../../../../../../common/cabinet/grade/services/activity.service';
import { ActivityModel } from '../../../../../../../../common/cabinet/grade/models/activity.model';
import { ActivityRequestService } from '../../../../../../../../common/cabinet/grade/services/activity-request.service';
import { BehaviorSubject, forkJoin, map, of, switchMap, take, tap } from 'rxjs';
import { GradeRequestService } from '../../../../../../../../common/cabinet/grade/services/grade-request.service';
import { EmployeeService } from '../../../employees/services/employee.service';
import { GradeModel } from '../../../../../../../../common/cabinet/grade/models/grade.model';
import { IUser } from '../../../../../../../../common';
import { ActivityListItemViewModel } from '../../view-models/activity-list-item.view-model';
import { EmployeeRequestService } from '../../../employees/data/services/employee-request.service';

@Component({
    templateUrl: './activity-to-review-list.component.html',
    styleUrls: ['./activity-to-review-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        ActivityService,
        ActivityRequestService,
        GradeRequestService,
        EmployeeService,
        EmployeeRequestService
    ]
})
export class ActivityToReviewListComponent {
    protected activitiesOnReview: BehaviorSubject<ActivityListItemViewModel[]> = new BehaviorSubject<ActivityListItemViewModel[]>([]);

    constructor(
        private _activityService: ActivityService,
        private _gradeService: GradeRequestService,
        private _employeeService: EmployeeService,
    ) {
        this.updateList();
    }

    public updateList(): void {
        this._activityService.getActivitiesForReview()
            .pipe(
                tap((activityList: ActivityModel[]) => {
                    activityList.forEach((a: ActivityModel) => {
                        this._activityService.addActivity(a);
                    });
                }),
                switchMap((activityList: ActivityModel[]) => {
                    const gradeList: Map<number, ActivityModel[]> = this.groupByGrade(activityList);

                    return gradeList.size > 0 ? forkJoin(
                        Array.from(gradeList.keys()).map((value: number) => {
                            return forkJoin({
                                grade: this._gradeService.getGradeById(value),
                                employee: this._employeeService.getEmployeeById(gradeList.get(value)![0].employeeId),
                            })
                                .pipe(
                                    map(({ grade, employee }: { grade: GradeModel, employee: IUser }) => {
                                        return new ActivityListItemViewModel(activityList, grade, employee);
                                    })
                                );
                        })
                    ) : of([]);
                }),
                take(1)
            )
            .subscribe((viewModelList: ActivityListItemViewModel[]) => {
                this.activitiesOnReview.next(viewModelList);
            });
    }

    public groupByGrade(activities: ActivityModel[]): Map<number, ActivityModel[]> {
        const grades: Map<number, ActivityModel[]> = new Map();

        activities.forEach((activity: ActivityModel) => {
            const gradeId: number = activity.gradeId!;
            if (grades.has(gradeId)) {
                grades.set(gradeId, grades.get(gradeId)!.concat([activity]));
            } else {
                grades.set(gradeId, [activity]);
            }
        });

        return grades;
    }
}
