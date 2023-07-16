import { Component, OnInit } from '@angular/core';
import { BasicService } from '@app/theme/pages/basic-data/basic.service';
import { SaleService } from '@app/_service/sale.service';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Course } from '../../basic-data/basic.model';
import { Employee, Sale } from '@app/_service/main.types';
import { EmployeeService } from '../employee.service';

@Component({
  selector: 'app-zim-employee-sale',
  templateUrl: './zim-employee-sale.component.html',
  styleUrls: ['./zim-employee-sale.component.scss']
})
export class ZimEmployeeSaleComponent implements OnInit {

  rows = [];
  ColumnMode = ColumnMode;

  employeeSale$: Observable<Sale[]>;

  employee$: Observable<Employee[]>
  Employees: Employee[] = [];

  course$: Observable<Course[]>
  Courses: Course[] = [];

  sale$: Observable<Sale[]>
  Sales: Sale[] = [];

  isLoading: boolean;
  submitted: boolean;

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _SerivceSale: SaleService,
    private _SerivceEmp: EmployeeService,
    private _SerivceBasic: BasicService,
  ) { }

  ngOnInit(): void {
    this._SerivceEmp.salelistemps$.pipe(takeUntil(this._unsubscribeAll)).subscribe(sales => {

      this.rows = sales;

      this.rows = [...this.rows];

      this.isLoading = false;
    })
  }

  getNameEmployee(id: number) {
    let index = this.Employees.findIndex(type => type.empId === id);
    if (index === -1) {
      return "-";
    }
    else {
      return this.Employees[index].empFullname;
    }
  }

  getNameProduct(id: number) {
    let index = this.Courses.findIndex(type => type.courseId === id);
    if (index === -1) {
      return "-";
    }
    else {
      return this.Courses[index].courseNameEng;
    }
  }
}