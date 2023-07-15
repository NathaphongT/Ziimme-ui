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

  cus_id = null

  isLoading: boolean;
  submitted: boolean;
  lastUpdate: Date = null;

  sale$: Observable<any>

  salePagination: SalePagination;

  employees$: Observable<Employee[]>;

  employee: Employee[] = [];
  employ: any


  selectedCategories: number[] = []; // Assuming categoryFarmId is a number

  coures$: Observable<Course[]>;
  courses: Course[] = [];


  emp_detail = [];

  sales: any;

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
      saleProduct: [{ value: '', enabled: !!this.cus_id }, Validators.required],
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
      console.log(data.saleId);
      this._serviceSale.getWareHouseById(data.saleId).pipe(
        takeUntil(this._unsubscribeAll)
      ).subscribe(warehouse => {
        console.log('ข้อมูลลูกค้า', warehouse);

        if (typeof warehouse === 'object') {
          this.saleForm.patchValue(warehouse);
          if (warehouse.empId) {
            const empIds = warehouse.empId.map(c => {
              return c.empId
            });
            console.log(empIds);
            this.saleEmployeeForm.patchValue({
              empId: empIds
            });
          }
        } else {
          // Handle the case when `warehouse` is a boolean value
          // For example, you can set some default form values or display an error message.
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
        console.log();

        // no need to update anymore
        this._serviceSale.updateAll(
          overviewData.saleId,
          overviewData.saleNumber,
          overviewData.saleProduct,
          overviewData.saleCount,
          overviewData.salePayBalance,
          overviewData.salePay,
          overviewData.saleOverdue,
          overviewData.cusId,
          platformData.empId,
        )
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
        this._serviceSale.saveAll(
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
              window.location.reload();
            });
          }
          );
      }
    }
  }


  getNameProduct(id: number) {
    let index = this.courses.findIndex(type => type.courseId === id);
    if (index === -1) {
      return "-";
    }
    else {
      return this.courses[index].courseNameEng;
    }
  }

  onCategorySelectionChange(checked: boolean, categoryId: number): void {
    if (checked) {
      this.selectedCategories.push(categoryId);
    } else {
      const index = this.selectedCategories.indexOf(categoryId);
      if (index !== -1) {
        this.selectedCategories.splice(index, 1);
      }
    }
  }

  // You might also need a function to pre-select certain categories when the component loads
  selectCategories(empIds: number[]): void {
    this.selectedCategories = empIds;
  }

}
