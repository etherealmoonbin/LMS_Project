import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { lessonButtons, lessonPageLength } from '../constants/lessonButton';
import { Storage } from '@ionic/storage';
import { UtilityComponent } from '../utility/utility.component';
import { DbServiceService } from '../db-service.service';

@Component({
  selector: 'app-lesson-page',
  templateUrl: './lesson-page.page.html',
  styleUrls: ['./lesson-page.page.scss'],
})
export class LessonPagePage implements OnInit {
  myParam: any;
  lessonTitle: any;
  lessonPageLength: any = [];
  isAuthenticated: boolean = false;
  isTeacher: any;
  isPreloadedLesson: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private storage: Storage,
    private util: UtilityComponent,
    private DbServiceService: DbServiceService
    ) {
      route.params.subscribe(async val => {
        await this.checkAuthentication();
        this.isTeacher = await this.storage.get('authority');
        await this.util.presentLoading('Loading Lessons');
      });
     }

  async ngOnInit() {
    this.myParam = parseInt(this.route.snapshot.paramMap.get('index'));
    if(this.myParam > 12) {
      this.isPreloadedLesson = false;
      const lessonSelected = await this.DbServiceService.getLessonList(this.myParam + 1);
      this.lessonPageLength = lessonSelected[0].lessons;
      this.lessonTitle = lessonSelected[0].lessonName;
    } else {
      this.isPreloadedLesson = true;
      for(let i = 0; i < lessonPageLength[this.myParam]; i++) {
        await this.lessonPageLength.push(i+1);
        console.log(`L${this.myParam} - ${i + 1}`)
      }
      this.lessonTitle = lessonButtons[this.myParam];
    }
   }

   async NavigateCrossWord(index) {
    this.router.navigate(['/activity-crossword', {index: index}]);
   }

   async checkAuthentication() {
    const username = await this.storage.get('username');
    const password = await this.storage.get('password');

    if(username == null && password == null) {
      this.isAuthenticated = false;
    } else {
      this.isAuthenticated = true;
    }
  }



}
