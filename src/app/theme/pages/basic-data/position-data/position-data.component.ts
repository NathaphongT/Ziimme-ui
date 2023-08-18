import { ChangeDetectorRef, Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Observable, Subject, catchError, take, takeUntil, tap, throwError } from 'rxjs';
import { BasicService } from '@app/theme/pages/basic-data/basic.service';
import Swal from 'sweetalert2';
import { Position } from '../basic.model';
import { PositionPagination } from '@app/_service/pagination.types';

@Component({
  selector: 'app-position-data',
  templateUrl: './position-data.component.html',
  styleUrls: ['./position-data.component.scss']
})
export class PositionDataComponent implements OnInit {

  public positions: Position;


  positionForm: FormGroup;
  confrimDelete: FormGroup;

  ColumnMode = ColumnMode;
  rows = [];


  isAddMode: boolean;

  ModalList?: BsModalRef;

  Items: any;
  password: any;
  passwordMain: any;

  isLoading: boolean;
  submitted: boolean;

  positionPagination: PositionPagination;
  searchInputControl: UntypedFormControl = new UntypedFormControl();

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(private modalService: BsModalService, private _formBuilder: FormBuilder, private _Service: BasicService, private _changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {

    this.positionForm = this._formBuilder.group({
      positionId: [null],
      positionNameTh: ['', Validators.required],
      positionNameEng: ['', Validators.required],
    });

    this.confrimDelete = this._formBuilder.group({
      password: ['', Validators.required]
    })

    this._Service.positionsPagination$
      .pipe(takeUntil(this._unsubscribeAll)).subscribe(pagination => {
        this.positionPagination = pagination;

        this._changeDetectorRef.markForCheck();

      });

    this._Service.positions$
      .pipe(takeUntil(this._unsubscribeAll)).subscribe(positions => {
        this.rows = positions;

        this.rows = [...this.rows];

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
    this.ModalList = this.modalService.show(template);
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
    if (saveData.positionId) {
      this._Service.updatePosition(saveData.positionId, saveData)
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
    this.positionPagination.page = pageInfo.offset + 1;
    this._Service.getPosition(this.searchInputControl.value || "", this.positionPagination.page, this.positionPagination.size).subscribe();
  }

  sorting(event) {
    if (event.sorts && event.sorts.length) {
      this.isLoading = true;

      this.positionPagination.page = 1;
      this._Service.getPosition(this.searchInputControl.value || "", this.positionPagination.page, this.positionPagination.size, event.sorts[0].prop, event.sorts[0].dir).subscribe(() => {
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
          this._Service.deletePosition(this.Items.positionId).pipe(take(1))
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
