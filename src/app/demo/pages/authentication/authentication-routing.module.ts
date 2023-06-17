import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import AuthSigninComponent from './auth-signin/auth-signin.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: 'signin',
        pathMatch: 'full',
      },
      {
        path: 'signin',
        component: AuthSigninComponent
      },
      /* {
        path: 'signup',
        loadComponent: () => import('./auth-signup/auth-signup.component'),
      }, */
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthenticationRoutingModule { }
