import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { AuthenticationModalComponent } from '../authentication-modal/authentication-modal.component';
import { Storage } from '@ionic/storage';
import { lessonButtons } from '../constants/lessonButton';

@Component({
  selector: 'app-activity-page',
  templateUrl: './activity-page.page.html',
  styleUrls: ['./activity-page.page.scss'],
})
export class ActivityPagePage implements OnInit {

  isAuthenticated: boolean = false;
  isTeacher: any;
  lessonNumber: any;
  
  constructor(private modalController: ModalController,
    private route:ActivatedRoute,
    private storage: Storage,
    private router: Router) {
      route.params.subscribe(async val => {
        this.checkAuthentication();
        this.isTeacher = await this.storage.get('authority');
      });
     }

  ngOnInit() {
    this.lessonNumber = lessonButtons;
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

  async Logout() {
    await this.storage.set('username', null);
    await this.storage.set('password', null);
    await this.storage.set('authority', null);
    await this.storage.set('userId', null);

    this.checkAuthentication();
  }

  async NavigateCrossWord(index) {
    this.router.navigate(['/activity-crossword', {index: index}]);
  }

  async studentRecords() {
    this.router.navigate(['/student-record', {}]);
  }

}
