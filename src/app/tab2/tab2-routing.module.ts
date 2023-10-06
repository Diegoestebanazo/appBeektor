import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Tab2Page } from './tab2.page';
import { AddPanalComponent } from './add-panal/add-panal.component';

const routes: Routes = [
  {
    path: 'tab2',
    component: Tab2Page,
  },
  {
    path: 'add-panal',
    component: AddPanalComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Tab2PageRoutingModule { }
