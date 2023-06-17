import { ChangeDetectorRef, Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Observable, Subject, catchError, take, takeUntil, tap, throwError } from 'rxjs';
import { BasicService } from '@app/theme/pages/basic-data/basic.service';
import Swal from 'sweetalert2';
import { Position } from '../basic.model';

@Component({
  selector: 'app-position-data',
  templateUrl: './position-data.component.html',
  styleUrls: ['./position-data.component.scss']
})
export class PositionDataComponent implements OnInit {

  public positions: Position[];
  positions$: Observable<Position[]>;

  positionForm: FormGroup;

  rows = [];

  isAddMode: boolean;

  ColumnMode = ColumnMode;

  modalRef?: BsModalRef;

  isLoading: boolean;
  submitted: boolean;

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(private modalService: BsModalService, private _formBuilder: FormBuilder, private _Service: BasicService, private _changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {

    this.GetAllPosition();

    this.positionForm = this._formBuilder.group({
      position_id: [null],
      position_name_th: ['', Validators.required],
      position_name_eng: ['', Validators.required],
    });

    this.positions$ = this._Service.positions$;

    this.positions$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((positions) => {

        if (positions) {
          this.rows = positions;

          this.rows = [...this.rows];
        }
        else {
          this.rows = [];
        }

        this.isLoading = false;

      })
  }

  openModal(template: TemplateRef<any>, data = null) {
    this.positions = data
    // console.log(this.positions);
    // this.modalUser = this.modalService.show(template);
    // this.isAddMode = true
    this.positionForm.reset();
    this.positionForm.markAsPristine();
    if (data) {
      this.positionForm.patchValue(data);
      // this.isAddMode = false
    }
    this.modalRef = this.modalService.show(template);
  }

  get f() { return this.positionForm.controls; }

  onSubmit() {
    // Return if the form is invalid
    if (this.positionForm.invalid) {
      return;
    }

    this.submitted = true;
    this.isLoading = true;

    let saveData: Position = this.positionForm.getRawValue();
    // If there is an id, update it...
    if (saveData.position_id) {
      this._Service.updatePosition(saveData.position_id, saveData)
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
      this._Service.createPosition(saveData)
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
        this._Service.deletePosition(row.position_id).pipe(take(1))
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

  GetAllPosition() {
    this._Service
      .getAllPosition()
      .pipe(tap((position) => (this.positions = position)))
      .subscribe(data => {
        // console.log('ชื่อผู้ใช้งาน', data);
      });
  }
}
