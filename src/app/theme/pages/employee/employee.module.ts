import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ModalModule, BsModalService } from 'ngx-bootstrap/modal';
import { DatepickerModule, BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { MatFormFieldModule, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from "@angular/material/core";
import { EmployeeRoutingModule } from './employee-routing.module';

import { ZimEmployeeComponent } from './zim-employee/zim-employee.component';
import { SharedModule } from '../../shared/shared.module';
import { ZimEmployeeSaleComponent } from './zim-employee-sale/zim-employee-sale.component';
import { DateTHPipeModule } from "../../shared/dateTHPipe/date-th-pipe.module";
import { ZimEmployeeTotalComponent } from './zim-employee-total/zim-employee-total.component';
import { ZimEmployeePromotionComponent } from './zim-employee-promotion/zim-employee-promotion.component';

@NgModule({
    declarations: [
        ZimEmployeeComponent,
        ZimEmployeeSaleComponent,
        ZimEmployeeTotalComponent,
        ZimEmployeePromotionComponent
    ],
    providers: [
        BsModalService,
        { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } }
    ],
    imports: [
        CommonModule,
        SharedModule,
        EmployeeRoutingModule,
        NgxDatatableModule,
        ModalModule,
        BsDatepickerModule.forRoot(),
        DatepickerModule.forRoot(),
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatChipsModule,
        MatButtonModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
        DateTHPipeModule
    ]
})
export class EmployeeModule { }
