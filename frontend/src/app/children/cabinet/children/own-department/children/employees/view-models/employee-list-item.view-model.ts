import { ISkill, IUser } from '../../../../../../../common';
import { ExperienceRussian } from '../../../../../../../lib';

export class EmployeeListItemViewModel {
    public name: string;
    public isActive: boolean;
    public id: number;
    public email: string;
    public workExperience: string;
    public skillString: string;
    public resumeExists: boolean;
    public resumeId: number;
    public userId: number;

    constructor(data: IUser) {
        this.name = data.fullname;
        this.id = data.id;
        this.email = data.email;
        this.isActive = data.isActive;
        this.workExperience = ExperienceRussian[data.experience];
        this.skillString = this.getSkillsString(data.existingSkills);
        this.resumeExists = !data.filled;
        this.resumeId = data.resumeId;
        this.userId = data.id;
    }

    private getSkillsString(skills: ISkill[]): string {
        return skills.map((skill: ISkill) => skill.name).join(', ');
    }
}
