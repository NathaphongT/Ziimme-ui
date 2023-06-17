import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthSignOutComponent } from './sign-out.component';

const routes: Routes = [
  {
    path: '',
    component: AuthSignOutComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SignOutRoutingModule { }
