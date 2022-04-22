import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { AuthenticationModalComponent } from '../authentication-modal/authentication-modal.component';
import { Storage } from '@ionic/storage';
import { lessonButtons } from '../constants/lessonButton';
import { DbServiceService } from '../db-service.service';
import { UtilityComponent } from '../utility/utility.component';
import { AddQuizModalComponent } from '../add-quiz-modal/add-quiz-modal.component';

@Component({
  selector: 'app-quiz-page',
  templateUrl: './quiz-page.page.html',
  styleUrls: ['./quiz-page.page.scss'],
})
export class QuizPagePage implements OnInit {
  lessonList: any;
  isAuthenticated: boolean = false;
  quizList: any;
  isTeacher: any = false;
  isLoading: any = true;
  isExamDone: any = false;
  myParam: string;
  examTitle: any;

  constructor(private modalController: ModalController,
    private route:ActivatedRoute,
    private router: Router,
    private storage: Storage,
    private DbServiceService: DbServiceService,
    private util: UtilityComponent
    ) {
      route.params.subscribe(async val => {
        this.myParam = this.route.snapshot.paramMap.get('index');
        this.examTitle = this.route.snapshot.paramMap.get('name');
        this.util.presentLoading('Initializing Exam...');
        await this.checkAuthentication();
        this.lessonList = lessonButtons;
        this.isTeacher = await this.storage.get('authority');
        await this.GetQuizList();
        this.isLoading = false;
      });
     }

  async ngOnInit() {

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

  async quizNavigate(index) {
    this.router.navigate(['/quiz-form', {index: index}]);
  }

  async Logout() {
    await this.storage.set('username', null);
    await this.storage.set('password', null);
    await this.storage.set('authority', null);
    await this.storage.set('userId', null);

    this.checkAuthentication();
  }

  async GetQuizList() {
    const quizList = await this.DbServiceService.getQuizList(this.myParam);
    this.quizList = quizList;
  }

  async getSelectedAnswer(event, list) {
    list['selected'] = event.detail.value;
  }

  async SubmitQuiz() {
    let score = 0;
    for(let i = 0; i < this.quizList.length;i++) {
      if(this.quizList[i].answer == this.quizList[i].selected) {
        score = score + 1;
      }
    }
    await this.util.presentLoading('Checking Exam...');
    let userId = await this.storage.get('userId');
    this.DbServiceService.submitQuiz(userId, this.myParam, score);
    alert('Score: ' + score);
    this.isExamDone = true;
  }

  async AddQuiz() {
    const modal = await this.modalController.create({
      component: AddQuizModalComponent,
      backdropDismiss: true,
      componentProps: {
        index: this.myParam,
     }
    });

    modal.onDidDismiss().then(async (data) => {
      if(data.data) {

      }
      await this.GetQuizList();
    });

    return await modal.present();
  }

}
