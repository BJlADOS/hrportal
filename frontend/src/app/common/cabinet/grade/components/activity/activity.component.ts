import { AfterContentInit, ChangeDetectorRef, Component, Input } from '@angular/core';
import { ActivityModel } from '../../models/activity.model';
import { ActivityService } from '../../services/activity.service';
import { ActivityViewModel } from '../../models/activity.view-model';
import { LetDirective } from '../../../../../lib/directives/let.directive';
import { contentExpansion, DestroyService, FormGenerator, rotate180, SharedModule } from '../../../../../lib';
import { NgIf } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { finalize, takeUntil } from 'rxjs';
import { ActivityState } from '../../enums/activity-state.enum';
import { ActivityStatus } from '../../enums/activity-status.enum';
import { AutoSizeInputModule } from 'ngx-autosize-input';
import { AccordionArrowIconComponent } from '../../../../../../assets/img';
import { EmptyCircleIconComponent } from '../../../../../../assets/img/empty-circle/empty-circle-icon';
import { ActivityStateModelConst } from '../../models/activity-state-model.const';
import { EditActivityIconComponent } from '../../../../../../assets/img/edit-activity/edit-activity-icon';
import { DeleteActivityIconComponent } from '../../../../../../assets/img/delete-activity/delete-activity-icon';
import { PageBase } from '../../../../../lib/shared/components/page-base/page-base.component';

@Component({
    selector: 'app-activity',
    templateUrl: './activity.component.html',
    styleUrls: ['./activity.component.scss'],
    standalone: true,
    providers: [
        DestroyService,
    ],
    imports: [
        LetDirective,
        NgIf,
        ReactiveFormsModule,
        SharedModule,
        AutoSizeInputModule,
        AccordionArrowIconComponent,
        EmptyCircleIconComponent,
        EditActivityIconComponent,
        DeleteActivityIconComponent,
    ],
    animations: [
        contentExpansion,
        rotate180,
    ],
})
export class ActivityComponent extends PageBase implements AfterContentInit {

    @Input() public activityId!: number;
    @Input() public gradeId: number | undefined; //Для добавления активностей к существующему грейду
    //Проверка сохранять нам активность сразу или грейд новый и надо сохранить всё разом
    @Input() public initialState: ActivityState = ActivityState.userReport;
    @Input() public reviewMode: boolean = false;

    public viewModel?: ActivityViewModel;
    public form?: FormGroup;
    public state: ActivityState = ActivityState.userReport;
    public isOpened: boolean = false;
    public isEditing: boolean = false;
    public readonly statusObject = ActivityStateModelConst;

    private _model?: ActivityModel;
    private _initialModel?: ActivityModel;

    constructor(
        private _activityService: ActivityService,
        private _formGenerator: FormGenerator,
        private _destroy$: DestroyService,
        private _changeDetectorRef: ChangeDetectorRef,
    ) {
        super();
    }

    public ngAfterContentInit(): void {
        this._model = this._activityService.getActivity(this.activityId);
        this._initialModel = { ...this._model };
        this.state = this.initialState;
        if (!this._model.id) {
            // this.isOpened = true;
            this.isEditing = true;
            this.state = ActivityState.creating;
        }
        this.form = this._formGenerator.getActivityForm(this.state, this._model);
        ((this.state === ActivityState.userReport) || !this.isEditing) && this.form.get('name')?.disable();
        ((this.state === ActivityState.userReport) || !this.isEditing) && this.form.get('description')?.disable();
        (this.state !== ActivityState.userReport || (this._model.status !== ActivityStatus.inWork && this._model.status !== ActivityStatus.returned)) && this.form.get('employeeReport')?.disable();
        this.form.valueChanges.pipe(takeUntil(this._destroy$))
            .subscribe(
                {
                    next: (val) => {
                        if (this._model) {
                            this._model.name = val.name;
                            this._model.description = val.description;
                            this._model.employeeReport = val.employeeReport;
                            this._model.isValid = this.form!.valid;
                            this.updateViewModel();
                        }

                    }
                }
            );
        this.viewModel = new ActivityViewModel(this._model);
        this._changeDetectorRef.detectChanges();
    }

    public deleteActivity(): void {
        this.startLoading();
        this._model!.isValid = false;
        this._activityService.removeActivity(this._model!)
            .pipe(finalize(() => this.stopLoading()))
            .subscribe();
    }

    protected readonly ActivityState = ActivityState;
    protected readonly ActivityStatus = ActivityStatus;

    public sendToReview(): void {
        this.startLoading();
        this._activityService.sendActivityToReview(this._model!)
            .pipe(finalize(() => this.stopLoading()))
            .subscribe({
                next: () => {
                    if(this._model) {
                        this._model.status = ActivityStatus.onReview;
                        this.updateViewModel();
                        this.updateFormControls();
                    }
                }
            });
    }

    public approveActivity(): void {
        this.startLoading();
        this._activityService.completeActivity(this._model!.id!)
            .pipe(finalize(() => this.stopLoading()))
            .subscribe({
                next: () => {
                    if (this._model) {
                        this._model.status = ActivityStatus.completed;
                        this.updateViewModel();
                        this.updateFormControls();
                    }
                }
            });
    }

    public cancelActivity(): void {
        this.startLoading();
        this._activityService.cancelActivity(this._model!.id!)
            .pipe(finalize(() => this.stopLoading()))
            .subscribe({
                next: () => {
                    if (this._model) {
                        this._model.status = ActivityStatus.canceled;
                        this.updateViewModel();
                        this.updateFormControls();
                    }
                }
            });

    }

    public createActivity(): void {
        this.startLoading();
        this._activityService.createActivity(this._model!, this.gradeId!)
            .pipe(finalize(() => this.stopLoading()))
            .subscribe({
                next: (activity) => {
                    this._model = this._activityService.changeActivity(this._model!, activity);
                    this.updateViewModel();
                    this.updateFormControls();
                }
            });
    }

    public returnActivity(): void {
        this.startLoading();
        this._activityService.returnActivity(this._model!.id!)
            .pipe(finalize(() => this.stopLoading()))
            .subscribe({
                next: () => {
                    this._model!.status = ActivityStatus.returned;
                    this.updateViewModel();
                    this.updateFormControls();
                }
            });
    }

    public editActivity(): void {
        this.isEditing = true;
        this.updateFormControls();
    }

    public cancelEditing(): void {
        this.isEditing = false;
        this.form?.reset(this._initialModel);
    }

    public updateActivity(): void {
        this.startLoading();
        this._activityService.updateActivity(this._model!)
            .pipe(finalize(() => this.stopLoading()))
            .subscribe({
                next: (a) => {
                    this._model = this._activityService.changeActivity(this._model!, a);
                    this.updateViewModel();
                    this.updateFormControls();
                }
            });
    }

    private updateViewModel(): void {
        this._model && (this.viewModel = new ActivityViewModel(this._model));
    }

    private updateFormControls(): void {
        if (this.form) {
            ((this.state === ActivityState.userReport) || !this.isEditing)
                ? this.form.get('name')?.disable()
                : this.form.get('name')?.enable();
            ((this.state === ActivityState.userReport || (this._model!.status !== ActivityStatus.inWork && this._model?.status !== ActivityStatus.returned))
                && !this.isEditing)
                ? this.form.get('description')?.disable()
                : this.form.get('description')?.enable();
            this.state !== ActivityState.userReport || this._model!.status !== ActivityStatus.inWork && this._model?.status !== ActivityStatus.returned
                ? this.form.get('employeeReport')?.disable()
                : this.form.get('employeeReport')?.enable();
        }
    }
}
