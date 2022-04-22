import { Component } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { DbServiceService } from './db-service.service';
import { NativeAudio } from '@awesome-cordova-plugins/native-audio/ngx';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private storage: Storage,
    private dbService: DbServiceService,
    private nativeAudio: NativeAudio,
    private platform: Platform
  ) { }

  private sounds: any[] = [];
  private audioPlayer: HTMLAudioElement = new Audio();
  private forceWebAudio: boolean = true;

  async ngOnInit() {
    await this.storage.create();
    await this.dbService.databaseConn();
    this.preload('bg', 'assets/audio/bg1.mp3');
    // this.play('bg');

  }

  preload(key: string, asset: string): void {
    if(this.platform.is('cordova') && !this.forceWebAudio){
      this.nativeAudio.preloadSimple(key, asset);
      this.sounds.push({
        key: key,
        asset: asset,
        isNative: true
      });
    } else {
      let audio = new Audio();
      audio.src = asset;
      this.sounds.push({
        key: key,
        asset: asset,
        isNative: false
      });
    }
  }
  play(key: string): void {
    let soundToPlay = this.sounds.find((sound) => {
      return sound.key === key;
    });
    if(soundToPlay.isNative){
      this.nativeAudio.play(soundToPlay.asset).then((res) => {
        console.log(res);
      }, (err) => {
        console.log(err);
      });
    } else {
      this.audioPlayer.src = soundToPlay.asset;
      this.audioPlayer.play();
      this.audioPlayer.volume = 0.5;
      this.audioPlayer.loop = true;
    }
  }
}

