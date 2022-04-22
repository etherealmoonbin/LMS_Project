import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { DbServiceService } from '../db-service.service';

@Component({
  selector: 'app-add-quiz-modal',
  templateUrl: './add-quiz-modal.component.html',
  styleUrls: ['./add-quiz-modal.component.scss'],
})
export class AddQuizModalComponent implements OnInit {

  lessonId: any
  question: any;
  c1: any = 'Choice 1';
  c2: any = 'Choice 2';
  c3: any = 'Choice 3';
  selectedAnswer: any = null;
  type: any = null;

  constructor(
    private dbService: DbServiceService,
    private navParams: NavParams,
    private modalController: ModalController
  ) { 
    
  }

  async ngOnInit() {
    this.lessonId = this.navParams.data['index'];
  }

  async AddQuiz() {
    if(this.lessonId && this.question && this.selectedAnswer && this.c1 && this.c2 && this.c3) {
      this.selectedAnswer = this.type == 1 ? this.c1 : this.type == 2 ? this.c2 : this.c3;

      await this.dbService.addQuiz(this.lessonId, this.question, this.selectedAnswer, this.c1, this.c2, this.c3);
      await this.ResetForm();
    } else {
      alert('Incomplete Fields');
    }

  }

  getSelectedAnswer(event, type) {
    const radiobtns = document.getElementsByClassName('radio-ans');
    for(let i = 0; i < radiobtns.length; i++) {
      radiobtns[i]['checked'] = false;
    }

    event.currentTarget.checked = true;
    this.type = type;
    this.selectedAnswer = type == 1 ? this.c1 : type == 2 ? this.c2 : this.c3;
  }

  ResetForm() {
    this.question = null; 
    this.c1 = 'Choice 1';
    this.c2 = 'Choice 2';
    this.c3 = 'Choice 3';
    this.selectedAnswer = null;

    const radiobtns = document.getElementsByClassName('radio-ans');
    for(let i = 0; i < radiobtns.length; i++) {
      radiobtns[i]['checked'] = false;
    }

    this.type = null;
  }

  resetRadio() {
    const radiobtns = document.getElementsByClassName('radio-ans');
    for(let i = 0; i < radiobtns.length; i++) {
      radiobtns[i].classList.remove("radio-checked");
    }
    // this.selectedAnswer = null;
  }

  Back() {
    this.modalController.dismiss();
  }
}
