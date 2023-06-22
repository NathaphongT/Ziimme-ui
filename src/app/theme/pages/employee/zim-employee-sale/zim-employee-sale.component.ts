import { Component, OnInit } from '@angular/core';
import { BasicService } from '@app/theme/pages/basic-data/basic.service';
import { EmployeeService } from '@app/_service/employee.service';
import { SaleService } from '@app/_service/sale.service';
import { Employee } from '@app/_service/user.types';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Course, Sale } from '../../basic-data/basic.model';

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

  }

  
}