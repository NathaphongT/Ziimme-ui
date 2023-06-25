import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { BasicService } from '@app/theme/pages/basic-data/basic.service';
import { EmployeeService } from '@app/_service/employee.service';
import { SaleService } from '@app/_service/sale.service';
import { Branch, Position} from '../basic-data/basic.model';
import { Employee, Sale, SaleEmployee } from '@app/_service/main.types';

@Injectable({
  providedIn: 'root'
})
export class EmployeeResolver implements Resolve<any> {

  constructor(private _basicService: EmployeeService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | Employee[]> {
    return this._basicService.getAllEmployee();
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
      // this._saleService.getWareHouseById(route.paramMap.get('id')),
      this._saleService.getSaleBYIDSale(route.paramMap.get('id')),
      this._saleService.getSaleBYIDConsult(route.paramMap.get('id'))
      

    ]);
  }
}
