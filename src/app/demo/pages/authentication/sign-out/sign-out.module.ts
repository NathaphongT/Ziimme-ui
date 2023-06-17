import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthSignOutComponent } from './sign-out.component';
import { SignOutRoutingModule } from './sign-out-routing.module';


@NgModule({
  declarations: [
    AuthSignOutComponent,
  ],
  imports: [
    CommonModule,
    SignOutRoutingModule,
  ]
})
export class AuthSignOutModule { }
