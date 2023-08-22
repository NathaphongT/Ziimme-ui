import { ChangeDetectorRef, Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable, Subject, catchError, take, takeUntil, tap, throwError } from 'rxjs';
import { BasicService } from '@app/theme/pages/basic-data/basic.service';
import Swal from 'sweetalert2';
import { Branch } from '../basic.model';
import { BranchPagination } from '@app/_service/pagination.types';

@Component({
  selector: 'app-branch-data',
  templateUrl: './branch-data.component.html',
  styleUrls: ['./branch-data.component.scss']
})
export class BranchDataComponent implements OnInit {

  public branchs: Branch;

  branchForm: FormGroup;
  confrimDelete: FormGroup;

  rows = [];
  count: any;
  ColumnMode = ColumnMode;

  isAddMode: boolean;

  ModalList?: BsModalRef;

  Items: any;
  password: any;
  passwordMain: any;
  positionMain: any;


  isLoading: boolean;
  submitted: boolean;

  branchsPagination: BranchPagination;
  searchInputControl: UntypedFormControl = new UntypedFormControl();

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(private modalService: BsModalService,
    private _formBuilder: FormBuilder,
    private _Service: BasicService,
    private _changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {

    this.branchForm = this._formBuilder.group({
      branchId: [null],
      branch_code: ['', Validators.required],
      branch_name_th: ['', Validators.required],
      branch_name_eng: ['', Validators.required],
    });

    this.confrimDelete = this._formBuilder.group({
      password: ['', Validators.required]
    })

    this.positionMain = localStorage.getItem('Position')


    this._Service.branchsPagination$
      .pipe(takeUntil(this._unsubscribeAll)).subscribe(pagination => {
        this.branchsPagination = pagination;

        this._changeDetectorRef.markForCheck();

      });

    this._Service.branchs$
      .pipe(takeUntil(this._unsubscribeAll)).subscribe(branchs => {
        this.rows = branchs;

        this.count = this.rows.length;

        this.rows = [...this.rows];

        this.isLoading = false;
      })
  }

  openModal(template: TemplateRef<any>, data = null) {
    this.branchs = data
    // console.log(this.branchs);
    // this.modalUser = this.modalService.show(template);
    // this.isAddMode = true
    this.branchForm.reset();
    this.branchForm.markAsPristine();
    if (data) {
      this.branchForm.patchValue(data);
      // this.isAddMode = false
    }
    this.ModalList = this.modalService.show(template);
  }

  get f() { return this.branchForm.controls; }

  onSubmit() {
    // Return if the form is invalid
    if (this.branchForm.invalid) {
      return;
    }

    this.submitted = true;
    this.isLoading = true;

    let saveData: Branch = this.branchForm.getRawValue();
    // If there is an id, update it...
    if (saveData.branchId) {
      this._Service.updateBranch(saveData.branchId, saveData)
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
      this._Service.createBranch(saveData)
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

  setPage(pageInfo) {
    this.branchsPagination.page = pageInfo.offset + 1;
    this._Service.getBranch(this.searchInputControl.value || "", this.branchsPagination.page, this.branchsPagination.size).subscribe();
  }

  sorting(event) {
    if (event.sorts && event.sorts.length) {
      this.isLoading = true;

      this.branchsPagination.page = 1;
      this._Service.getBranch(this.searchInputControl.value || "", this.branchsPagination.page, this.branchsPagination.size, event.sorts[0].prop, event.sorts[0].dir).subscribe(() => {
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
          'คุณจะไม่สามารถกู้คืนตำแหน่ง ' + this.Items.positionNameTh + ' ได้!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'ยืนยัน',
        cancelButtonText: 'ยกเลิก',
      }).then((result) => {
        if (result.isConfirmed) {
          this._Service.deletePosition(this.Items.branchId).pipe(take(1))
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
