import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { LibraryCategoriesListComponent } from './library-categories-list/library-categories-list.component';
import { SelectedCategoriesListComponent } from './selected-categories-list/selected-categories-list.component';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: LibraryCategoriesListComponent
  },
  {
    path: ':category',
    component: SelectedCategoriesListComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    TranslateModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  declarations: [LibraryCategoriesListComponent, SelectedCategoriesListComponent]
})

export class ProjectLibraryModule {}
