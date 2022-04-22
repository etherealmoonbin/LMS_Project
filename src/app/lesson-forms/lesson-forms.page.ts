import { Component, OnInit } from '@angular/core';
import { lessonButtons } from '../constants/lessonButton';
import { ActivatedRoute, Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { UtilityComponent } from '../utility/utility.component';

@Component({
  selector: 'app-lesson-forms',
  templateUrl: './lesson-forms.page.html',
  styleUrls: ['./lesson-forms.page.scss'],
})
export class LessonFormsPage implements OnInit {
  isAuthenticated: boolean = false;

  lessonList: any = [];
  isTeacher: any;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private storage: Storage,
    private util: UtilityComponent) { 
      route.params.subscribe(async val => {
        this.checkAuthentication();
        this.isTeacher = await this.storage.get('authority');
      });
    }

  async ngOnInit() {
    for(let i = 0; i < lessonButtons.length; i++) {
      const isLock = await this.storage.get(`l${i}-lock`)
      this.lessonList.push({
        lesson: lessonButtons[i],
        lock: isLock == null ? true : isLock
      });
    }

    const username = await this.storage.get('username');
    const password = await this.storage.get('password');

    if(username == null && password == null) { 
      this.isAuthenticated = false;
    } else {
      this.isAuthenticated = true;
    }
  }

  lessonNavigate(index, lock) {
    if(lock) {
      this.util.presentToast('Lesson is locked');
      return;
    }
    this.router.navigate(['/lesson-page', {index: index}]);
    console.log(index);
  }

  async checkAuthentication() {
    const username = await this.storage.get('username');
    const password = await this.storage.get('password');

    if(username == null && password == null) {
      this.isAuthenticated = false;
    } else {
      this.isAuthenticated = true;
    }
    this.isTeacher = await this.storage.get('authority');
  }

  async Logout() {
    await this.storage.set('username', null);
    await this.storage.set('password', null);
    await this.storage.set('authority', null);
    await this.storage.set('userId', null);
    
    this.checkAuthentication();
  }

  async unlockLesson(index, lesson) {
    lesson.lock = !lesson.lock;
    await this.storage.set(`l${index}-lock`, lesson.lock);
  }

  async studentRecords() {
    this.router.navigate(['/student-record', {}]);
  }

}
