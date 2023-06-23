import { Component, OnInit } from '@angular/core';
import { BasicService } from '@app/theme/pages/basic-data/basic.service';
import { EmployeeService } from '@app/_service/employee.service';
import { SaleService } from '@app/_service/sale.service';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Course } from '../../basic-data/basic.model';
import { Employee, Sale } from '@app/_service/main.types';

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

  isLoading: boolean;
  submitted: boolean;

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _SerivceSale: SaleService,
    private _SerivceEmp: EmployeeService,
    private _SerivceBasic: BasicService,
  ) { }

  ngOnInit(): void {

    this._SerivceEmp.employees$.pipe(takeUntil(this._unsubscribeAll)).subscribe(employees => {
      this.Employees = employees;
    })

    this._SerivceBasic.courses$.pipe(takeUntil(this._unsubscribeAll)).subscribe(courses => {
      this.Courses = courses;
    })

    this.employeeSale$ = this._SerivceSale.sales$;

    this.employeeSale$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((employees) => {

        if (employees) {
          this.rows = employees;

          this.rows = [...this.rows];
        }
        else {
          this.rows = [];
        }

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
    let index = this.Courses.findIndex(type => type.course_id === id);
    if (index === -1) {
      return "-";
    }
    else {
      return this.Courses[index].course_name_eng;
    }
  }
}