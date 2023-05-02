import { ISkill, IUser } from '../../../../../../../common';
import { ExperienceRussian } from '../../../../../../../lib';

export class EmployeeListItemViewModel {
    public name: string;
    public email: string;
    public departmentName: string;
    public workExperience: string;
    public skillString: string;

    constructor(data: IUser) {
        this.name = data.fullname;
        this.email = data.email;
        this.departmentName = data.currentDepartment?.name || '';
        this.workExperience = ExperienceRussian[data.experience];
        this.skillString = this.getSkillsString(data.existingSkills);
    }

    private getSkillsString(skills: ISkill[]): string {
        return skills.map((skill: ISkill) => skill.name).join(', ');
    }
}
