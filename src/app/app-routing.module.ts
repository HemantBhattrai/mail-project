import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { MailDetailComponent } from './mail-detail/mail-detail.component';


const routes: Routes = [
  { path: 'mail', component: MailDetailComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes),CommonModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [MailDetailComponent];
