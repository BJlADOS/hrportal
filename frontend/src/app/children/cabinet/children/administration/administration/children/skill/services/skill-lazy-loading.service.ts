import { IPage, PageLazyLoadingService } from '../../../../../../../../lib';
import { ISkill, SkillsService } from '../../../../../../../../common';
import { map, Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class SkillLazyLoadingService extends PageLazyLoadingService<ISkill, string | void> {
    constructor(private _skillRequestService: SkillsService) {
        super();
    }

    protected receiveData(searchString?: string): Observable<IPage<ISkill>> {
        return this._skillRequestService.getSkills()
            .pipe(
                map((skillList: ISkill[]) => {
                    return {
                        count: skillList.length,
                        results: skillList.filter((skill: ISkill) =>
                            searchString ? skill.name.startsWith(searchString) : true)
                    } as IPage<ISkill>;
                })
            );
    }
}
