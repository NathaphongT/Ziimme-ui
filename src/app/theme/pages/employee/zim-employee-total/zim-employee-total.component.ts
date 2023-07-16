import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { Sale } from '@app/_service/main.types';
import { SalePagination } from '@app/_service/pagination.types';
import { SaleService } from '@app/_service/sale.service';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { Subject, takeUntil } from 'rxjs';
import { EmployeeService } from '../employee.service';

@Component({
  selector: 'app-zim-employee-total',
  templateUrl: './zim-employee-total.component.html',
  styleUrls: ['./zim-employee-total.component.scss']
})
export class ZimEmployeeTotalComponent implements OnInit {
  @ViewChild(DatatableComponent, { static: true }) table: DatatableComponent;

  public slaes: Sale[];

  rows = [];
  ColumnMode = ColumnMode;

  isLoading: boolean;

  salePagination: SalePagination;
  searchInputControl: UntypedFormControl = new UntypedFormControl();
  private _unsubscribeAll: Subject<any> = new Subject<any>();


  constructor(
    private _SerivceEmp: EmployeeService,
    private _changeDetectorRef: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this._SerivceEmp.salelistemps$.pipe(takeUntil(this._unsubscribeAll)).subscribe(sales => {

      this.rows = sales;

      this.rows = [...this.rows];

      this.isLoading = false;
    })
  }
}
