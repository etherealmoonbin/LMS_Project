import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LessonPagePage } from './lesson-page.page';

const routes: Routes = [
  {
    path: '',
    component: LessonPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LessonPagePageRoutingModule {}
