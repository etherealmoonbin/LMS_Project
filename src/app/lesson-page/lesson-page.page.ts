import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { lessonButtons, lessonPageLength } from '../constants/lessonButton';
import { Storage } from '@ionic/storage';
import { UtilityComponent } from '../utility/utility.component';

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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private storage: Storage,
    private util: UtilityComponent
    ) {
      route.params.subscribe(async val => {
        await this.checkAuthentication();
        this.isTeacher = await this.storage.get('authority');
        await this.util.presentLoading('Loading Lessons');
      });
     }

  async ngOnInit() {
    this.myParam = parseInt(this.route.snapshot.paramMap.get('index'));
    this.lessonTitle = lessonButtons[this.myParam];
    for(let i = 0; i < lessonPageLength[this.myParam]; i++) {
      await this.lessonPageLength.push(i+1);
      console.log(`L${this.myParam} - ${i + 1}`)
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
