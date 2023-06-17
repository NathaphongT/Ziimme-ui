import { ChangeDetectorRef, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';

import { TokenStorageService } from '../../../../_service/token-storage.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CustomerService } from '@app/theme/pages/customer/customer.service';
import { Observable, Subject, map, take, takeUntil, tap } from 'rxjs';
import { Customer } from '@app/_service/user.types';
import Swal from 'sweetalert2';
import { BasicService } from '@app/theme/pages/basic-data/basic.service';
import { Province } from '../../basic-data/basic.model';

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

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(private _changeDetectorRef: ChangeDetectorRef,
    private modalService: BsModalService,
    private _SerivceCus: CustomerService,
    private _ServiceBasic: BasicService
  ) {

  }

  ngOnInit(): void {
    this.LoadCustomerALL();
    this._SerivceCus.customers$.pipe(takeUntil(this._unsubscribeAll)).subscribe(customers => {

      if (customers) {
        this.basicRows = customers;
        
        this.basicRows = [...this.basicRows];
      }
      else {
        this.basicRows = [];
      }

      this.isLoading = false;
    })

  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  delete(row) {
    Swal.fire({
      title: 'คุณแน่ใจหรือว่าต้องการลบ?',
      text:
        'คุณจะไม่สามารถกู้พนักงาน ' + row.cus_full_name + ' ได้!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก',
    }).then((result) => {
      if (result.isConfirmed) {
        this._SerivceCus.deleteCustomer(row.cus_id).pipe(take(1))
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
        d.cus_member.toLowerCase().indexOf(val) !== -1 ||
        d.cus_member.toLowerCase().indexOf(val) !== -1 ||
        d.cus_full_name.toLowerCase().indexOf(val) !== -1 ||
        d.cus_full_name.toLowerCase().indexOf(val) !== -1 ||
        !val
      );
    });
    this.basicRows = temp;
    this.table.offset = 0;
  }

  LoadCustomerALL() {
    this._SerivceCus.getAllCustomer().subscribe((res) => {
      // console.log('category', res);
      let data = res;
      this.basicSort = data.length ? [...data] : [];
      this.basicRows = data.length ? data : [];
      this.count = data.length;
      if (typeof data !== 'undefined' && data.length > 0) {
        this.lastupdate = new Date(
          Math.max.apply(
            null,
            data.map(function (e) {
              return e.createdTime ? new Date(e.createdTime) : new Date();
            })
          )
        );
      } else {
        this.lastupdate = '-';
      }
    });
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
}
