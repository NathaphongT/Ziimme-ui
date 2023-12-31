import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BasicService } from '@app/theme/pages/basic-data/basic.service';
import { Observable, Subject, catchError, map, takeUntil, tap, throwError } from 'rxjs';
import { Customer } from '@app/_service/user.types';
import { CustomerService } from '@app/theme/pages/customer/customer.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { Districts, PostCode, Province, SubDistricts, Salary, Branch } from '../../basic-data/basic.model';

@Component({
  selector: 'app-zim-customers',
  templateUrl: './zim-customers.component.html',
  styleUrls: ['./zim-customers.component.scss']
})
export class ZimCustomersComponent {

  customerForm: FormGroup;

  customer$: Observable<any>

  public salarys: Salary;

  provinces$: Observable<Province[]>
  // districts$: Observable<Districts[]>
  // subdistricts$: Observable<SubDistricts[]>

  branchs$: Observable<Branch[]>
  Branchs: Branch[] = [];


  prefix: string[] = ['นาย', 'นาง', 'นางสาว'];
  gender: string[] = ['ชาย', 'หญิง', 'อื่นๆ'];
  status: string[] = ['โสด', 'สมรส', 'อื่นๆ'];
  payment: string[] = ['เงินสด', 'บัตรเครดิต', 'สแกนจ่าย'];
  salary = [
    {
      "id": "1",
      "salary": "5,000-10,000"
    },
    {
      "id": "2",
      "salary": "10,000-30,000"
    },
    {
      "id": "3",
      "salary": "30,000-50,000"
    },
    {
      "id": "4",
      "salary": "50,000-70,000"
    },
    {
      "id": "5",
      "salary": "70,000-100,000"
    },
    {
      "id": "6",
      "salary": "100,000 ขึ้นไป"
    }
  ];

  Districts: any = [];
  Sub_Districts: any = [];
  Postcode: any = [];

  isLoading: boolean;
  submitted: boolean;

  cusId = null;

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private router: Router,
    private _fb: FormBuilder,
    private _Service: BasicService,
    private _activatedRoute: ActivatedRoute,
    private _serviceCus: CustomerService,
    private _serviceBase: BasicService

  ) {
    this._activatedRoute.paramMap.subscribe(params => {
      this.cusId = params.get('id')
    })
  }

  ngOnInit() {

    this.customerForm = this._fb.group({
      cusId: [this.cusId],
      cusBranch: [''],
      cusMember: [''],
      cusPrefix: [''],
      cusFullName: [''],
      cusNickName: [''],
      cusTelephone: [''],
      cusBirthday: [''],
      cusGender: [''],
      cusOccupation: [''],
      cusStatus: [''],
      cusSalary: [''],
      cusPayment: [''],
      cusHouseNumber: [''],
      cusMoo: [''],
      cusSoi: [''],
      cusRoad: [''],
      provinceID: [],
      districtID: [],
      sub_districtID: [],
      postcodeID: [],
      congenital_disease: [''],
      drug_allergy: [''],
    });

    this.provinces$ = this._Service.provinces$;
    this.branchs$ = this._serviceBase.branchs$;

    if (this.cusId) {
      this._serviceCus.customer$.pipe(takeUntil(this._unsubscribeAll)).subscribe(customer => {
        this.customerForm.patchValue(customer);
      })
    }

    this.GetByIdCustomer(this.cusId);
  }

  GetByIdCustomer(id) {
    this._serviceCus.getByIdCustomer(id).subscribe()
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  get f() { return this.customerForm.controls; }

  onSubmit() {
    // Return if the form is invalid
    if (this.customerForm.invalid) {
      return;
    }

    this.submitted = true;
    this.isLoading = true;

    let DataCustomer: Customer = this.customerForm.getRawValue();

    if (DataCustomer.cusId) {
      this._serviceCus.updateCustomer(DataCustomer.cusId, DataCustomer).subscribe((res) => {
        if (res) {
          Swal.fire({
            icon: 'success',
            title: 'แก้ไขข้อมูลสำเร็จ',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
          }).then((result) => {
            /* Read more about handling dismissals below */
            if (result.dismiss === Swal.DismissReason.timer) {
              this.router.navigate(['/customer/list']);
            }
          })
        }
      });
    }
    else {
      this.customerForm.reset();
      this._serviceCus.createCustomer(DataCustomer)
        .subscribe((res) => {
          if (res) {
            Swal.fire({
              icon: 'success',
              title: 'เพิ่มข้อมูลสำเร็จแล้ว',
              showConfirmButton: false,
              timer: 2000,
              timerProgressBar: true,
            }).then((result) => {
              /* Read more about handling dismissals below */
              if (result.dismiss === Swal.DismissReason.timer) {
                this.router.navigate(['/customer/list']);
              }
            })
          }
        });
    }
  }

  onPrvince(id: number) {
    this._Service
      .getProvinceBYID(id)
      .subscribe(data => {
        // console.log('อำเภอ', data);
        this.Districts = data
      });
  }

  onDistricts(id: number) {
    this._Service
      .getDistrictsBYID(id)
      .subscribe(data => {
        // console.log('ตำบล', data);
        this.Sub_Districts = data
      });
  }

  onSubDistricts(id: number) {
    this._Service
      .getSubDistrictsBYID(id)
      .subscribe(data => {
        // console.log('รหัสไปรษณีย์', data);
        this.Postcode = data
      });
  }

}
