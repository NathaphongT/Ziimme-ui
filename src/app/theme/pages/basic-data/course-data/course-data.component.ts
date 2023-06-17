import { ChangeDetectorRef, Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable, Subject, catchError, take, takeUntil, tap, throwError } from 'rxjs';
import { BasicService } from '@app/theme/pages/basic-data/basic.service';
import Swal from 'sweetalert2';
import { Course } from '../basic.model';
@Component({
  selector: 'app-course-data',
  templateUrl: './course-data.component.html',
  styleUrls: ['./course-data.component.scss']
})
export class CourseDataComponent implements OnInit {

  public courses: Course[];
  courses$: Observable<Course[]>;

  courseForm: FormGroup;

  rows = [];
  isAddMode: boolean;
  ColumnMode = ColumnMode;
  modalRef?: BsModalRef;

  isLoading: boolean;
  submitted: boolean;

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(private _Service: BasicService, private modalService: BsModalService, private _formBuilder: FormBuilder, private _changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {

    this.GetAll();

    this.courseForm = this._formBuilder.group({
      course_id: [null],
      course_code: ['', Validators.required],
      course_name_th: ['', Validators.required],
      course_name_eng: ['', Validators.required],
      course_detail: [''],
    });

    this.courses$ = this._Service.courses$;

    this.courses$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((users) => {

        if (users) {
          this.rows = users;

          this.rows = [...this.rows];
        }
        else {
          this.rows = [];
        }

        this.isLoading = false;

      })
  }

  openModal(template: TemplateRef<any>, data = null) {
    this.courses = data
    // console.log(this.courses);
    // this.modalUser = this.modalService.show(template);
    // this.isAddMode = true
    this.courseForm.reset();
    this.courseForm.markAsPristine();
    if (data) {
      this.courseForm.patchValue(data);
      // this.isAddMode = false
    }
    this.modalRef = this.modalService.show(template);
  }

  get f() { return this.courseForm.controls; }


  onSubmit() {
    // Return if the form is invalid
    if (this.courseForm.invalid) {
      return;
    }

    this.submitted = true;
    this.isLoading = true;

    let saveData: Course = this.courseForm.getRawValue();
    // If there is an id, update it...
    if (saveData.course_id) {
      this._Service.updateCourse(saveData.course_id, saveData)
        .pipe(
        // catchError((err) => {
        //   console.log(err);

        //   Swal.fire({
        //     icon: 'error',
        //     title: 'ชื่อผู้ใช้งานนี้มีอยู่ในระบบแล้ว',
        //     showConfirmButton: false,
        //     timer: 2000,
        //   });
        //   return throwError(err);
        // })
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
      this._Service.createCourse(saveData)
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
        'คุณจะไม่สามารถกู้คืนคอร์ส ' + row.course_name + ' ได้!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก',
    }).then((result) => {
      if (result.isConfirmed) {
        this._Service.deleteCourse(row.course_id).pipe(take(1))
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

  GetAll() {
    this._Service
      .getAllCourse()
      .pipe(tap((course) => (this.courses = course)))
      .subscribe(data => {
        // console.log('ชื่อผู้ใช้งาน', data);
        this.rows = data;
      });
  }
}
