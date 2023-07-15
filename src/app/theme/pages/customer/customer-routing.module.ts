import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerComponent } from './customer.component';
import { ZimCustomerComponent } from './zim-customer/zim-customer.component';
import { ZimCustomersComponent } from './zim-customers/zim-customers.component';
import { ZimViewCustomerComponent } from './zim-view-customer/zim-view-customer.component';
import { CustomerIDResolver, CustomerResolver, ProvinceResolver, SaleByIdSlaeResolver, SaleEmployeeByIdCusResolver, SubDistrictsResolver, SaleListResolver, SaleCutOrderResolver } from './customer.resolver';
import { ZimViewHistoryComponent } from './zim-view-history/zim-view-history.component';
import { ZimViewBirthdayComponent } from './zim-view-birthday/zim-view-birthday.component';
import { CourseResolver } from '../basic-data/basic.resolver';
import { EmployeeResolver } from '../employee/employee.resolver';

const routes: Routes = [
  {
    path: '',
    component: CustomerComponent,
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
            component: ZimCustomerComponent,
            resolve: {
              warehouses: CustomerResolver
            }
          },
          {
            path: 'new',
            component: ZimCustomersComponent,
            resolve: {
              provinces: ProvinceResolver,
            },
          },
          {
            path: ':id',
            component: ZimCustomersComponent,
            resolve: {
              customersID: CustomerIDResolver,
              provinces: ProvinceResolver,
            }
          },
          {
            path: 'views/:id',
            component: ZimViewCustomerComponent,
            resolve: {
              sales: SaleListResolver,
              courses: CourseResolver,
              employee: EmployeeResolver,
            }
          },
          {
            path: 'views/history/:id',
            component: ZimViewHistoryComponent,
            resolve: {
              employees: EmployeeResolver,
              saleByIdSale: SaleByIdSlaeResolver,
              saleCutAll: SaleCutOrderResolver,
            }
          },
        ]
      }
    ],
  },
  {
    path: 'birthday',
    component: ZimViewBirthdayComponent,
    resolve: {
      customeres: CustomerResolver
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule { }
