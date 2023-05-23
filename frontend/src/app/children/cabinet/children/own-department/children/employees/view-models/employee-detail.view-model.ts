import { ISkill, IUser } from '../../../../../../../common';
import { ExperienceRussian } from '../../../../../../../lib';
import {environment} from "../../../../../../../../environments/environment";

export class EmployeeDetailViewModel {
    public name: string;
    public email: string;
    public workExperience: string;
    public skills: ISkill[];
    public avatarUrl: string;
    public contact: string;
    public personalCanBeViewed: boolean;
    public careerCanBeViewed: boolean;
    public role?: string;

    constructor(data: IUser) {
        this.name = data.fullname;
        this.email = data.email;
        this.workExperience = ExperienceRussian[data.experience];
        this.avatarUrl = (environment.mediaURL + data.photo) || 'assets/img/profile-placeholder.png';
        this.role = this.getRole(data.isManager, data.isAdmin);
        this.skills = data.existingSkills;
        this.contact = data.contact;
        this.personalCanBeViewed = !!data.contact || !!data.email;
        this.careerCanBeViewed = !!data.experience;
    }

    private getRole(isManager: boolean, isAdmin: boolean): string | undefined {
        if (isAdmin) {
            return 'Администратор';
        }

        if (isManager) {
            return 'Руководитель';
        }

        return undefined;
    }
}
