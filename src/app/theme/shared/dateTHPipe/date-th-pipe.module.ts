import { NgModule } from '@angular/core';
import { DateTHPipe } from './date-th-pipe.pipe';

@NgModule({
    declarations: [
        DateTHPipe
    ],
    exports     : [
        DateTHPipe
    ]
})
export class DateTHPipeModule
{
}
