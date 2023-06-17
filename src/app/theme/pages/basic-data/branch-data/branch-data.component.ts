import { ChangeDetectorRef, Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable, Subject, catchError, take, takeUntil, tap, throwError } from 'rxjs';
import { BasicService } from '@app/theme/pages/basic-data/basic.service';
import Swal from 'sweetalert2';
import { Branch } from '../basic.model';

@Component({
  selector: 'app-branch-data',
  templateUrl: './branch-data.component.html',
  styleUrls: ['./branch-data.component.scss']
})
export class BranchDataComponent implements OnInit {
  public branchs: Branch[];
  branchs$: Observable<Branch[]>;

  branchForm: FormGroup;

  rows = [];

  isAddMode: boolean;

  ColumnMode = ColumnMode;

  modalRef?: BsModalRef;

  isLoading: boolean;
  submitted: boolean;

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(private modalService: BsModalService, private _formBuilder: FormBuilder, private _Service: BasicService, private _changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {

    this.GetAllBranch();

    this.branchForm = this._formBuilder.group({
      branch_id: [null],
      branch_code: ['', Validators.required],
      branch_name_th: ['', Validators.required],
      branch_name_eng: ['', Validators.required],
    });

    this.branchs$ = this._Service.branchs$;

    this.branchs$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((branchs) => {

        if (branchs) {
          this.rows = branchs;

          this.rows = [...this.rows];
        }
        else {
          this.rows = [];
        }

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
    this.modalRef = this.modalService.show(template);
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
    if (saveData.branch_id) {
      this._Service.updateBranch(saveData.branch_id, saveData)
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
          this.modalRef.hide();
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
          this.modalRef.hide();
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
        'คุณจะไม่สามารถกู้คืนตำแหน่ง ' + row.position_name_th + ' ได้!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก',
    }).then((result) => {
      if (result.isConfirmed) {
        this._Service.deletePosition(row.branch_id).pipe(take(1))
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

  GetAllBranch() {
    this._Service
      .getAllBranch()
      .pipe(tap((branch) => (this.branchs = branch)))
      .subscribe(data => {
        // console.log('รายการสาขา', data);
      });
  }
}
