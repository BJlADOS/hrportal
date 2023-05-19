import { Component } from '@angular/core';
import { contentExpansionHorizontal, DestroyService } from '../../../../../../lib';

@Component({
    selector: 'resume-list',
    templateUrl: './resume-list.component.html',
    styleUrls: ['./resume-list.component.scss'],
    animations: [contentExpansionHorizontal],
    providers: [DestroyService],
})
export class ResumeListMainComponent {

}
