import { Component } from '@angular/core';
import { Status } from '../../../../../../../../lib/utils/enums/status.enum';

@Component({
    selector: 'app-archived-resumes',
    templateUrl: './archived-resumes.component.html',
    styleUrls: ['./archived-resumes.component.scss']
})
export class ArchivedResumesComponent {
    public readonly status: Status = Status.archived;

}
