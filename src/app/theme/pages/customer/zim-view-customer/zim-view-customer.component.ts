import { ChangeDetectorRef, Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ActivatedRoute, Router } from '@angular/router';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subject, catchError, map, take, takeUntil, throwError } from 'rxjs';
import { BasicService } from '@app/theme/pages/basic-data/basic.service';
import { SaleService } from '@app/_service/sale.service';
import Swal from 'sweetalert2';
import { CustomerService } from '@app/theme/pages/customer/customer.service';
import { Course } from '../../basic-data/basic.model';
import { Employee, Sale } from '@app/_service/main.types';
import { EmployeeService } from '../../employee/employee.service';
import { SalePagination } from '@app/_service/pagination.types';
@Component({
  selector: 'app-zim-view-customer',
  templateUrl: './zim-view-customer.component.html',
  styleUrls: ['./zim-view-customer.component.scss']
})
export class ZimViewCustomerComponent implements OnInit {

  saleForm: FormGroup;
  saleEmployeeForm: FormGroup;
  ColumnMode = ColumnMode;
  rows = [];

  ModalList: BsModalRef;

  toppingList = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];


  cus_id = null

  isLoading: boolean;
  submitted: boolean;
  lastUpdate: Date = null;

  sales$: Observable<Sale[]>;
  sale = [];
  salePagination: SalePagination;

  employes$: Observable<Employee[]>
  employ: any
  employees: Employee[]

  selectedSaleEmp: number[] = []; // Assuming categoryFarmId is a number


  coures$: Observable<Course[]>;
  Courses: Course[] = [];


  emp_detail = [];

  sales: any;

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _formBuilder: FormBuilder,
    private modalService: BsModalService,
    private _ServiceSale: SaleService,
    private _SerivceEmp: EmployeeService,
    private _SerivceBasic: BasicService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _changeDetectorRef: ChangeDetectorRef
  ) {
    this._activatedRoute.paramMap.subscribe(params => {
      this.cus_id = params.get('id')
    })
  }

  ngOnInit(): void {

    this.saleForm = this._formBuilder.group({
      saleId: [this.cus_id],
      saleNumber: [{ value: '', enabled: !!this.cus_id }, Validators.required],
      saleProduct: [{ value: '', enabled: !!this.cus_id }, Validators.required],
      saleCount: [{ value: '', enabled: !!this.cus_id }, Validators.required],
      salePayBalance: [{ value: '', enabled: !!this.cus_id }, Validators.required],
      salePay: [{ value: '', enabled: !!this.cus_id }, Validators.required],
      saleOverdue: [{ value: '', enabled: !!this.cus_id }, Validators.required],
      cusId: [this.cus_id],
    });

    this.saleEmployeeForm = this._formBuilder.group({
      empId: [{ value: '', enabled: !!this.cus_id }, Validators.required]
    })

    this.sales$ = this._ServiceSale.sales$;

    this.employes$ = this._SerivceEmp.employees$;
    this._SerivceEmp.employees$.pipe(takeUntil(this._unsubscribeAll)).subscribe(employees => {
      this.employees = employees;
    })

    this.coures$ = this._SerivceBasic.courses$;
    this._SerivceBasic.courses$.pipe(takeUntil(this._unsubscribeAll)).subscribe(courses => {
      this.Courses = courses;
    })

    this._ServiceSale.salePagination$
      .pipe(takeUntil(this._unsubscribeAll)).subscribe(pagination => {
        this.salePagination = pagination;

        this._changeDetectorRef.markForCheck();

      });

    this._ServiceSale.sales$.pipe(takeUntil(this._unsubscribeAll)).subscribe(warehouses => {

      if (warehouses) {
        // =============
        const mostRecentDate = warehouses.reduce((previous, current) => {

          if (!previous) {
            return current;
          }

          const previousDate = new Date(previous.createdTime);
          const currentDate = new Date(current.createdTime);

          if (previousDate > currentDate) {
            return previous;
          } else {
            return current;
          }
        }, undefined);

        if (mostRecentDate)
          this.lastUpdate = new Date(mostRecentDate.createdTime);
        // =============

        console.log(warehouses);
        this.rows = warehouses;

        this.rows = [...this.rows];
      }
      else {
        this.rows = [];
      }

      this.isLoading = false;
    })
  }

  openModal(template: TemplateRef<any>, data = null) {

    this.sale = data
    console.log(this.sale);


    this.saleForm.reset();
    this.saleForm.patchValue({ cusId: this.cus_id })
    this.saleForm.markAsPristine();

    if (data) {
      this.saleForm.patchValue(data);
    }

    this.ModalList = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-lg' })
    );
  }

  get f() { return this.saleForm.controls; }

  save() {
    console.log('คลังข้อมูล', this.saleForm.value);
    console.log('หมวดหมู่', this.saleEmployeeForm.value);

    // Return if the form is invalid
    if (this.saleForm.invalid) {
      return;
    }

    this.submitted = true;
    this.isLoading = true;

    let saveData: Sale = this.saleForm.getRawValue();


    if (saveData) {
      const overviewData = this.saleForm.getRawValue();
      const platformData = this.saleEmployeeForm.getRawValue();

      if (overviewData.saleId) {
        // no need to update anymore
        this._ServiceSale.updateAll(
          overviewData.saleId,
          overviewData.saleNumber,
          overviewData.saleProduct,
          overviewData.saleCount,
          overviewData.salePayBalance,
          overviewData.salePay,
          overviewData.saleOverdue,
          overviewData.cusId,
          platformData.empId)
          .pipe(
            catchError((err) => {
              console.log(err);

              Swal.fire({
                icon: 'error',
                title: 'ชื่อผู้ใช้งานนี้มีอยู่ในระบบแล้ว',
                showConfirmButton: false,
                timer: 2000,
              });
              return throwError(err);
            })
          )
          .subscribe((res) => {
            this.ModalList.hide();
            if (res) {
              Swal.fire({
                icon: 'success',
                title: 'แก้ไขข้อมูลสำเร็จ',
                showConfirmButton: false,
                timer: 2000,
              });
            }
          },
            () => {
              Swal.fire({
                icon: 'error',
                title: 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้',
                showConfirmButton: false,
                timer: 2000,
              });
            });
      }
      else {
        this._ServiceSale.saveAll(
          overviewData.saleNumber,
          overviewData.saleProduct,
          overviewData.saleCount,
          overviewData.salePayBalance,
          overviewData.salePay,
          overviewData.saleOverdue,
          overviewData.cusId,
          platformData.empId)
          .pipe(
            catchError((err) => {
              Swal.fire({
                icon: 'error',
                title: 'เพิ่มข้อมูลไม่สำเร็จ',
                showConfirmButton: false,
                timer: 2000,
              });
              return throwError(err);
            })
          )
          .subscribe((v) => {
            this.ModalList.hide();
            console.log('กรอกเรียบร้อย', v);
            Swal.fire({
              icon: 'success',
              title: 'เพิ่มข้อมูลสำเร็จแล้ว',
              showConfirmButton: false,
              timer: 2000,
            }).then((result) => {
              console.log('ข้อมูล', result);
              this._router.navigate(['./'], {
                queryParams: {
                  search: v.warehouseName
                }
              });
            });
          }
          );
      }
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

  getCategoryName(categories) {
    if (!categories) {
      return "-";
    }

    return categories.map(category => {
      console.log(category);
      let index = this.employees.findIndex(type => type.empId === category.empId);
      return index === -1 ? ' ' : this.employees[index].empFullname
    }).join(',');
  }

}
