import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules, ExtraOptions } from '@angular/router';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { GuestComponent } from './theme/layout/guest/guest.component';
import { AuthGuard } from './_service/auth copy/guards/auth.guard';
import { NoAuthGuard } from './_service/auth copy/guards/no-auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'customer/list',
    pathMatch: 'full',
  },
  { path: 'signed-in-redirect', pathMatch: 'full', redirectTo: 'customer/list' },
  {
    path: '',
    canMatch: [NoAuthGuard],
    component: GuestComponent,
    children: [
      { path: 'sign-in', loadChildren: () => import('src/app/demo/pages/authentication/authentication.module').then(m => m.AuthenticationModule) },
    ]
  },
  {
    path: '',
    canMatch: [AuthGuard],
    component: GuestComponent,
    children: [
      { path: 'sign-out', loadChildren: () => import('src/app/demo/pages/authentication/sign-out/sign-out.module').then(m => m.AuthSignOutModule) }
    ]
  },

  {
    path: '',
    component: AdminComponent,
    canMatch: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'customer',
        pathMatch: 'full',
      },
      {
        path: 'employee',
        loadChildren: () =>
          import('./theme/pages/employee/employee.module').then(
            (m) => m.EmployeeModule
          ),
      },
      {
        path: 'customer',
        loadChildren: () =>
          import('./theme/pages/customer/customer.module').then(
            (m) => m.CustomerModule
          ),
      },
      {
        path: 'basic',
        loadChildren: () =>
          import('./theme/pages/basic-data/basic-data.module').then(
            (m) => m.BasicDataModule
          ),
      },
    ],
  },
];

const routerConfig: ExtraOptions = {
  preloadingStrategy: PreloadAllModules,
  scrollPositionRestoration: 'enabled',
  onSameUrlNavigation: 'reload'
};

@NgModule({
  imports: [RouterModule.forRoot(routes, routerConfig)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
