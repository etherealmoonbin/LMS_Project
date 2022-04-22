import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { lessonButtons } from '../constants/lessonButton';
import { ModalController } from '@ionic/angular';
import { AddQuizModalComponent } from '../add-quiz-modal/add-quiz-modal.component';
import { DbServiceService } from '../db-service.service';
import { Storage } from '@ionic/storage';
import { UtilityComponent } from '../utility/utility.component';
import { AuthenticationModalComponent } from '../authentication-modal/authentication-modal.component';

@Component({
  selector: 'app-quiz-form',
  templateUrl: './quiz-form.page.html',
  styleUrls: ['./quiz-form.page.scss'],
})
export class QuizFormPage implements OnInit {
  myParam: string;
  lessonTitle: null;
  lessonPageLength: any = [];

  quizList: any;
  isTeacher: any = false;
  isAuthenticated: boolean = false;

  quizGroup: any = [];

  addQuizGroupName: any = false;
  quizGroupName: any;


  constructor(
    private route: ActivatedRoute,
    private modalController: ModalController,
    private DbServiceService: DbServiceService,
    private storage: Storage,
    private util: UtilityComponent,
    private router: Router
  ) { 
      route.params.subscribe(async val => {
      await this.checkAuthentication();
      await this.getQuizGroup();
    });
  }

  async ngOnInit() {
    this.myParam = this.route.snapshot.paramMap.get('index');
    this.lessonTitle = lessonButtons[this.myParam];
    this.isTeacher = await this.storage.get('authority');
    await this.GetQuizList();
  }

  async checkAuthentication() {
    const username = await this.storage.get('username');
    const password = await this.storage.get('password');
    this.isTeacher = await this.storage.get('authority');

    if(username == null && password == null) {
      this.isAuthenticated = false;

    
      const modal = await this.modalController.create({
        component: AuthenticationModalComponent,
        cssClass: 'auth-modal-css',
        backdropDismiss: true,
      });

      modal.onDidDismiss().then(async (data) => {
        if(data.data) {
          await this.checkAuthentication();
        }
      });
  
      return await modal.present();
    } else {
      this.isAuthenticated = true;
    }
  }

  async getQuizGroup() {
    this.quizGroup = await this.DbServiceService.getGroupQuiz();
  }

  async GetQuizList() {
    const quizList = await this.DbServiceService.getQuizList(this.myParam);
    this.quizList = quizList;
  }

  async AddQuizGroup (quizGroup) {
    if(!this.addQuizGroupName) {
      this.quizGroup.push({
        groupId: this.quizGroup.length,
        groupName: null
      });
      this.addQuizGroupName = true;
    } else {
      if(this.quizGroupName) {
        quizGroup.groupName = this.quizGroupName;
        await this.DbServiceService.addGroupQuiz(quizGroup.groupId, quizGroup.groupName);
        this.addQuizGroupName = false;
        this.quizGroupName = '';
        this.quizGroup = await this.DbServiceService.getGroupQuiz();
      } else {
        alert('Exam Group Name cannot be empty');
      }
    }
  }

  async RemoveQuizGroup (quizGroup) { 
    this.quizGroup.splice(quizGroup.groupId, 1);
    this.quizGroupName = '';
    this.addQuizGroupName = false;
    await this.DbServiceService.deleteGroupQuiz(quizGroup.groupId);
  }

  async RenameQuizGroup(quizGroup) {
    quizGroup.groupName = null;
    this.quizGroupName = '';
    this.addQuizGroupName = true; 
  }

  async navigateToQuiz(index) {
    this.router.navigate(['/quiz-page', {index: index.groupId, name: index.groupName}]);
  }

  async studentRecords() {
    this.router.navigate(['/student-record', {}]);
  }

  async Logout() {
    await this.storage.set('username', null);
    await this.storage.set('password', null);
    await this.storage.set('authority', null);
    await this.storage.set('userId', null);

    this.checkAuthentication();
  }

}
