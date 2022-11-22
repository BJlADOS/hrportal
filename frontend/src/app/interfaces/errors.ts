export interface IAccessError {
    detail: string[];
}

export interface IValidationError {
    desiredSalary?: string[];
    desiredEmployment?: string[];
    desiredSchedule?: string[];
    resume?: string[];
    isActive?: string[];
}

export interface IInputError {
    message: string;
}

export interface IAuthError {
    fullname?: IInputError | null;
    email?: IInputError | null;
    password?: IInputError | null;
    confirmPassword?: IInputError | null;
}

export interface IUserFormError {
    fullname?: IInputError | null;
    email?: IInputError | null;
    contact?: IInputError | null;
    department?: IInputError | null;
    experience?: IInputError | null;
}

export interface IUserUpdateError {
    email?: string[],
    expiriense?: string[],
    currentDepartmentId?: string[],
    existingSkillsIds?: string[],
}

export interface ISubmitError {
    message: string;
}