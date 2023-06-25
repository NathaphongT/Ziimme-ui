import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { CustomerService } from '@app/theme/pages/customer/customer.service';
import { EmployeeService } from '@app/_service/employee.service';
import { SaleService } from '@app/_service/sale.service';
import { Customer } from '@app/_service/user.types';
import { Observable, forkJoin } from 'rxjs';
import { BasicService } from '@app/theme/pages/basic-data/basic.service';
import { Course, Districts, PostCode, Province, SaleCut, SubDistricts } from '../basic-data/basic.model';
import { Employee, Sale, SaleEmployee } from '@app/_service/main.types';
import { CustomerPagination, SalePagination } from '@app/_service/pagination.types';

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
export class CustomerResolver implements Resolve<any> {

  constructor(private _service: CustomerService) {

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<{ pagination: CustomerPagination, customers: Customer[] }> {
    return this._service.getCustomer();
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
export class SaleResolver implements Resolve<any> {

  constructor(private _saleService: SaleService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | Sale[]> {
    return this._saleService.getAllSale();
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
export class SaleEmployeeByIdCusResolver implements Resolve<any> {

  constructor(private _saleService: SaleService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | Sale[]> {
    return this._saleService.getSaleBYIDConsult(route.paramMap.get('id'));
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
export class SaleEmployeeResolver implements Resolve<any> {

  constructor(private _empService: EmployeeService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | Employee[]> {
    return this._empService.getAllEmployee();
  }

}