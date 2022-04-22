import { Component, OnInit } from '@angular/core';
import { DbServiceService } from '../db-service.service';
import { lessonButtons } from '../constants/lessonButton';

@Component({
  selector: 'app-student-record',
  templateUrl: './student-record.page.html',
  styleUrls: ['./student-record.page.scss'],
})
export class StudentRecordPage implements OnInit {

  students: any;
  records: any;
  examGroup: any;
  activityList: any;

  constructor(private DbServiceService: DbServiceService) { }

  async ngOnInit() {
    await this.getStudentList();
    await this.getExamGroup();
  }

  async getStudentList() {
    this.records = await this.DbServiceService.getQuizResults();
  }

  async getExamGroup() {
    this.examGroup = await this.DbServiceService.getGroupQuiz();
    this.activityList = lessonButtons;
  }

  selectRow(event) {
    const header = document.getElementsByClassName('header-head');
    for(let i = 0; i < header.length; i++) {
      header[i].classList.remove("selected");
    }

    event.currentTarget.className += " selected";
  }

}
