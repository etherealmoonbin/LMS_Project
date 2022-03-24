import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LessonFormsPageRoutingModule } from './lesson-forms-routing.module';

import { LessonFormsPage } from './lesson-forms.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LessonFormsPageRoutingModule
  ],
  declarations: [LessonFormsPage]
})
export class LessonFormsPageModule {}
