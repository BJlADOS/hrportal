import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, map, takeUntil } from 'rxjs';
import { contentExpansion } from 'src/app/animations/content-expansion/content-expansion';
import { FormGenerator } from 'src/app/classes/form-generator/form-generator';
import { IUserEditing } from 'src/app/interfaces/editing';
import { IDepartment, ISkill, IUser, IUserUpdate } from 'src/app/interfaces/User';
import { getExperienceRussianAsArray } from 'src/app/interfaces/vacancy';
import { DepartmentService } from 'src/app/services/department/department.service';
import { DestroyService } from 'src/app/services/destoy/destroy.service';
import { SkillsService } from 'src/app/services/skills/skills.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  animations: [contentExpansion],
})
export class ProfileComponent implements OnInit {

  public user$: BehaviorSubject<IUser | null> = this._user.currentUserSubject$;
  public user: IUser | null = null;
  public experience: { name: string, id: string }[] = getExperienceRussianAsArray();
  public departments: IDepartment[] = [];
  public skills: ISkill[] = [];
  public userForm!: FormGroup;
  public uploadedPhoto: File | null = null;
  public uploadedPhotoUrl: string | ArrayBuffer | null = null;

  public isEditing: boolean = false;
  public isAddingSkill: boolean = false;
  public isEditingName: boolean = false;
  public isUserEdited: IUserEditing = { name: false, photo: false, email: false, contact: false, experience: false, department: false, skills: false };
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
    } });

    this._user.currentUser$.pipe(takeUntil(this._destroy$)).subscribe({ next: (user: IUser | null) => {
      this.user = user;
      if (user) {
        this.resetForm();
      }
      
    } });

    this._skills.getSkills().pipe(takeUntil(this._destroy$)).subscribe({ next: (skills: ISkill[]) => {
      this.skills = skills;
    } });

  }

  public onPhotoChange(event: any): void {
    const file: File = event.target.files[0];

    const mimeType = file.type;
    if (mimeType.match(/image\/*/) == null) {
        return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file); 
    reader.onload = (_event) => { 
        this.uploadedPhotoUrl = reader.result;
        this.uploadedPhoto = file; 
        this.isUserEdited.photo = true;
    }
  }
  
  public saveUser(): void {
    const isEdited: boolean = this.checkFormChanges(); // Пока не знаю, надо ли это
    const userUpdate: IUserUpdate = {}
    if (this.isUserEdited.name) {
      userUpdate.fullname = this.userForm.controls['fullname'].value;
    }
    if (this.isUserEdited.photo) {
      userUpdate.photo = this.uploadedPhoto!;
    }
    if (this.isUserEdited.email) {
      userUpdate.email = this.userForm.controls['email'].value;
    }
    if (this.isUserEdited.contact) {
      userUpdate.contact = this.userForm.controls['contact'].value;
    }
    if (this.isUserEdited.experience) {
      userUpdate.experience = this.userForm.controls['experience'].value.id;
    }
    if (this.isUserEdited.department) {
      userUpdate.currentDepartmentId = this.userForm.controls['department'].value.id;
    }
    if (this.isUserEdited.skills) {
      userUpdate.existingSkillsIds = (this.userForm.controls['skills'].value as ISkill[]).map((skill: ISkill) => skill.id);
    }

    this._user.updateUserInfo(userUpdate).subscribe({ next: (user: IUser) => {
      this._user.updateCurrentUser(user);
      this.isSavedChanges = true;
    } });
  }

  public editProfile(): void {
    this.isEditing = true;
    this.isSavedChanges = false;
    this.userForm.enable();
  }

  public cancelEditing(): void {
    this.userForm.disable();
    this.resetForm();
  }

  public deleteSkill(skill: ISkill): void {
    this.userForm.controls['skills'].setValue(this.userForm.controls['skills'].value.filter((s: ISkill) => s.id !== skill.id));
  }

  public deletePhoto(): void {
    this.uploadedPhoto = null;
    this.uploadedPhotoUrl = null;
    this.isUserEdited.photo = true;
  }

  public addedSkill(skill: ISkill): void {
    this.userForm.controls['skills'].value.push(skill);
  }

  private resetForm(): void {
    this.userForm = this._form.getUserDataForm(this.user!);
    this.uploadedPhoto = null;
    this.uploadedPhotoUrl = null;
    this.isEditing = false;
    this.isAddingSkill = false;
    this.isUserEdited = { name: false, photo: false, email: false, contact: false, experience: false, department: false, skills: false };
    this.userForm.disable();
  }

  public checkFormChanges(): boolean {
    const form = this.userForm.value;
    const user: IUser = this.user as IUser;
    if (user) {
      if (form.fullname !== user.fullname) {
        this.isUserEdited.name = true;
      } else {
        this.isUserEdited.name = false;
      }
      if (form.email !== user.email) {
        this.isUserEdited.email = true;
      } else {
        this.isUserEdited.email = false;
      }
      if (form.contact !== user.contact) {
        this.isUserEdited.contact = true;
      } else {
        this.isUserEdited.contact = false;
      }
      if (form.experience !== user.experience) {
        this.isUserEdited.experience = true;
      } else {
        this.isUserEdited.experience = false;
      }
      if ((form.department ? form.department.id : null) !== (user.currentDepartment ? user.currentDepartment!.id : null)) {
        this.isUserEdited.department = true;
      } else {
        this.isUserEdited.department = false;
      }
      form.skills.forEach((skill: ISkill) => {
        if (!user.existingSkills.some((s: ISkill) =>s.id === skill.id)) {
          // Если в форме есть скилл, которого нет в юзере
          //console.log('check passed added new');
          this.isUserEdited.skills = true;
          return;
        }
      });
      let sameSkillCounter: number = 0;
      user.existingSkills.forEach((skill: ISkill) => {
        if (!form.skills.some((s: ISkill) =>s.id === skill.id)) {
          // Если в форме нет скилла, которого есть в юзере
          //console.log('check passed deleted existing');
          this.isUserEdited.skills = true;
          return;
        } else {
          sameSkillCounter++;
        }
      });
      if (user.existingSkills.length !== form.skills.length) {
        // Если в форме и в юзере разное количество скиллов
        //console.log('check passed different length');
        this.isUserEdited.skills = true;
      }
      if (sameSkillCounter === form.skills.length && sameSkillCounter === user.existingSkills.length) {
        // если нету добавленных и удаленных скиллов и количество скиллов в форме и в юзере одинаковое
        //console.log('check passed same length');
        this.isUserEdited.skills = false;
      }
    }

    // Проверка на изменения в форме
    // console.log(this.isUserEdited);
    // console.log(form);
    // console.log(user);

    return this.isUserEdited.name || this.isUserEdited.photo || this.isUserEdited.email || this.isUserEdited.contact || this.isUserEdited.experience || this.isUserEdited.department || this.isUserEdited.skills;
  }


}
