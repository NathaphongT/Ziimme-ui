import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ActivatedRoute, Router } from '@angular/router';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subject, catchError, map, take, takeUntil, throwError } from 'rxjs';
import { BasicService } from '@app/theme/pages/basic-data/basic.service';
import { SaleService } from '@app/_service/sale.service';
import Swal from 'sweetalert2';
import { CustomerService } from '@app/theme/pages/customer/customer.service';
import { Branch, Course, SaleCut, SalePay } from '../../basic-data/basic.model';
import { Employee, Sale } from '@app/_service/main.types';
import { EmployeeService } from '../../employee/employee.service';
import { SalePagination } from '@app/_service/pagination.types';
@Component({
  selector: 'app-zim-view-customer',
  templateUrl: './zim-view-customer.component.html',
  styleUrls: ['./zim-view-customer.component.scss']
})
export class ZimViewCustomerComponent implements OnInit {
  @ViewChild('myTable') table: any;

  saleForm: FormGroup;
  saleEmployeeForm: FormGroup;
  saleProductForm: FormGroup;
  confrimDelete: FormGroup;

  saleCutForm: FormGroup;
  salePayForm: FormGroup;

  dataPayForm: any;

  ColumnMode = ColumnMode;
  rows = [];
  rowsCutCourse = [];
  rowsSalepay = [];
  groups = [];

  Items: any;
  password: any;
  passwordMain: any;
  positionMain: any;

  ModalList: BsModalRef;

  pros: any;


  cus_id = null
  pro_id = null

  isLoading: boolean;
  submitted: boolean;
  lastUpdate: Date = null;

  sale$: Observable<any>

  salePagination: SalePagination;

  employees$: Observable<Employee[]>;

  Employee: Employee[] = [];
  courses: Course[] = [];
  branchs: Branch[] = [];

  employ: any;


  selectedEmployee: number[] = []; // Assuming selectedEmployeeId is a number
  selectedCourse: number[] = []; // Assuming selectedCourseId is a number

  coures$: Observable<Course[]>;


  emp_detail = [];

  sales: any;
  Products = '';
  Counts = '';

  isDisabled: boolean[] = [];

  textValues: string[] = []; // Array to store input values
  textValues2: string[] = []; // Array to store input values
  newUrl: string = '';

  urlData: any = [];

  cutOderBy = [];
  cutOderByID: any
  cutOderByAlways: any = "";

  salePayOderBy = [];
  salePayOderByID: any
  salePayment: any;
  salePayOverdue: any;
  salePayBalacne: any = "";
  salePayOderByOver: any = "";
  salePayOderByEx: any = "";

  salePayShow = [];
  salePayShowDataOver: any = "";
  salePayShowDataEx: any = "";

  cusData: any = "";
  cusDataArray: any = "";
  cusName: any = "";
  cusNumber: any = "";


  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _formBuilder: FormBuilder,
    private modalService: BsModalService,
    private _serviceSale: SaleService,
    private _SerivceEmp: EmployeeService,
    private _serivceCustomer: CustomerService,
    private _SerivceBasic: BasicService,
    private _activatedRoute: ActivatedRoute,
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
      saleBalance: [{ value: '', enabled: !!this.cus_id }, Validators.required],
      salePayment: [{ value: '', enabled: !!this.cus_id }, Validators.required],
      saleOverdue: [{ value: '', enabled: !!this.cus_id }, Validators.required],
      cusId: [this.cus_id],
    });

    this.saleEmployeeForm = this._formBuilder.group({
      empId: [{ value: [], enabled: !!this.cus_id }, Validators.required],
    })

    this.saleProductForm = this._formBuilder.group({
      selectedData: [null]
    })

    this.confrimDelete = this._formBuilder.group({
      password: ['', Validators.required]
    })

    this.saleCutForm = this._formBuilder.group({
      saleCutId: [null],
      saleCutCourse: [{ value: '', disabled: true }],
      saleCutCount: [{ value: '' }],
      saleCount: [''],
      saleCutVitamin: ['', Validators.required],
      saleCutMark: ['', Validators.required],
      saleCutTherapist: ['', Validators.required],
      saleCutDoctor: ['', Validators.required],
      saleCutDetail: [''],
      saleCutDate: ['', Validators.required],
      saleId: [''],
      saleProductId: [''],
      courseId: ['', Validators.required],
    })

    this.salePayForm = this._formBuilder.group({
      salePayId: [null],
      saleExtraPay: ['', Validators.required],
      salePayDate: ['', Validators.required],
      saleId: ['', Validators.required],
      saleProductId: ['', Validators.required],
      courseId: ['', Validators.required],
      cusId: ['', Validators.required],
      salePayCourse: [{ value: '', disabled: true }],
      salePayBalance: [{ value: '', disabled: true }],
      saleLastPaymet: [{ value: '', disabled: true }],
      salePayOver: [{ value: '', disabled: true }],
    })

    this.positionMain = localStorage.getItem('Position')

    this.sale$ = this._serviceSale.sale$;

    this.employees$ = this._SerivceEmp.employees$;
    this._SerivceEmp.employees$.pipe(takeUntil(this._unsubscribeAll)).subscribe(emps => {
      this.Employee = emps;
    })

    this.coures$ = this._SerivceBasic.courses$;
    this._SerivceBasic.courses$.pipe(takeUntil(this._unsubscribeAll)).subscribe(courses => {
      this.courses = courses;
    })

    this._SerivceBasic.branchs$
      .pipe(takeUntil(this._unsubscribeAll)).subscribe(branchs => {
        this.branchs = branchs;
      })

    this._serivceCustomer.salelists$.pipe(takeUntil(this._unsubscribeAll)).subscribe(sales => {

      this.rows = sales;

      console.log(this.rows);

      this.rows = [...this.rows];

      this.isLoading = false;
    })

    this._serivceCustomer.getByIdCustomer(this.cus_id).subscribe((res) => {
      this.cusData = res;
      this.cusDataArray = [this.cusData]

      console.log([this.cusDataArray]);

    })
  }

  addURL(data: any, data2: any): void {

    this.urlData.push(
      {
        courseId: data,
        saleCount: data2
      }
    );
    this.Counts = '';
    this.Products = '';
    this.isDisabled.push(true);
    this.textValues.push('');
    this.textValues2.push('');
  }

  getSocialData() {
    const socialData: any[] = [];

    if (this.urlData.length > 0) {
      this.urlData.forEach((item, index) => {
        socialData.push({
          "courseId": item.courseId,
          "saleCount": item.saleCount,
        })
      });
    }
    else {
      const id = this.saleProductForm.getRawValue().selectedData;
      let data: any;

      if (data) {
        socialData.push({
          "courseId": data.courseId,
          "saleCount": data.saleCount,
        })
      }

    }
    return socialData;
  }

  editUrl(index: number): void {
    this.isDisabled[index] = !this.isDisabled[index];
  }

  removeURL(index: number): void {
    this.urlData.splice(index, 1);
    this.isDisabled.splice(index, 1);
    this.textValues.splice(index, 1);
    this.textValues2.splice(index, 1);
  }

  openModal(template: TemplateRef<any>, data = null) {

    this.saleForm.reset();
    this.saleEmployeeForm.reset();
    this.pros = '';
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
            }
          }
        });

      this._serviceSale.getSaleByIdPo(data.saleId).pipe(takeUntil(this._unsubscribeAll))
        .subscribe(product => {
          if (typeof product === 'object') {
            if (product.courseId) {
              this.pros = product.courseId
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

  saveSale() {

    // Return if the form is invalid
    if (this.saleForm.invalid) {
      return;
    }

    console.log("ข้อมูลขาย", this.saleForm.value);


    this.submitted = true;
    this.isLoading = true;

    const saleViewData = this.saleForm.getRawValue();
    const saleEmployeeData = this.saleEmployeeForm.getRawValue();
    const saleProductData = this.getSocialData();

    this._serviceSale.saveAll(
      saleViewData.saleNumber,
      saleViewData.saleBalance,
      saleViewData.salePayment,
      saleViewData.saleOverdue,
      saleViewData.cusId,
      saleEmployeeData.empId,
      saleProductData,)
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
        Swal.fire({
          icon: 'success',
          title: 'เพิ่มข้อมูลสำเร็จแล้ว',
          showConfirmButton: false,
          timer: 2000,
        }).then((result) => {
          location.reload();
        });
      }
      );

  }



  selectCourse(courseIds: number[]): void {
    this.selectedCourse = courseIds;
  }

  openModalCutCourse(cutcourse: TemplateRef<any>, data = null) {

    this.saleCutForm.reset();

    this.saleCutForm.patchValue({ saleId: data.saleId })
    this.saleCutForm.patchValue({ saleProductId: data.saleProductId })
    this.saleCutForm.patchValue({ courseId: data.courseId })
    this.saleCutForm.patchValue({ saleCutCourse: data.courseNameTh })
    this.saleCutForm.patchValue({ saleCount: data.saleCount })
    console.log('ข้อมูลจากตาราง', data);

    this._serviceSale.getSaleBYIDSaleCut(data.saleProductId).subscribe((res) => {
      this.cutOderBy = res
      this.cutOderByID = Object.assign({}, res);
      this.cutOderByAlways = this.cutOderByID[0]?.saleCutCount

      if (this.cutOderBy.length <= 0) {
        this.saleCutForm.patchValue({ saleCutCount: 1 })
      } else {
        this.saleCutForm.patchValue({ saleCutCount: this.cutOderByAlways + 1 })
      }
    })

    this.ModalList = this.modalService.show(
      cutcourse,
      Object.assign({}, { class: 'gray modal-lg' })
    );
  }

  saveSaleCut() {

    //Return if the form is invalid
    if (this.saleCutForm.invalid) {
      return;
    }

    this.submitted = true;
    this.isLoading = true;

    let saveData: SaleCut = this.saleCutForm.getRawValue();

    console.log(saveData);

    this._serviceSale.createSaleCut(saveData).subscribe((res) => {
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success',
          cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
      })
      if (res) {
        swalWithBootstrapButtons.fire({
          title: 'บันทึกการตัดคอร์สเสร็จสิ้น',
          text: "กรุณากดปุ่ม ตกลง เพื่อดำเนินการต่อ",
          icon: 'success',
          confirmButtonText: 'ตกลง',
          reverseButtons: true
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.reload();
          }
        })

      }
    });
  }

  openModalHistoryCutCourse(historycutcourse: TemplateRef<any>, data = null) {

    this._serviceSale.getSaleBYIDSaleCut(data.saleProductId).subscribe((res) => {

      this.rowsCutCourse = res;
      console.log(this.rowsCutCourse);
      this.rowsCutCourse = [...this.rowsCutCourse];

      this.isLoading = false;
    })

    this.ModalList = this.modalService.show(
      historycutcourse,
      Object.assign({}, { class: 'gray modal-lg' })
    );
  }

  openModalPayment(payment: TemplateRef<any>, data = null) {

    this.dataPayForm = [data];

    this.salePayForm.reset();

    this.salePayForm.patchValue({ saleId: data.saleId })
    this.salePayForm.patchValue({ salePayCourse: data.saleNumber })
    this.salePayForm.patchValue({ cusId: data.cusId })
    this.salePayForm.patchValue({ saleProductId: data.saleProductId })
    this.salePayForm.patchValue({ courseId: data.courseId })


    this._serviceSale.getSaleBYIDSalePay(data.saleProductId).subscribe((res) => {
      this.salePayOderBy = res
      this.salePayOderByID = Object.assign({}, res);
      console.log('res', this.salePayOderBy);
      this.salePayBalacne = this.salePayOderByID[0]?.salePayBalance
      this.salePayOderByOver = this.salePayOderByID[0]?.salePayOver
      this.salePayOderByEx = this.salePayOderByID[0]?.saleExtraPay
      this.salePayment = this.salePayOderByID[0]?.salePayment
      this.salePayOverdue = this.salePayOderByID[0]?.saleOverdue

      if (this.salePayOderBy.length <= 0) {
        this.salePayForm.patchValue({ salePayBalance: data?.saleBalance })
        this.salePayForm.patchValue({ saleLastPaymet: data?.salePayment })
        this.salePayForm.patchValue({ salePayOver: data?.saleOverdue })
      } else {
        this.salePayForm.patchValue({ salePayBalance: this.salePayBalacne })
        this.salePayForm.patchValue({ saleLastPaymet: this.salePayOderByEx })
        this.salePayForm.patchValue({ salePayOver: this.salePayOderByOver - this.salePayOderByEx })
      }
    })

    this.ModalList = this.modalService.show(
      payment,
      Object.assign({}, { class: 'gray modal-lg' })
    );
  }

  saveSalePay() {
    //Return if the form is invalid
    if (this.salePayForm.invalid) {
      return;
    }

    this.submitted = true;
    this.isLoading = true;

    let saveData: SalePay = this.salePayForm.getRawValue();

    console.log(saveData);

    this._serviceSale.createSalePay(saveData).subscribe((res) => {
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success',
        },
        buttonsStyling: false
      })
      if (res) {
        swalWithBootstrapButtons.fire({
          title: 'บันทึกการชำระเงินเรียบร้อยแล้ว !',
          text: "กรุณากดปุ่ม ตกลง เพื่อดำเนินการต่อ",
          icon: 'success',
          confirmButtonText: 'ตกลง',
          reverseButtons: true
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.reload();
          }
        })

      }
    });
  }

  openModalHistoryPayment(historypayment: TemplateRef<any>, data = null) {

    this._serviceSale.getSaleBYIDSalePay(data.saleProductId).subscribe((res) => {

      this.rowsSalepay = res;
      console.log(this.rowsSalepay);
      this.rowsSalepay = [...this.rowsSalepay];

      this.isLoading = false;
    })

    this.ModalList = this.modalService.show(
      historypayment,
      Object.assign({}, { class: 'gray modal-lg' })
    );
  }

  deleteConfrim() {

    if (this.confrimDelete.invalid) {
      return;
    }

    this.submitted = true;
    this.isLoading = true;


    this.password = this.confrimDelete.value.password
    this.passwordMain = localStorage.getItem('Password')

    console.log(this.password);
    console.log(this.passwordMain);


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
          'คุณสามารถกู้ข้อมูลคอร์สได้!',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'ยืนยัน',
        cancelButtonText: 'ยกเลิก',
      }).then((result) => {
        if (result.isConfirmed) {

          this._serviceSale.deleteSale(this.Items.saleId).pipe(take(1))
            .subscribe(() => {
              Swal.fire({
                icon: 'success',
                title: 'ลบข้อมูลสำเร็จ',
                showConfirmButton: false,
                timer: 2000,
              });
              window.location.reload();
              this._changeDetectorRef.markForCheck();
            })

        }
      });
    }
  }

  openModalConfrimDelete(confrimdelete: TemplateRef<any>, data = null) {

    this.confrimDelete.reset();

    this.Items = data;
    this.ModalList = this.modalService.show(
      confrimdelete,
      Object.assign({})
      // Object.assign({}, { class: 'gray modal-lg' })
    );
  }

  getNameEmp(id: number) {
    let index = this.Employee.findIndex(type => type.empId === id);
    if (index === -1) {
      return "-";
    }
    else {
      return this.Employee[index].empFullname;
    }
  }

  getNameCourse(id: number) {
    let index = this.courses.findIndex(type => type.courseId === id);
    if (index === -1) {
      return "-";
    }
    else {
      return this.courses[index].courseNameTh;
    }
  }

}
