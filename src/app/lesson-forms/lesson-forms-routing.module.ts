import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LessonFormsPage } from './lesson-forms.page';

const routes: Routes = [
  {
    path: '',
    component: LessonFormsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LessonFormsPageRoutingModule {}
