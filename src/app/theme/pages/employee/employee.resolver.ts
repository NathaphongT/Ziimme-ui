import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { BasicService } from '@app/theme/pages/basic-data/basic.service';
import { SaleService } from '@app/_service/sale.service';
import { Branch, Position } from '../basic-data/basic.model';
import { Employee, Sale, SaleEmployee } from '@app/_service/main.types';
import { EmployeeService } from './employee.service';
import { EmployeePagination, SalePagination } from '@app/_service/pagination.types';

@Injectable({
  providedIn: 'root'
})
export class EmployeeResolver implements Resolve<any> {

  constructor(private _service: EmployeeService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<{ pagination: EmployeePagination, employees: Employee[] }> {
    return this._service.getEmployee();
  }
}

@Injectable({
  providedIn: 'root'
})
export class SaleResolver implements Resolve<any> {

  constructor(private _service: SaleService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<{ pagination: SalePagination, sales: Sale[] }> {
    return this._service.getSale();
  }
}


@Injectable({
  providedIn: 'root'
})
export class PositionResolver implements Resolve<any> {

  constructor(private _basicService: BasicService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | Position[]> {
    return this._basicService.getAllPosition();
  }

}

@Injectable({
  providedIn: 'root'
})
export class BranchResolver implements Resolve<any> {

  constructor(private _basicService: BasicService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | Branch[]> {
    return this._basicService.getAllBranch();
  }

}


@Injectable({
  providedIn: 'root'
})
export class SaleByIdConResolver implements Resolve<any> {

  constructor(private _saleService: SaleService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return forkJoin([
      // this._saleService.getSaleCusById(route.paramMap.get('id')),
      this._saleService.getSaleBYIDSale(route.paramMap.get('id')),
      this._saleService.getSaleBYIDConsult(route.paramMap.get('id'))


    ]);
  }
}