import { Component, OnInit } from '@angular/core';
import { lessonButtons } from '../constants/lessonButton';
import { ActivatedRoute, Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { UtilityComponent } from '../utility/utility.component';
import { DbServiceService } from '../db-service.service';
import { ModalController } from '@ionic/angular';
import { AddLessonModalComponent } from '../add-lesson-modal/add-lesson-modal.component';

@Component({
  selector: 'app-lesson-forms',
  templateUrl: './lesson-forms.page.html',
  styleUrls: ['./lesson-forms.page.scss'],
})
export class LessonFormsPage implements OnInit {
  isAuthenticated: boolean = false;

  lessonList: any = [];
  isTeacher: any;

  newLessonName: any = null;
  addLessonName: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private storage: Storage,
    private util: UtilityComponent,
    private DbServiceService: DbServiceService,
    private modalController: ModalController) { 
      route.params.subscribe(async val => {
        this.checkAuthentication();
        this.isTeacher = await this.storage.get('authority');
      });
    }

  async ngOnInit() {
    for(let i = 0; i <= lessonButtons.length; i++) {
      if(i == lessonButtons.length) {
        const addedLesson = await this.DbServiceService.getLessonList();
        for(let iii = 0; iii < addedLesson.length; iii++) {
          this.lessonList.push({
            lesson: addedLesson[iii].lessonName,
            lock: JSON.parse(addedLesson[iii].lock)
          });
        }

      } else {
        const isLock = await this.storage.get(`l${i}-lock`);
        this.lessonList.push({
          lesson: lessonButtons[i],
          lock: isLock == null ? true : isLock
        });
      }
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

    if(index > 12) {
      await this.DbServiceService.updateLessonTbl(lesson.lock, index + 1)
    }
  }

  async studentRecords() {
    this.router.navigate(['/student-record', {}]);
  }

  async loadImageFromDevice(event) {
    this.lessonList.push({
      lesson: null,
      lock: true
    });
    this.addLessonName = true;
}

async AddLesson(lessonName, index) {
  if(this.newLessonName) {
    let ii = (index + 1);
    lessonName.lesson = 'Lesson ' + ii + ' - ' +  this.newLessonName;
    this.addLessonName = false;
    this.newLessonName = null;

    const modal = await this.modalController.create({
      component: AddLessonModalComponent,
      backdropDismiss: true,
    });

    
    modal.onDidDismiss().then(async (data) => {
      if(data.data) {
        await this.DbServiceService.addLessonToList(ii, lessonName.lesson, data.data[0], data.data[1], data.data[2], data.data[3], data.data[4]);
        this.lessonList = [];
        for(let i = 0; i <= lessonButtons.length; i++) {
          if(i == lessonButtons.length) {
            const addedLesson = await this.DbServiceService.getLessonList();
            for(let iii = 0; iii <addedLesson.length; iii++) {
              this.lessonList.push({
                lesson: addedLesson[iii].lessonName,
                lock: JSON.parse(addedLesson[iii].lock)
              });
            }
    
          } else {
            const isLock = await this.storage.get(`l${i}-lock`);
            this.lessonList.push({
              lesson: lessonButtons[i],
              lock: isLock == null ? true : isLock
            });
          }
        }
      }
    });

    return await modal.present();
  } else {
    alert('Lesson name cannot be empty');
  }
}

RemoveLesson(lesson, index) {
  if(lesson){
    this.lessonList.splice(index, 1);
    this.newLessonName = null;
    this.addLessonName = false;
  }
}

}
