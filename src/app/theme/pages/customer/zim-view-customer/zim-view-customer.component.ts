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
  saleProductForm: FormGroup;
  ColumnMode = ColumnMode;
  rows = [];

  ModalList: BsModalRef;

  cus_id = null

  isLoading: boolean;
  submitted: boolean;
  lastUpdate: Date = null;

  sale$: Observable<any>

  salePagination: SalePagination;

  employees$: Observable<Employee[]>;

  employee: Employee[] = [];
  employ: any


  selectedEmployee: number[] = []; // Assuming selectedEmployeeId is a number
  selectedCourse: number[] = []; // Assuming selectedCourseId is a number

  coures$: Observable<Course[]>;
  courses: Course[] = [];


  emp_detail = [];

  sales: any;
  products: any;

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _formBuilder: FormBuilder,
    private modalService: BsModalService,
    private _serviceSale: SaleService,
    private _SerivceEmp: EmployeeService,
    private _serivceCustomer: CustomerService,
    private _SerivceBasic: BasicService,
    private _activatedRoute: ActivatedRoute,
  ) {
    this._activatedRoute.paramMap.subscribe(params => {
      this.cus_id = params.get('id')
    })
  }

  ngOnInit(): void {

    this.saleForm = this._formBuilder.group({
      saleId: [this.cus_id],
      saleNumber: [{ value: '', enabled: !!this.cus_id }, Validators.required],
      saleCount: [{ value: '', enabled: !!this.cus_id }, Validators.required],
      salePayBalance: [{ value: '', enabled: !!this.cus_id }, Validators.required],
      salePay: [{ value: '', enabled: !!this.cus_id }, Validators.required],
      saleOverdue: [{ value: '', enabled: !!this.cus_id }, Validators.required],
      cusId: [this.cus_id],
    });

    this.saleEmployeeForm = this._formBuilder.group({
      empId: [{ value: [], enabled: !!this.cus_id }, Validators.required],
      cusId: [this.cus_id],
    })

    this.saleProductForm = this._formBuilder.group({
      courseId: [{ value: [], enabled: !!this.cus_id }, Validators.required],
      cusId: [this.cus_id],
    })

    this.sale$ = this._serviceSale.sale$;
    this.employees$ = this._SerivceEmp.employees$;

    this.coures$ = this._SerivceBasic.courses$;
    this._SerivceBasic.courses$.pipe(takeUntil(this._unsubscribeAll)).subscribe(courses => {
      this.courses = courses;
    })

    this._serivceCustomer.salelists$.pipe(takeUntil(this._unsubscribeAll)).subscribe(sales => {

      this.rows = sales;

      this.rows = [...this.rows];

      this.isLoading = false;
    })
  }

  openModal(template: TemplateRef<any>, data = null) {

    this.saleForm.reset();
    this.saleForm.patchValue({ cusId: this.cus_id })
    this.saleForm.markAsPristine();

    if (data) {
      //Get ข้อมูลพนักงาน
      this._serviceSale.getSaleById(data.saleId).pipe(takeUntil(this._unsubscribeAll))
        .subscribe(warehouse => {
          if (typeof warehouse === 'object') {
            this.saleForm.patchValue(warehouse);
            if (warehouse.empId) {
              const empIds = warehouse.empId.map(c => {
                return c.empId
              });

              this.saleEmployeeForm.patchValue({
                empId: empIds
              });

              const courseIds = warehouse.empId.map(c => {
                return c.empId
              });

              this.saleProductForm.patchValue({
                empId: courseIds
              });
            }
          }
        });
      //Get ข้อมูลสินค้าและบริการ
      this._serviceSale.getSaleByIdPo(data.saleId).pipe(takeUntil(this._unsubscribeAll))
        .subscribe(warehouse => {
          console.log('ข้อมูลลูกค้าสินค้า', warehouse);
          if (typeof warehouse === 'object') {
            this.saleForm.patchValue(warehouse);
            if (warehouse.courseId) {
              const courseIds = warehouse.courseId.map(c => {
                return c.courseId
              });

              this.saleProductForm.patchValue({
                courseId: courseIds
              });
            }
          }
        });
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
    console.log('สินค้า', this.saleProductForm.value);

    // Return if the form is invalid
    if (this.saleForm.invalid) {
      return;
    }

    this.submitted = true;
    this.isLoading = true;

    let saveData: Sale = this.saleForm.getRawValue();


    if (saveData) {
      const saleViewData = this.saleForm.getRawValue();
      const saleEmployeeData = this.saleEmployeeForm.getRawValue();
      const saleProductData = this.saleProductForm.getRawValue();

      if (saleViewData.saleId) {
        console.log();

        // // no need to update anymore
        this._serviceSale.updateAll(
          saleViewData.saleId,
          saleViewData.saleNumber,
          saleViewData.saleCount,
          saleViewData.salePayBalance,
          saleViewData.salePay,
          saleViewData.saleOverdue,
          saleViewData.cusId,
          saleEmployeeData.empId,
          saleProductData.courseId,)
          .pipe(
            catchError((err) => {
              Swal.fire({
                icon: 'error',
                title: 'แก้ไขข้อมูลไม่สำเร็จ',
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
              title: 'แก้ไขข้อมูลสำเร็จแล้ว',
              showConfirmButton: false,
              timer: 2000,
            }).then((result) => {
              console.log('ข้อมูล', result);
              window.location.reload();
            });
          }
          );
      }
      else {
        this._serviceSale.saveAll(
          saleViewData.saleNumber,
          saleViewData.saleCount,
          saleViewData.salePayBalance,
          saleViewData.salePay,
          saleViewData.saleOverdue,
          saleViewData.cusId,
          saleEmployeeData.empId,
          saleProductData.courseId,)
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
              window.location.reload();
            });
          }
          );
      }
    }
  }

  onEmployeeSelectionChange(checked: boolean, categoryId: number): void {
    if (checked) {
      this.selectedEmployee.push(categoryId);
    } else {
      const index = this.selectedEmployee.indexOf(categoryId);
      if (index !== -1) {
        this.selectedEmployee.splice(index, 1);
      }
    }
  }
  selectEmployee(empIds: number[]): void {
    this.selectedEmployee = empIds;
  }

  onCourseSelectionChange(checked: boolean, categoryId: number): void {
    if (checked) {
      this.selectedCourse.push(categoryId);
    } else {
      const index = this.selectedCourse.indexOf(categoryId);
      if (index !== -1) {
        this.selectedCourse.splice(index, 1);
      }
    }
  }
  selectCourse(courseIds: number[]): void {
    this.selectedCourse = courseIds;
  }

}
