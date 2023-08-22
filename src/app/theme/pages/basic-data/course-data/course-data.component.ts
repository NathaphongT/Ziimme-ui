import { ChangeDetectorRef, Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable, Subject, catchError, take, takeUntil, tap, throwError } from 'rxjs';
import { BasicService } from '@app/theme/pages/basic-data/basic.service';
import Swal from 'sweetalert2';
import { Course } from '../basic.model';
import { CoursePagination } from '@app/_service/pagination.types';
@Component({
  selector: 'app-course-data',
  templateUrl: './course-data.component.html',
  styleUrls: ['./course-data.component.scss']
})
export class CourseDataComponent implements OnInit {

  public courses: Course[];
  courses$: Observable<Course[]>;

  courseForm: FormGroup;
  confrimDelete: FormGroup;

  rows = [];
  isAddMode: boolean;
  ColumnMode = ColumnMode;
  ModalList?: BsModalRef;

  Items: any;
  password: any;
  passwordMain: any;


  isLoading: boolean;
  submitted: boolean;

  coursePagination: CoursePagination;
  searchInputControl: UntypedFormControl = new UntypedFormControl();

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(private _Service: BasicService, private modalService: BsModalService, private _formBuilder: FormBuilder, private _changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {

    this.courseForm = this._formBuilder.group({
      courseId: [null],
      courseCode: ['', Validators.required],
      courseNameTh: ['', Validators.required],
      courseNameEng: ['', Validators.required],
      courseDetail: [''],
    });

    this.confrimDelete = this._formBuilder.group({
      password: ['', Validators.required]
    })

    this._Service.coursesPagination$
      .pipe(takeUntil(this._unsubscribeAll)).subscribe(pagination => {
        this.coursePagination = pagination;

        this._changeDetectorRef.markForCheck();

      });

    this._Service.courses$
      .pipe(takeUntil(this._unsubscribeAll)).subscribe(courses => {
        this.rows = courses;

        this.rows = [...this.rows];

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
    this.ModalList = this.modalService.show(template);
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
    if (saveData.courseId) {
      this._Service.updateCourse(saveData.courseId, saveData)
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
    
  }

  setPage(pageInfo) {
    this.coursePagination.page = pageInfo.offset + 1;
    this._Service.getCourse(this.searchInputControl.value || "", this.coursePagination.page, this.coursePagination.size).subscribe();
  }

  sorting(event) {
    if (event.sorts && event.sorts.length) {
      this.isLoading = true;

      this.coursePagination.page = 1;
      this._Service.getCourse(this.searchInputControl.value || "", this.coursePagination.page, this.coursePagination.size, event.sorts[0].prop, event.sorts[0].dir).subscribe(() => {
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
          'คุณจะไม่สามารถกู้คืนคอร์ส ' + this.Items.course_name + ' ได้!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'ยืนยัน',
        cancelButtonText: 'ยกเลิก',
      }).then((result) => {
        if (result.isConfirmed) {
          this._Service.deleteCourse(this.Items.courseId).pipe(take(1))
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
