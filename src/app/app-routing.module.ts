import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'lesson-forms',
    loadChildren: () => import('./lesson-forms/lesson-forms.module').then( m => m.LessonFormsPageModule)
  },
  {
    path: 'lesson-page',
    loadChildren: () => import('./lesson-page/lesson-page.module').then( m => m.LessonPagePageModule)
  },
  {
    path: 'activity-page',
    loadChildren: () => import('./activity-page/activity-page.module').then( m => m.ActivityPagePageModule)
  },
  {
    path: 'quiz-page',
    loadChildren: () => import('./quiz-page/quiz-page.module').then( m => m.QuizPagePageModule)
  },
  {
    path: 'quiz-form',
    loadChildren: () => import('./quiz-form/quiz-form.module').then( m => m.QuizFormPageModule)
  },
  {
    path: 'activity-crossword',
    loadChildren: () => import('./activity-crossword/activity-crossword.module').then( m => m.ActivityCrosswordPageModule)
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
