import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { CustomerService } from '@app/theme/pages/customer/customer.service';
import { EmployeeService } from '@app/_service/employee.service';
import { SaleService } from '@app/_service/sale.service';
import { Customer, Employee } from '@app/_service/user.types';
import { Observable, forkJoin } from 'rxjs';
import { BasicService } from '@app/theme/pages/basic-data/basic.service';
import { Course, Districts, PostCode, Province, Sale, SaleCut, SubDistricts } from '../basic-data/basic.model';



@Injectable({
  providedIn: 'root'
})
export class CustomerResolver implements Resolve<any> {

  constructor(private _customerService: CustomerService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | Customer[]> {
    return this._customerService.getAllCustomer();
  }

}

@Injectable({
  providedIn: 'root'
})
export class CustomerIDResolver implements Resolve<any> {

  constructor(private _customerService: CustomerService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | Customer> {
    return this._customerService.getByIdCustomer(route.paramMap.get('id'));
  }

}

@Injectable({
  providedIn: 'root'
})
export class EmployeeResolver implements Resolve<any> {

  constructor(private _employeeService: EmployeeService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | Employee[]> {
    return this._employeeService.getAllEmployee();
  }

}

@Injectable({
  providedIn: 'root'
})
export class CourseResolver implements Resolve<any> {

  constructor(private _basicService: BasicService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | Course[]> {
    return this._basicService.getAllCourse();
  }

}

@Injectable({
  providedIn: 'root'
})
export class SaleResolver implements Resolve<any> {

  constructor(private _saleService: SaleService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | Sale[]> {
    return this._saleService.getAllSale();
  }

}

@Injectable({
  providedIn: 'root'
})
export class SaleByIdSlaeResolver implements Resolve<any> {

  constructor(private _saleService: SaleService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | Sale[]> {
    return this._saleService.getSaleBYIDSale(route.paramMap.get('id'));
  }

}

@Injectable({
  providedIn: 'root'
})
export class SaleByIdCusResolver implements Resolve<any> {

  constructor(private _saleService: SaleService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | Sale[]> {
    return this._saleService.getSaleBYIDCus(route.paramMap.get('id'));
  }

}


@Injectable({
  providedIn: 'root'
})
export class SaleCutResolver implements Resolve<any> {

  constructor(private _saleService: SaleService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | SaleCut[]> {
    return this._saleService.getSaleCutBYID(route.paramMap.get('id'));
  }

}

@Injectable({
  providedIn: 'root'
})
export class SaleCutOrderResolver implements Resolve<any> {

  constructor(private _saleService: SaleService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | SaleCut> {
    return this._saleService.getSaleCutBYIDOrder(route.paramMap.get('id'));
  }

}


@Injectable({
  providedIn: 'root'
})
export class ProvinceResolver implements Resolve<any> {

  constructor(private _basicService: BasicService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | Province[]> {
    return this._basicService.getAllProvince();
  }
}

@Injectable({
  providedIn: 'root'
})
export class DistrictsResolver implements Resolve<any> {

  constructor(private _basicService: BasicService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | Districts[]> {
    return this._basicService.getAllDistricts();
  }

}

@Injectable({
  providedIn: 'root'
})
export class SubDistrictsResolver implements Resolve<any> {

  constructor(private _basicService: BasicService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | SubDistricts[]> {
    return this._basicService.getAllSubDistricts();
  }

}

@Injectable({
  providedIn: 'root'
})
export class SaleEmployeeResolver implements Resolve<any> {

  constructor(private _empService: EmployeeService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | Employee[]> {
    return this._empService.getAllEmployee();
  }

}

// export class SaleEmployeeResolver implements Resolve<any> {

//   constructor(
//     private _saleService: SaleService,
//     private _empService: EmployeeService
//     ) { }

//   resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<{ warehouses: Sale[] } | any> {
//     return forkJoin([
//       this._saleService.getAllSale(),
//       this._empService.getAllEmployee()
//     ]);
//   }

// }
