import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DatepickerModule, BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatNativeDateModule } from "@angular/material/core";
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';



import { CustomerRoutingModule } from './customer-routing.module';
import { ZimCustomerComponent } from './zim-customer/zim-customer.component';
import { ZimCustomersComponent } from './zim-customers/zim-customers.component';

import { ZimViewCustomerComponent } from './zim-view-customer/zim-view-customer.component';
import { DateTHPipeModule } from "../../shared/dateTHPipe/date-th-pipe.module";
import { ZimViewHistoryComponent } from './zim-view-history/zim-view-history.component';
import { ZimViewBirthdayComponent } from './zim-view-birthday/zim-view-birthday.component';


@NgModule({
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    declarations: [
        ZimCustomerComponent,
        ZimCustomersComponent,
        ZimViewCustomerComponent,
        ZimViewHistoryComponent,
        ZimViewBirthdayComponent,
    ],
    imports: [
        CommonModule,
        CustomerRoutingModule,
        NgxDatatableModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatIconModule,
        MatNativeDateModule,
        MatDatepickerModule,
        MatCardModule,
        MatButtonModule,
        MatAutocompleteModule,
        DateTHPipeModule
    ]
})
export class CustomerModule { }
