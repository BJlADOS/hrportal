import { Injectable } from '@angular/core';
import { ISkill, SkillsService } from '../../../../../../../../common';
import { SkillLazyLoadingService } from './skill-lazy-loading.service';
import { BehaviorSubject, switchMap, take } from 'rxjs';

@Injectable()
export class SkillAdministrationService {
    public searchIsNotEmpty$: BehaviorSubject<boolean> = new BehaviorSubject(true);
    private _searchString?: string;

    constructor(
        private _skillRequestService: SkillsService,
        private _skillLazyLoadingService: SkillLazyLoadingService
    ) { }

    public addSkill(skillName: string): void {
        this._skillRequestService.addSkill(skillName)
            .pipe(
                take(1)
            )
            .subscribe(() => {
                this.reloadSkills();
            });
    }

    public searchSkill(searchString?: string): void {
        this._searchString = searchString ?? undefined;
        this.reloadSkills();
    }

    public removeSkill(id: number): void {
        this._skillRequestService.removeSkill(id)
            .pipe(
                take(1)
            )
            .subscribe();

        this.reloadSkills();
    }

    public reloadSkills(): void {
        this._skillLazyLoadingService.planClear();
        this._skillLazyLoadingService.addPage(this._searchString)
            .pipe(
                switchMap(() => {
                    return this._skillLazyLoadingService.list$;
                }),
                take(1)
            )
            .subscribe((value: ISkill[] | null) => {
                this.searchIsNotEmpty$.next(!!value && !!value.length);
            });
    }
}
