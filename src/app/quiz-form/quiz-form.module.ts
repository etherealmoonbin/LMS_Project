import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QuizFormPageRoutingModule } from './quiz-form-routing.module';

import { QuizFormPage } from './quiz-form.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QuizFormPageRoutingModule
  ],
  declarations: [QuizFormPage]
})
export class QuizFormPageModule {}
