import { ChangeDetectorRef, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';

import { TokenStorageService } from '../../../../_service/token-storage.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CustomerService } from '@app/theme/pages/customer/customer.service';
import { Observable, Subject, debounceTime, map, switchMap, take, takeUntil, tap } from 'rxjs';
import { Customer } from '@app/_service/user.types';
import Swal from 'sweetalert2';
import { BasicService } from '@app/theme/pages/basic-data/basic.service';
import { Province } from '../../basic-data/basic.model';
import { CustomerPagination } from '@app/_service/pagination.types';
import { UntypedFormControl } from '@angular/forms';

@Component({
  selector: 'app-zim-customer',
  templateUrl: './zim-customer.component.html',
  styleUrls: ['./zim-customer.component.scss']
})
export class ZimCustomerComponent implements OnInit, OnDestroy {
  @ViewChild(DatatableComponent, { static: true }) table: DatatableComponent;

  public customers: Customer[];
  province: Province[] = [];

  basicRows = [];
  basicSort = [];
  ColumnMode = ColumnMode;
  key: any;
  count: any;
  lastupdate: any = '';

  isLoading: boolean;

  customerPagination: CustomerPagination;
  searchInputControl: UntypedFormControl = new UntypedFormControl();

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(private _changeDetectorRef: ChangeDetectorRef,
    private modalService: BsModalService,
    private _serivceCus: CustomerService,
    private _ServiceBasic: BasicService
  ) {

  }

  ngOnInit(): void {
    this._serivceCus.customersPagination$
      .pipe(takeUntil(this._unsubscribeAll)).subscribe(pagination => {
        this.customerPagination = pagination;

        this._changeDetectorRef.markForCheck();

      });

    this._serivceCus.customers$
      .pipe(takeUntil(this._unsubscribeAll)).subscribe(users => {
        this.basicRows = users;

        this.basicRows = [...this.basicRows];

        this.isLoading = false;
      })

    this.searchInputControl.valueChanges
      .pipe(
        takeUntil(this._unsubscribeAll),
        debounceTime(300),
        switchMap((query) => {
          this.isLoading = true;
          console.log('ค้นหา', query);
          localStorage.setItem("query", query);
          return this._serivceCus.getCustomer(query, 1, 10);
        }),
        map(() => {
          this.isLoading = false;
        })
      )
      .subscribe();

  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  delete(row) {
    Swal.fire({
      title: 'คุณแน่ใจหรือว่าต้องการลบ?',
      text:
        'คุณจะไม่สามารถกู้พนักงาน ' + row.cusFullName + ' ได้!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก',
    }).then((result) => {
      if (result.isConfirmed) {
        this._serivceCus.deleteCustomer(row.cusId).pipe(take(1))
          .subscribe(() => {
            Swal.fire({
              icon: 'success',
              title: 'ลบข้อมูลสำเร็จ',
              showConfirmButton: false,
              timer: 2000,
            });

            this._changeDetectorRef.markForCheck();
          })
      }
    });
  }

  serviceListFilter(event) {
    const val = event.target.value.toLowerCase();
    this.key = event.target.value.toLowerCase();
    const temp = this.basicSort.filter(function (d) {
      return (
        d.cusMember.toLowerCase().indexOf(val) !== -1 ||
        d.cusMember.toLowerCase().indexOf(val) !== -1 ||
        d.cusFullName.toLowerCase().indexOf(val) !== -1 ||
        d.cusFullName.toLowerCase().indexOf(val) !== -1 ||
        !val
      );
    });
    this.basicRows = temp;
    this.table.offset = 0;
  }

  highLight(temp) {
    if (!this.key) {
      return temp;
    }
    if (temp != null) {
      return temp.replace(new RegExp(this.key, 'gi'), (match) => {
        return '<span class="highlightText">' + match + '</span>';
      });
    }
  }


  setPage(pageInfo) {
    this.customerPagination.page = pageInfo.offset + 1;
    this._serivceCus.getCustomer(this.searchInputControl.value || "", this.customerPagination.page, this.customerPagination.size).subscribe();
  }

  sorting(event) {
    if (event.sorts && event.sorts.length) {
      this.isLoading = true;

      this.customerPagination.page = 1;
      this._serivceCus.getCustomer(this.searchInputControl.value || "", this.customerPagination.page, this.customerPagination.size, event.sorts[0].prop, event.sorts[0].dir).subscribe(() => {
        this.isLoading = false;
      });
    }
  }
}
