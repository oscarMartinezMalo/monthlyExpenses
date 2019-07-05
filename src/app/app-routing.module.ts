import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ExpenseComponent } from './expense/expense.component';
import { SignupComponent } from './auth/signup/signup.component';
import { SigninComponent } from './auth/signin/signin.component';
import { AuthGuard } from './auth/auth-guard.service';
import { ForgotPassComponent } from './auth/forgot-pass/forgot-pass.component';


const routes: Routes = [
  { path: '', component: SigninComponent },
  { path: 'expense', component: ExpenseComponent, canActivate: [AuthGuard] },
  { path: 'signup', component: SignupComponent },
  { path: 'signin', component: SigninComponent },
  { path: 'forgotpass', component: ForgotPassComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
