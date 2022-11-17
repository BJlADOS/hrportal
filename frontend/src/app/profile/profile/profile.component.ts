import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, map, takeUntil } from 'rxjs';
import { FormGenerator } from 'src/app/classes/form-generator/form-generator';
import { IDepartment, ISkill, IUser } from 'src/app/interfaces/User';
import { getExperienceRussianAsArray } from 'src/app/interfaces/vacancy';
import { DepartmentService } from 'src/app/services/department/department.service';
import { DestroyService } from 'src/app/services/destoy/destroy.service';
import { SkillsService } from 'src/app/services/skills/skills.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  public user$: BehaviorSubject<IUser | null> = this._user.currentUserSubject$;
  public user: IUser | null = null;
  public expirienceRaw: { values: string[], labels: string[] } = getExperienceRussianAsArray();
  public experience: { name: string, id: string }[] = []; 
  public departments: IDepartment[] = [];
  public skills: ISkill[] = [];
  public userForm!: FormGroup;

  public isEditing: boolean = false;
  public isAddingSkill: boolean = false;
  public isEditingName: boolean = false;
  public isSavedChanges: boolean = false;

  constructor(
    public department: DepartmentService,
    private _user: UserService,
    private _form: FormGenerator,
    private _destroy$: DestroyService,
    private _skills: SkillsService,
  ) { }

  public ngOnInit(): void {
    this.department.getDepartments().subscribe({ next: (data: IDepartment[]) => {
      this.departments = data;
      this.departments.push({ id: 0, name: 'Не выбрано', managerId: 0 });
    } });

    this._user.currentUser$.pipe(takeUntil(this._destroy$)).subscribe({ next: (user: IUser | null) => {
      this.user = user;
      console.log(this.user);
      if (user) {
        this.userForm = this._form.getUserDataForm(user);
      }
      
    } });

    this._skills.getSkills().pipe(takeUntil(this._destroy$)).subscribe({ next: (skills: ISkill[]) => {
      this.skills = skills;
    } });


    this.expirienceRaw.labels.map((label, i) => {
      this.experience.push({ name: label, id: this.expirienceRaw.values[i] });
    });
  }

  public saveUser(): void {
    //not implemented
  }

  public changedExperience(value: { name: string, id: string }): void {
    console.log(value);
    this.userForm.controls['experience'].setValue(value.id);
  }

  public changedDepartment(value: IDepartment): void {
    console.log(value);
    this.userForm.controls['departmentId'].setValue(value.id);
  }

  public addedSkill(skill: ISkill): void {
    this.user?.existingSkills.push(skill);
  }

}
