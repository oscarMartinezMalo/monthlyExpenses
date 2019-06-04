import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ExpenseComponent } from './expense/expense.component';


const routes: Routes = [
  { path: '', component: ExpenseComponent},
  { path: 'expense', component: ExpenseComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
