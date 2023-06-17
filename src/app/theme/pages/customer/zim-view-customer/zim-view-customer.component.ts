import { ChangeDetectorRef, Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ActivatedRoute, Router } from '@angular/router';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subject, catchError, map, take, takeUntil, throwError } from 'rxjs';
import { Customer, Employee } from '@app/_service/user.types';
import { EmployeeService } from '@app/_service/employee.service';
import { BasicService } from '@app/theme/pages/basic-data/basic.service';
import { SaleService } from '@app/_service/sale.service';
import Swal from 'sweetalert2';
import { CustomerService } from '@app/theme/pages/customer/customer.service';
import { Course, Sale } from '../../basic-data/basic.model';
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

  sales$: Observable<Sale[]>;
  sale = [];

  employes$: Observable<Employee[]>
  Employees: Employee[]

  selectedSaleEmp: number[] = []; // Assuming categoryFarmId is a number


  coures$: Observable<Course[]>;
  Courses: Course[] = [];


  Eco: any = {};

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _formBuilder: FormBuilder,
    private modalService: BsModalService,
    private _ServiceSale: SaleService,
    private _SerivceEmp: EmployeeService,
    private _SerivceBasic: BasicService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router
  ) {
    this._activatedRoute.paramMap.subscribe(params => {
      this.cus_id = params.get('id')
    })
  }

  ngOnInit(): void {

    this.saleForm = this._formBuilder.group({
      sale_id: [this.cus_id],
      sale_number: [{ value: '', enabled: !!this.cus_id }, Validators.required],
      sale_product: [{ value: '', enabled: !!this.cus_id }, Validators.required],
      sale_count: [{ value: '', enabled: !!this.cus_id }, Validators.required],
      sale_pay_balance: [{ value: '', enabled: !!this.cus_id }, Validators.required],
      sale_pay: [{ value: '', enabled: !!this.cus_id }, Validators.required],
      sale_overdue: [{ value: '', enabled: !!this.cus_id }, Validators.required],
      cus_id: [this.cus_id],
    });

    this.saleEmployeeForm = this._formBuilder.group({
      emp_id: [{ value: '', enabled: !!this.cus_id }, Validators.required]
    })

    this.sales$ = this._ServiceSale.sales$;
    this.employes$ = this._SerivceEmp.employees$;

    this._SerivceEmp.employees$.pipe(takeUntil(this._unsubscribeAll)).subscribe(employees => {
      this.Employees = employees;
      console.log('พนักงาน', this.Employees);
    })

    this.coures$ = this._SerivceBasic.courses$;
    this._SerivceBasic.courses$.pipe(takeUntil(this._unsubscribeAll)).subscribe(courses => {
      this.Courses = courses;
    })

    this._ServiceSale.sales$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((sale) => {

        if (sale) {
          this.rows = sale;

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
    this.saleForm.patchValue({ cus_id: this.cus_id })
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

    if (this.saleForm.invalid) {
      return;
    }

    this.submitted = true;
    this.isLoading = true;

    let saveData: Sale = this.saleForm.getRawValue();

    if (saveData) {
      const overviewData = this.saleForm.getRawValue();
      const platformData = this.saleEmployeeForm.getRawValue();
      // const socialData = this.getSocialData();

      if (overviewData.warehouseId) {
        // no need to update anymore
        /* this._socialService.updateAll(overviewData.warehouseId, overviewData.warehouseName, this.myDropDown, platformData.categories, socialData).subscribe((v) => {
          console.log(v)
        }
        ); */
      }
      else {
        this._ServiceSale.saveAll(
          overviewData.sale_number,
          overviewData.sale_product,
          overviewData.sale_count,
          overviewData.sale_pay_balance,
          overviewData.sale_pay,
          overviewData.sale_overdue,
          overviewData.cus_id,
          platformData.emp_id)
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
            console.log('กรอกเรียบร้อย', v);
            Swal.fire({
              icon: 'success',
              title: 'เพิ่มข้อมูลสำเร็จแล้ว',
              showConfirmButton: false,
              timer: 2000,
            }).then((result) => {
              console.log('ข้อมูล', result);

              // this._router.navigate(['/data/list'], {
              //   queryParams: {
              //     search: v.warehouseName
              //   }
              // });
            });
          }
          );
      }
    }
  }

  onCategorySelectionChange(checked: boolean, emp_id: number): void {
    if (checked) {
      this.selectedSaleEmp.push(emp_id);
    } else {
      const index = this.selectedSaleEmp.indexOf(emp_id);
      if (index !== -1) {
        this.selectedSaleEmp.splice(index, 1);
      }
    }
  }

  // You might also need a function to pre-select certain categories when the component loads
  selectCategories(emp_ids: number[]): void {
    this.selectedSaleEmp = emp_ids;
  }


  getNameProduct(id: number) {
    let index = this.Courses.findIndex(type => type.course_id === id);
    if (index === -1) {
      return "-";
    }
    else {
      return this.Courses[index].course_name_eng;
    }
  }

 

}
