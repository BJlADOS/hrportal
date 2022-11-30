import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IResume } from 'src/app/interfaces/resume';
import { ISkill, IUser } from 'src/app/interfaces/User';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-resume',
  templateUrl: './resume.component.html',
  styleUrls: ['./resume.component.scss']
})
export class ResumeComponent implements OnInit {

  @Input() public resume!: IResume;

  public user: IUser | null = null;

  constructor(
    private _userService: UserService,
    private _router: Router,
  ) { }

  public ngOnInit(): void {
    this._userService.getUserById(this.resume.employeeId).subscribe({
      next: (user) => {
        this.user = user;
      }
    }
    );
  }

  public skillsToString(skills: ISkill[]): string {
    return skills.map((skill) => skill.name).join(', ');
  }

  public openResume(): void {
    this._router.navigate([`resumes/${this.resume.id}`]);
  }

  public responseResume(): void {
    console.log('Response resume');
  }

  // public getUserName(fullname: string): string {
  //   const name: string[] = fullname.split(' ');
  //   return `${name[0]} ${name[1]}.`;
  // }

}
