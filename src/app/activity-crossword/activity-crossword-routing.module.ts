import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActivityCrosswordPage } from './activity-crossword.page';

const routes: Routes = [
  {
    path: '',
    component: ActivityCrosswordPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActivityCrosswordPageRoutingModule {}
