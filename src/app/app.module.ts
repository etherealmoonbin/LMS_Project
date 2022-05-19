import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { IonicStorageModule } from '@ionic/storage-angular';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { FormsModule } from '@angular/forms';
import { AuthenticationModalComponent } from './authentication-modal/authentication-modal.component';
import { AddQuizModalComponent } from './add-quiz-modal/add-quiz-modal.component';
import { UtilityComponent } from './utility/utility.component';
import { NativeAudio } from '@awesome-cordova-plugins/native-audio/ngx';
import {CustomMaxlengthModule} from 'custom-maxlength';
import { AddLessonModalComponent } from './add-lesson-modal/add-lesson-modal.component';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';

@NgModule({
  declarations: [
    AppComponent,
    AuthenticationModalComponent,
    AddQuizModalComponent,
    AddLessonModalComponent],
  entryComponents: [],
  imports: [
    BrowserModule, 
    IonicModule.forRoot({
      platform: {
         /** The default `desktop` function returns false for devices with a touchscreen.
        * This is not always wanted, so this function tests the User Agent instead.
        **/
          'desktop': (win) => {
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(win.navigator.userAgent);
            return !isMobile;
          }
      }
    }), 
    AppRoutingModule,
    IonicStorageModule.forRoot(),
    FormsModule,
    CustomMaxlengthModule
   ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    SQLite,
    UtilityComponent,
    NativeAudio,
    SplashScreen
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
