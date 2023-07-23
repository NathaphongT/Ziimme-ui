import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { BasicService } from './basic.service';
import { BranchPagination, CoursePagination, PositionPagination, UserPagination } from '@app/_service/pagination.types';
import { Branch, Course, Position } from './basic.model';
import { User } from '@app/_service/user.types';
import { UserService } from '@app/_service/user.service';

@Injectable({
  providedIn: 'root'
})
export class UserResolver implements Resolve<any> {

  constructor(private _service: UserService) {

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<{ pagination: UserPagination, users: User[] }> {
    return this._service.getUser();
  }
}


@Injectable({
  providedIn: 'root'
})
export class CourseResolver implements Resolve<any> {

  constructor(private _service: BasicService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<{ pagination: CoursePagination, courses: Course[] }> {
    return this._service.getCourse();
  }
}

@Injectable({
  providedIn: 'root'
})
export class CourseAllResolver implements Resolve<any> {

  constructor(private _service: BasicService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | Course[]> {
    return this._service.getAllCourse();
  }
}

@Injectable({
  providedIn: 'root'
})
export class PositionResolver implements Resolve<any> {

  constructor(private _service: BasicService) {

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<{ pagination: PositionPagination, positions: Position[] }> {
    return this._service.getPosition();
  }
}

@Injectable({
  providedIn: 'root'
})
export class BranchResolver implements Resolve<any> {

  constructor(private _service: BasicService) {

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<{ pagination: BranchPagination, branchs: Branch[] }> {
    return this._service.getBranch();
  }
}

