import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QuizFormPage } from './quiz-form.page';

const routes: Routes = [
  {
    path: '',
    component: QuizFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuizFormPageRoutingModule {}
