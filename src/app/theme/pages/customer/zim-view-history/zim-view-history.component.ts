import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BasicService } from '@app/theme/pages/basic-data/basic.service';
import { CustomerService } from '@app/theme/pages/customer/customer.service';
import { SaleService } from '@app/_service/sale.service';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable, Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { Branch, Course, SaleCut } from '../../basic-data/basic.model';
import { Employee, Sale } from '@app/_service/main.types';
import { EmployeeService } from '../../employee/employee.service';

@Component({
  selector: 'app-zim-view-history',
  templateUrl: './zim-view-history.component.html',
  styleUrls: ['./zim-view-history.component.scss']
})
export class ZimViewHistoryComponent implements OnInit {

  sales$: Observable<Sale[]>;
  Sales: Sale[] = [];
  sale: any = {};
  sale_pay_balance: any = "";
  sale_count: any = "";

  salescut$: Observable<SaleCut[]>;
  Salescut: SaleCut[] = [];
  sale_cut: any = {};
  sale_cut_pay_balance: any = "";
  sale_cut_count: any = "";

  SalescutOrder: SaleCut;


  CutOder = [];

  employes$: Observable<Employee[]>;
  Employees: Employee[] = [];

  coures$: Observable<Course[]>;
  Courses: Course[] = [];

  branchs$: Observable<Branch[]>
  Branchs: Branch[] = [];

  data: any;
  DataCourse: any = []

  salecutForm: FormGroup;
  rows = [];
  ColumnMode = ColumnMode;

  sale_id = null
  ModalList: BsModalRef;

  isLoading: boolean;
  submitted: boolean;

  Docter = [
    {
      id: 0,
      name: '-',
    },
    {
      id: 1,
      name: 'Dr.โจ'
    },
    {
      id: 2,
      name: 'Dr.หนุ่ย'
    }
  ]

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _formBuilder: FormBuilder,
    private modalService: BsModalService,
    private _ServiceSale: SaleService,
    private _activatedRoute: ActivatedRoute,
    private _SerivceEmp: EmployeeService,
    private _SerivceBasic: BasicService,
  ) {
    this._activatedRoute.paramMap.subscribe(params => {
      this.sale_id = params.get('id')
    })
  }

  ngOnInit() {

    this.salecutForm = this._formBuilder.group({
      sale_cut_id: [null],
      sale_cut_count: [''],
      sale_cut_vitamin: [''],
      sale_cut_mark: [''],
      sale_cut_therapist: [''],
      sale_cut_doctor: [''],
      sale_cut_pay_balance: [''],
      sale_cut_pay: [''],
      sale_cut_overdue: [''],
      sale_cut_detail: [''],
      sale_id: [this.sale_id],
    });

    this.sales$ = this._ServiceSale.sales$;
    this._ServiceSale.sales$.pipe(takeUntil(this._unsubscribeAll)).subscribe(sales => {
      this.Sales = sales;
      this.sale = Object.assign({}, this.Sales);
      this.sale_pay_balance = this.sale[0].sale_overdue
      this.sale_count = this.sale[0].sale_count
    })

    this.employes$ = this._SerivceEmp.employees$;
    this._SerivceEmp.employees$.pipe(takeUntil(this._unsubscribeAll)).subscribe(employees => {
      this.Employees = employees;
    })

    this.coures$ = this._SerivceBasic.courses$;
    this._SerivceBasic.courses$.pipe(takeUntil(this._unsubscribeAll)).subscribe(courses => {
      this.Courses = courses;
    })

    this.branchs$ = this._SerivceBasic.branchs$;
    this._SerivceBasic.branchs$.pipe(takeUntil(this._unsubscribeAll)).subscribe(branchs => {
      this.Branchs = branchs;
    })

    this.salescut$ = this._ServiceSale.salescut$;
    this._ServiceSale.salescut$.pipe(takeUntil(this._unsubscribeAll)).subscribe(salescut => {
      this.Salescut = salescut;


    })

    this.salescut$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((salecut) => {

        if (salecut) {
          this.rows = salecut;

          this.rows = [...this.rows];
        }
        else {
          this.rows = [];
        }

        this.isLoading = false;

      })

    this.GetOrder(this.sale_id);
  }

  GetOrder(id) {
    this._ServiceSale.getSaleCutBYIDOrder(id).subscribe(res => {
      this.SalescutOrder = res;
      this.CutOder = Array(this.SalescutOrder[0]);
      this.sale_cut = Object.assign({}, this.SalescutOrder);
      this.sale_cut_pay_balance = this.sale_cut[0]?.sale_cut_overdue
      this.sale_cut_count = this.sale_cut[0]?.sale_cut_count
      console.log(this.sale_cut);
    })
  }


  get f() { return this.salecutForm.controls; }

  onSubmit() {
    // console.log('ข้อมูลทั้งหมด', this.salecutForm.value);
    //Return if the form is invalid
    if (this.salecutForm.invalid) {
      return;
    }


    this.submitted = true;
    this.isLoading = true;

    let saveData: SaleCut = this.salecutForm.getRawValue();

    if (saveData.sale_cut_id) {
      this._ServiceSale.updateSaleCut(saveData.sale_cut_id, saveData).subscribe((res) => {
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
      this._ServiceSale.createSaleCut(saveData).subscribe((res) => {
        this.ModalList.hide();
        if (res) {
          Swal.fire({
            icon: 'success',
            title: 'เพิ่มข้อมูลสำเร็จแล้ว',
            showConfirmButton: false,
            timer: 2000,
            // timerProgressBar: true,
          });
          window.location.reload();
        }
      });
    }
  }

  openModal(template: TemplateRef<any>, data = null) {

    this.sale = data
    // console.log(this.sale_id);

    this.salecutForm.reset();
    if (this.sale_cut_pay_balance >= 0) {
      this.salecutForm.patchValue({ sale_cut_pay_balance: this.sale_cut_pay_balance })
      this.salecutForm.patchValue({ sale_cut_count: this.sale_cut_count + 1 })
    } else {
      this.salecutForm.patchValue({ sale_cut_pay_balance: this.sale_pay_balance })
      this.salecutForm.patchValue({ sale_cut_count: this.sale_cut })
    }

    this.salecutForm.patchValue({ sale_id: this.sale_id });
    // this.salecutForm.patchValue({ sale_cut_pay_balance: this.sale_pay_balance });
    this.salecutForm.markAsPristine();


    if (data) {
      this.salecutForm.patchValue(data);
    }

    this.ModalList = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-lg' })
    );
  }

  getNameEmployee(id: number) {
    let index = this.Employees.findIndex(type => type.empId === id);
    if (index === -1) {
      return "-";
    }
    else {
      return this.Employees[index].empFullname;
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

  getNameBranch(id: number) {
    let index = this.Branchs.findIndex(item => item.branchId === id);
    if (index === -1) {
      return "-";
    }
    else {
      return this.Branchs[index].branchCode;
    }
  }
}
