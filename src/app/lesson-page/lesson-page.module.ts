import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LessonPagePageRoutingModule } from './lesson-page-routing.module';

import { LessonPagePage } from './lesson-page.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LessonPagePageRoutingModule
  ],
  declarations: [LessonPagePage]
})
export class LessonPagePageModule {}
