export interface IUserEditing {
    name: boolean;
    photo: boolean;
    email: boolean;
    contact: boolean;
    experience: boolean;
    department: boolean;
    skills: boolean;
}

export interface IVacancyEditing {
    position: boolean;
    department: boolean;
    salary: boolean;
    employment: boolean;
    schedule: boolean;
    description: boolean;
    skills: boolean;
}

export interface IResumeEditing {
    desiredPosition: boolean;
    desiredSalary: boolean;
    desiredEmployment: boolean;
    desiredSchedule: boolean;
    resume: boolean;
}