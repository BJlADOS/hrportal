import { AfterContentInit, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivityService } from '../../../../../../../../../../common/cabinet/grade/services/activity.service';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
    contentExpansion,
    DestroyService,
    FormGenerator,
    rotate180,
    SharedModule
} from '../../../../../../../../../../lib';
import { GradeModel } from '../../../../../../../../../../common/cabinet/grade/models/grade.model';
import { IGradeRequest } from '../../../../../../../../../../common/cabinet/grade/interfaces/grade-request.interface';
import { ActivityModel } from '../../../../../../../../../../common/cabinet/grade/models/activity.model';
import { ActivityState } from '../../../../../../../../../../common/cabinet/grade/enums/activity-state.enum';
import { PageBase } from '../../../../../../../../../../lib/shared/components/page-base/page-base.component';
import { finalize } from 'rxjs';
import {
    ActivityListComponent
} from '../../../../../../../../../../common/cabinet/grade/components/activity-list/activity-list.component';
import { AttentionIconComponent } from '../../../../../../../../../../../assets/img/attention/attention-icon';
import { AsyncPipe, DatePipe, NgIf } from '@angular/common';
import {
    ActivityRequestService
} from '../../../../../../../../../../common/cabinet/grade/services/activity-request.service';
import { GradeService } from '../../../../../../../../../../common/cabinet/grade/services/grade-service';
import { AccordionArrowIconComponent } from '../../../../../../../../../../../assets/img';
import {
    DeleteActivityIconComponent
} from '../../../../../../../../../../../assets/img/delete-activity/delete-activity-icon';
import { EditActivityIconComponent } from '../../../../../../../../../../../assets/img/edit-activity/edit-activity-icon';
import { UserService } from '../../../../../../../../../../common';

@Component({
    selector: 'app-grade-form',
    templateUrl: './grade-form.component.html',
    styleUrls: ['./grade-form.component.scss'],
    providers: [
        DestroyService,
        ActivityService,
        ActivityRequestService,
        DatePipe,
    ],
    standalone: true,
    imports: [
        ActivityListComponent,
        AttentionIconComponent,
        ReactiveFormsModule,
        NgIf,
        DatePipe,
        AccordionArrowIconComponent,
        SharedModule,
        DeleteActivityIconComponent,
        EditActivityIconComponent,
        AsyncPipe
    ],
    animations: [
        rotate180,
        contentExpansion,
    ]
})
export class GradeFormComponent extends PageBase implements AfterContentInit {

    @Input() public userId!: number;
    @Input() public grade?: GradeModel | undefined;
    @Input() public state: ActivityState = ActivityState.userReport;

    @Output() public gradeListUpdate: EventEmitter<void> = new EventEmitter<void>();

    public isEditing: boolean = false;
    public isOpened: boolean = true;
    public user$ = this._userService.currentUser$;

    public form?: FormGroup;
    public gradeModel?: GradeModel;

    constructor(
        private _activityService: ActivityService,
        private _formGenerator: FormGenerator,
        private _destroy$: DestroyService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _grade: GradeService,
        private _userService: UserService,
        private _datePipe: DatePipe,
    ) {
        super();
    }

    public ngAfterContentInit(): void {
        this.gradeModel = this.grade ? { ...this.grade } : undefined;
        this.grade
            ? this.form = this._formGenerator.getGradeForm(this.grade, this._datePipe.transform(this.grade.expirationDate, 'yyyy-MM-dd')!)
            : this.form = this._formGenerator.getGradeForm(this.grade);

        if(this.gradeModel) {
            this.gradeModel.activities.forEach((a) => {
                this._activityService.addActivity(a);
            });
            if (!this.gradeModel.inWork) {
                this.isOpened = false;
            }
        } else {
            this.isEditing = true;
        }
    }

    public addActivity(): void {
        this._activityService.addEmptyActivity(this.userId);
    }

    public createGrade(): void {
        this.startLoading();
        if (!this.gradeModel) {
            this._grade.createGrade(this.prepareGradeObject())
                .pipe(finalize(() => this.stopLoading()))
                .subscribe({
                    next: (grade) => {
                        this.gradeModel = grade;
                        this.clearGradeActivities();
                        this.gradeModel.activities.forEach(a => {
                            this._activityService.addActivity(a);
                        });
                        this.isEditing = false;
                        this._changeDetectorRef.markForCheck();
                    }
                });
        } else {
            this._grade.updateGrade({
                ...this.form!.value,
                expirationDate: new Date(this.form?.value.expirationDate).getTime(),
            }, this.gradeModel.id!)
                .pipe(finalize(() => this.stopLoading()))
                .subscribe({
                    next: () => {
                        this.isEditing = false;
                    }
                });
        }

    }

    public editGrade(): void {
        this.isEditing = true;
    }

    public deleteGrade(): void {
        this.startLoading();
        this._grade.deleteGrade(this.gradeModel!.id!)
            .pipe(finalize(() => this.stopLoading()))
            .subscribe({
                next: () => {
                    this.gradeModel = undefined;
                    this.clearGradeActivities();
                    this.form = this._formGenerator.getGradeForm();
                    this.isEditing = true;
                }
            });
    }

    public cancelEditing(): void {
        this.isEditing = false;
        this.form!.reset({
            ...this.gradeModel,
            expirationDate: this._datePipe.transform(this.gradeModel?.expirationDate, 'yyyy-MM-dd'),
        });
        this.form?.updateValueAndValidity();
    }

    public isGradeReadyForClosing(): boolean {
        return this._activityService.isAllCompleted();
    }

    public isActivitiesInvalid(): boolean {
        return this._activityService.activities.some(a => !a.isValid);
    }

    public completeGrade(): void {
        this.startLoading();
        this._grade.completeGrade(this.gradeModel!.id!)
            .pipe(finalize(() => this.stopLoading()))
            .subscribe({
                next: () => {
                    this.gradeListUpdate.emit();
                    this.gradeModel = undefined;
                    this.clearGradeActivities();
                    this.form = this._formGenerator.getGradeForm();
                    this.isEditing = true;
                }
            });
    }

    private clearGradeActivities(): void {
        this._activityService.clearAll();
    }

    private prepareGradeObject(): GradeModel {
        const formValue: IGradeRequest = this.form!.value;
        const activities: ActivityModel[] = this._activityService.activities;

        formValue.employeeId = this.userId;

        return {
            name: formValue.name,
            expirationDate: new Date(formValue.expirationDate).getTime(),
            employeeId: formValue.employeeId,
            activities: activities,
        } as GradeModel;
    }

    protected readonly ActivityState = ActivityState;
}
