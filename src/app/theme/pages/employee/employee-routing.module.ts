import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeComponent } from './employee.component';
import { ZimEmployeeComponent } from './zim-employee/zim-employee.component';
import { BranchResolver, EmployeeResolver, PositionResolver, SaleByIdConResolver } from './employee.resolver';
import { ZimEmployeeSaleComponent } from './zim-employee-sale/zim-employee-sale.component';
import { CourseResolver } from '../customer/customer.resolver';
import { ZimEmployeeTotalComponent } from './zim-employee-total/zim-employee-total.component';
import { ZimEmployeePromotionComponent } from './zim-employee-promotion/zim-employee-promotion.component';

const routes: Routes = [
  {
    path: '',
    component: EmployeeComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        children: [
          {
            path: '',
            component: ZimEmployeeComponent,
            resolve: {
              employees: EmployeeResolver,
              positions: PositionResolver,
              branchs: BranchResolver,
            },
          },
          {
            path: ':id',
            component: ZimEmployeeSaleComponent,
            resolve: {
              slaeByIDConsult: SaleByIdConResolver,
              employees: EmployeeResolver,
              courses: CourseResolver,
          }
          },
    ]
  },
  {
    path: 'total-sale',
    component: ZimEmployeeTotalComponent,
  },
  {
    path: 'promotiom-sale',
    component: ZimEmployeePromotionComponent,
  }
],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeRoutingModule { }
