import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, takeUntil } from 'rxjs';
import { ModalRef } from 'src/app/classes/modal/modalRef';
import { IUser } from 'src/app/interfaces/User';
import { IVacancy } from 'src/app/interfaces/vacancy';
import { DestroyService } from 'src/app/services/destoy/destroy.service';
import { ModalService } from 'src/app/services/modal/modal.service';
import { UserService } from 'src/app/services/user/user.service';
import { VacancyService } from 'src/app/services/vacancy/vacancy.service';
import { UploadModalComponent } from '../upload-modal/upload-modal.component';

@Component({
  selector: 'app-vacancy-detail',
  templateUrl: './vacancy-detail.component.html',
  styleUrls: ['./vacancy-detail.component.scss']
})
export class VacancyDetailComponent implements OnInit {

  public vacancy: IVacancy | null = null;
  public user$: Observable<IUser | null> = this._user.currentUser$;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _destroy$: DestroyService,
    private _vacancy: VacancyService,
    private _modalServise: ModalService,
    private _user: UserService,
  ) { }

  public ngOnInit(): void {
    this._activatedRoute.paramMap.pipe(takeUntil(this._destroy$)).subscribe((paramMap: ParamMap) => {
      const vacancyIdFromRoute: string = paramMap.get('id') as string;
      this._vacancy.getVacancyById(vacancyIdFromRoute).pipe(takeUntil(this._destroy$)).subscribe((vacancy: IVacancy) => {
        this.vacancy = vacancy;      
      }
      );
  });
  }

  public responseVacancy(): void {
    const modalRef: ModalRef = this._modalServise.open(UploadModalComponent, {
      vacancyId: this.vacancy?.id,
      vacancyName: this.vacancy?.position,
  });
  }

}
