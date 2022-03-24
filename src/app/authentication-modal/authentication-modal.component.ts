import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DbServiceService } from '../db-service.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-authentication-modal',
  templateUrl: './authentication-modal.component.html',
  styleUrls: ['./authentication-modal.component.scss'],
})
export class AuthenticationModalComponent implements OnInit {

  username: string = "";
  password: string = "";

  constructor(private modalController: ModalController,
    private DbServiceService: DbServiceService,
    private storage: Storage) { }

  ngOnInit() {

  }

  async login() {
    if(this.username == "" || this.password == "") {
      alert('Incomplete Fields');
      return;
    }
    const isLogin = await this.DbServiceService.login(this.username, this.password);
    if(isLogin) {
      this.modalController.dismiss(isLogin);
      await this.storage.set('username', isLogin[0]);
      await this.storage.set('password', isLogin[1]);
      await this.storage.set('authority', isLogin[2] ? isLogin[2] : null);
    }
  }

  async register() {
    if(this.username == "" || this.password == "") {
      alert('Incomplete Fields');
      return;
    }
    const isLogin = await this.DbServiceService.registerUser(this.username, this.password);
    if(isLogin) {
      this.modalController.dismiss(isLogin);
      await this.storage.set('username', isLogin[0]);
      await this.storage.set('password', isLogin[1]);
      await this.storage.set('authority', isLogin[2] ? isLogin[2] : null);
    }
  }
}
