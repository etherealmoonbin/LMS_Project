import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ActivityCrosswordPageRoutingModule } from './activity-crossword-routing.module';

import { ActivityCrosswordPage } from './activity-crossword.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ActivityCrosswordPageRoutingModule
  ],
  declarations: [ActivityCrosswordPage]
})
export class ActivityCrosswordPageModule {}
