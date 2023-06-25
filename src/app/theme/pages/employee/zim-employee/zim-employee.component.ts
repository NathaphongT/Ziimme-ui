import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable, Subject, catchError, take, takeUntil, tap, throwError } from 'rxjs';
import { BasicService } from '@app/theme/pages/basic-data/basic.service';
import { EmployeeService } from 'src/app/_service/employee.service';
import Swal from 'sweetalert2';
import { Branch, Position } from '../../basic-data/basic.model';
import { Employee } from '@app/_service/main.types';

@Component({
  selector: 'app-zim-employee',
  templateUrl: './zim-employee.component.html',
  styleUrls: ['./zim-employee.component.scss']
})
export class ZimEmployeeComponent implements OnInit {
  @ViewChild(DatatableComponent, { static: true }) table: DatatableComponent;

  public employees: Employee[];
  employees$: Observable<Employee[]>;

  positions$: Observable<Position[]>
  Positions: Position[] = [];

  branchs$: Observable<Branch[]>
  Branchs: Branch[] = [];

  employeeForm: FormGroup;

  Branch = [];

  basicRows = [];
  basicSort = [];
  ColumnMode = ColumnMode;
  key: any;
  count: any;
  lastupdate: any = '';

  isAddMode: boolean;
  ModalList: BsModalRef;

  status: string[] = ['โสด', 'สมรส', 'อื่นๆ'];

  isLoading: boolean;
  submitted: boolean;

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _Service: EmployeeService,
    private _SerivceBasic: BasicService,
    private _changeDetectorRef: ChangeDetectorRef,
    private modalService: BsModalService,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.LoadEmployeALL();
    this.employeeForm = this._formBuilder.group({
      empId: [null],
      empFullname: ['', Validators.required],
      empNickname: ['', Validators.required],
      // emp_birthday: ['', Validators.required],
      empBirthday: [''],
      empTelephone: [''],
      // emp_telephone: ['', Validators.required],
      empEmail: [''],
      // emp_email: ['', [Validators.required, Validators.email]],
      empStatus: [[], Validators.required],
      empPosition: ['', Validators.required],
      empBranch: ['', Validators.required],
    });

    this.positions$ = this._SerivceBasic.positions$;
    this._SerivceBasic.positions$.pipe(takeUntil(this._unsubscribeAll)).subscribe(positions => {
      this.Positions = positions;
    })

    this.branchs$ = this._SerivceBasic.branchs$;
    this._SerivceBasic.branchs$.pipe(takeUntil(this._unsubscribeAll)).subscribe(branchs => {
      this.Branchs = branchs;
    })

    this.employees$ = this._Service.employees$;

    this.employees$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((employees) => {

        if (employees) {
          this.basicRows = employees;

          this.basicRows = [...this.basicRows];
        }
        else {
          this.basicRows = [];
        }

        this.isLoading = false;

      })
  }

  openModal(template: TemplateRef<any>, data = null) {


    this.employeeForm.reset();
    this.employeeForm.markAsPristine();
    if (data) {
      this.employeeForm.patchValue(data);
      // console.log(data);
    }

    this.ModalList = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-lg' })
    );
  }

  get f() { return this.employeeForm.controls; }

  onSubmit() {

    // Return if the form is invalid
    if (this.employeeForm.invalid) {
      return;
    }

    this.submitted = true;
    this.isLoading = true;

    let saveData: Employee = this.employeeForm.getRawValue();
    // If there is an id, update it...
    if (saveData.empId) {
      this._Service.updateEmployee(saveData.empId, saveData)
        .pipe()
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
      this._Service.createEmployee(saveData)
        .pipe()
        .subscribe((res) => {
          this.ModalList.hide();
          if (res) {
            Swal.fire({
              icon: 'success',
              title: 'เพิ่มข้อมูลสำเร็จแล้ว',
              showConfirmButton: false,
              timer: 2000,
            });
          }
        });
    }
  }

  delete(row) {
    Swal.fire({
      title: 'คุณแน่ใจหรือว่าต้องการลบ?',
      text:
        'คุณจะไม่สามารถกู้พนักงาน ' + row.empFullname + ' ได้!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก',
    }).then((result) => {
      if (result.isConfirmed) {
        this._Service.deleteEmployee(row.empId).pipe(take(1))
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


  getNamePosition(id: number) {
    let index = this.Positions.findIndex(item => item.positionId === id);
    if (index === -1) {
      return "-";
    }
    else {
      return this.Positions[index].positionNameEng;
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

  serviceListFilter(event) {
    const val = event.target.value.toLowerCase();
    this.key = event.target.value.toLowerCase();
    const temp = this.basicSort.filter(function (d) {
      return (
        d.empFullname.toLowerCase().indexOf(val) !== -1 ||
        d.empFullname.toLowerCase().indexOf(val) !== -1 ||
        d.emp_nickname.toLowerCase().indexOf(val) !== -1 ||
        d.emp_nickname.toLowerCase().indexOf(val) !== -1 ||
        !val
      );
    });
    this.basicRows = temp;
    this.table.offset = 0;
  }

  LoadEmployeALL() {
    this._Service.getAllEmployee().subscribe((res) => {
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
