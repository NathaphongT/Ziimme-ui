import { ChangeDetectorRef, Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable, Subject, catchError, take, takeUntil, tap, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { User } from 'src/app/_service/user.types';
import { UserPagination } from '@app/_service/pagination.types';
import { UserService } from '@app/_service/user.service';
@Component({
  selector: 'app-user-data',
  templateUrl: './user-data.component.html',
  styleUrls: ['./user-data.component.scss']
})
export class UserDataComponent implements OnInit {

  userForm: FormGroup;
  confrimDelete: FormGroup;

  user = [];
  rows = [];

  public users: User;

  ModalList?: BsModalRef;

  Items: any;
  password: any;
  passwordMain: any;


  submitted: boolean;
  loading: boolean;

  hide = true;
  isLoading: boolean;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  ColumnMode = ColumnMode;

  branch: string[] = ['zeer (เซียร์ รังสิต)', 'pcb (Lotus เพรชบูรณ์)', 'nks (Big C นครสวรรค์ 2)'];
  position: string[] = ['admin', 'user'];

  userPagination: UserPagination;
  searchInputControl: UntypedFormControl = new UntypedFormControl();

  constructor(private router: Router, private _changeDetectorRef: ChangeDetectorRef, private modalService: BsModalService, private _Service: UserService, private _formBuilder: FormBuilder) { }

  ngOnInit() {
    this.userForm = this._formBuilder.group({
      userId: [null],
      username: ['', Validators.required],
      password: ['', Validators.required],
      userRole: [[], Validators.required],
      displayName: ['', Validators.required],
      branchName: [[], Validators.required],
    });

    this.confrimDelete = this._formBuilder.group({
      password: ['', Validators.required]
    })

    this._Service.usersPagination$
      .pipe(takeUntil(this._unsubscribeAll)).subscribe(pagination => {
        this.userPagination = pagination;

        this._changeDetectorRef.markForCheck();

      });

    this._Service.users$
      .pipe(takeUntil(this._unsubscribeAll)).subscribe(users => {
        this.rows = users;

        this.rows = [...this.rows];

        this.isLoading = false;
      })
  }

  openModal(template: TemplateRef<any>, data = null) {

    this.user = data
    // console.log(this.user);
    // this.ModalList = this.modalService.show(template);
    // this.isAddMode = true
    this.userForm.reset();
    this.userForm.markAsPristine();
    if (data) {
      this.userForm.patchValue(data);
      // this.isAddMode = false
    }
    this.ModalList = this.modalService.show(template);
    // this.isAddMode = true
  }

  // convenience getter for easy access to form fields
  get f() { return this.userForm.controls; }

  onSubmit() {

    // Return if the form is invalid
    if (this.userForm.invalid) {
      return;
    }

    this.submitted = true;
    this.loading = true;

    let saveData: User = this.userForm.getRawValue();
    // If there is an id, update it...
    if (saveData.userId) {
      this._Service.updateUser(saveData.userId, saveData)
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
    // Otherwise, create a new mission...
    else {
      this._Service.createUser(saveData)
        .pipe(
          catchError((err) => {
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
        'คุณจะไม่สามารถกู้คืนผู้ใช้งาน ' + row.username + ' ได้!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก',
    }).then((result) => {
      if (result.isConfirmed) {
        this._Service.deleteUser(row.userId).pipe(take(1))
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

  setPage(pageInfo) {
    this.userPagination.page = pageInfo.offset + 1;
    this._Service.getUser(this.searchInputControl.value || "", this.userPagination.page, this.userPagination.size).subscribe();
  }

  sorting(event) {
    if (event.sorts && event.sorts.length) {
      this.isLoading = true;

      this.userPagination.page = 1;
      this._Service.getUser(this.searchInputControl.value || "", this.userPagination.page, this.userPagination.size, event.sorts[0].prop, event.sorts[0].dir).subscribe(() => {
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
          'คุณจะไม่สามารถกู้คืนผู้ใช้งาน ' + this.Items.username + ' ได้!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'ยืนยัน',
        cancelButtonText: 'ยกเลิก',
      }).then((result) => {
        if (result.isConfirmed) {
          this._Service.deleteUser(this.Items.userId).pipe(take(1))
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
