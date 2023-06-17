import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { BasicDataRoutingModule } from './basic-data-routing.module';

import { CourseDataComponent } from './course-data/course-data.component';
import { UserDataComponent } from './user-data/user-data.component';
import { PositionDataComponent } from './position-data/position-data.component';

import { MatFormFieldModule, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BranchDataComponent } from './branch-data/branch-data.component';

@NgModule({
  declarations: [
    CourseDataComponent,
    UserDataComponent,
    PositionDataComponent,
    BranchDataComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BasicDataRoutingModule,
    NgxDatatableModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatChipsModule,
    MatButtonModule,
    MatSelectModule
  ],
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } }
  ]
})
export class BasicDataModule { }
