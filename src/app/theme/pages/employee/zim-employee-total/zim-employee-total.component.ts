import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { Sale } from '@app/_service/main.types';
import { SalePagination } from '@app/_service/pagination.types';
import { SaleService } from '@app/_service/sale.service';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-zim-employee-total',
  templateUrl: './zim-employee-total.component.html',
  styleUrls: ['./zim-employee-total.component.scss']
})
export class ZimEmployeeTotalComponent implements OnInit {
  @ViewChild(DatatableComponent, { static: true }) table: DatatableComponent;

  public slaes: Sale[];

  basicRows = [];
  basicSort = [];
  ColumnMode = ColumnMode;

  isLoading: boolean;

  salePagination: SalePagination;
  searchInputControl: UntypedFormControl = new UntypedFormControl();
  private _unsubscribeAll: Subject<any> = new Subject<any>();


  constructor(
    private _Service: SaleService,
    private _changeDetectorRef: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this._Service.salePagination$
      .pipe(takeUntil(this._unsubscribeAll)).subscribe(pagination => {
        this.salePagination = pagination;

        this._changeDetectorRef.markForCheck();

      });

    this._Service.sales$
      .pipe(takeUntil(this._unsubscribeAll)).subscribe(users => {
        this.basicRows = users;

        this.basicRows = [...this.basicRows];

        this.isLoading = false;
      })

    // this.searchInputControl.valueChanges
    //   .pipe(
    //     takeUntil(this._unsubscribeAll),
    //     debounceTime(300),
    //     switchMap((query) => {
    //       this.isLoading = true;
    //       console.log('ค้นหา', query);
    //       localStorage.setItem("query", query);
    //       return this._Service.getEmployee(query, 1, 10);
    //     }),
    //     map(() => {
    //       this.isLoading = false;
    //     })
    //   )
    //   .subscribe();
  }

  setPage(pageInfo) {
    this.salePagination.page = pageInfo.offset + 1;
    this._Service.getSale(this.searchInputControl.value || "", this.salePagination.page, this.salePagination.size).subscribe();
  }

  sorting(event) {
    if (event.sorts && event.sorts.length) {
      this.isLoading = true;

      this.salePagination.page = 1;
      this._Service.getSale(this.searchInputControl.value || "", this.salePagination.page, this.salePagination.size, event.sorts[0].prop, event.sorts[0].dir).subscribe(() => {
        this.isLoading = false;
      });
    }
  }
}
