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
import { Branch, Province } from '../../basic-data/basic.model';
import { CustomerPagination } from '@app/_service/pagination.types';
import { FormBuilder, FormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { SaleService } from '@app/_service/sale.service';

@Component({
  selector: 'app-zim-customer',
  templateUrl: './zim-customer.component.html',
  styleUrls: ['./zim-customer.component.scss']
})
export class ZimCustomerComponent implements OnInit, OnDestroy {
  @ViewChild(DatatableComponent, { static: true }) table: DatatableComponent;

  confrimDelete: FormGroup;

  public customers: Customer[];
  province: Province[] = [];
  branchs: Branch[] = [];

  rows = [];
  count: any;
  ColumnMode = ColumnMode;

  isLoading: boolean;
  submitted: boolean;

  Items: any;
  password: any;
  passwordMain: any;
  positionMain: any;

  ModalList: BsModalRef;

  customerPagination: CustomerPagination;
  searchInputControl: UntypedFormControl = new UntypedFormControl();

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(private _changeDetectorRef: ChangeDetectorRef,
    private modalService: BsModalService,
    private _formBuilder: FormBuilder,
    private _serivceCus: CustomerService,
    private _serviceBase: BasicService
  ) { }

  ngOnInit(): void {

    this.confrimDelete = this._formBuilder.group({
      password: ['', Validators.required]
    })

    this._serivceCus.customersPagination$
      .pipe(takeUntil(this._unsubscribeAll)).subscribe(pagination => {
        this.customerPagination = pagination;

        this._changeDetectorRef.markForCheck();

      });

    this._serivceCus.customers$
      .pipe(takeUntil(this._unsubscribeAll)).subscribe(users => {

        this.rows = users;

        this.count = this.rows.length;

        this.rows = [...this.rows];

        this.isLoading = false;
      })

    this._serviceBase.branchs$
      .pipe(takeUntil(this._unsubscribeAll)).subscribe(branchs => {
        this.branchs = branchs;
      })

    this.positionMain = localStorage.getItem('Position')


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

  getNameBranch(id: number) {
    let index = this.branchs.findIndex(item => item.branchId === id);
    if (index === -1) {
      return "-";
    }
    else {
      return this.branchs[index].branchCode;
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

  deleteConfrim() {

    if (this.confrimDelete.invalid) {
      return;
    }

    this.submitted = true;
    this.isLoading = true;

    this.password = this.confrimDelete.value.password
    this.passwordMain = localStorage.getItem('Password')

    if (this.password !== this.passwordMain) {
      Swal.fire({
        title: 'รหัสผ่านไม่ถูกต้อง',
        text: "กรุณาระบุรหัสผ่านใหม่อีกครั้ง",
        icon: 'error',
        timer: 1500
      })
    } else {
      Swal.fire({
        title: 'คุณแน่ใจหรือว่าต้องการลบ?',
        text:
          'คุณสามารถกู้ข้อมูลผู้ใช้งานได้!',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'ยืนยัน',
        cancelButtonText: 'ยกเลิก',
      }).then((result) => {
        if (result.isConfirmed) {

          this._serivceCus.deleteCustomer(this.Items.cusId).pipe(take(1))
            .subscribe(() => {
              Swal.fire({
                icon: 'success',
                title: 'ลบข้อมูลสำเร็จ',
                showConfirmButton: false,
                timer: 2000,
              });
              this.ModalList.hide();
              this._changeDetectorRef.markForCheck();
            })

        }
      });
    }
  }

  openModalConfrimDelete(confrimdelete: TemplateRef<any>, data = null) {
    this.Items = data;
    this.ModalList = this.modalService.show(
      confrimdelete,
      Object.assign({})
      // Object.assign({}, { class: 'gray modal-lg' })
    );
  }
}

