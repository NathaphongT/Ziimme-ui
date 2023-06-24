import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerComponent } from './customer.component';
import { ZimCustomerComponent } from './zim-customer/zim-customer.component';
import { ZimCustomersComponent } from './zim-customers/zim-customers.component';
import { ZimViewCustomerComponent } from './zim-view-customer/zim-view-customer.component';
import { CustomerIDResolver, CustomerResolver, DistrictsResolver, EmployeeResolver, ProvinceResolver, SaleByIdCusResolver, SaleByIdSlaeResolver, SaleCutOrderResolver, SaleCutResolver, SaleEmployeeResolver, SubDistrictsResolver } from './customer.resolver';
import { ZimViewHistoryComponent } from './zim-view-history/zim-view-history.component';
import { ZimViewBirthdayComponent } from './zim-view-birthday/zim-view-birthday.component';

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
              customeres: CustomerResolver,
              // saleemployee: SaleEmployeeResolver
            },
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
              // district: DistrictsResolver,
              // subdistricts: SubDistrictsResolver,
            }
          },
          {
            path: 'views/:id',
            component: ZimViewCustomerComponent,
            resolve: {
              employees: EmployeeResolver,
              // courses: CourseResolver,
              customersID: CustomerIDResolver,
              // sales: SaleResolver,
              saleById: SaleByIdCusResolver,
            }
          },
          {
            path: 'views/history/:id',
            component: ZimViewHistoryComponent,
            resolve: {
              employees: EmployeeResolver,
              // courses: CourseResolver,
              // sales: SaleResolver,
              saleByIdSale: SaleByIdSlaeResolver,
              saleCutAll: SaleCutResolver,
              // saleCutAllOrder: SaleCutOrderResolver,
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
