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