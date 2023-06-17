import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { CustomerService } from '../customer.service';
import { BasicService } from '../../basic-data/basic.service';
import { Subject, takeUntil } from 'rxjs';
import { ColumnMode } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-zim-view-birthday',
  templateUrl: './zim-view-birthday.component.html',
  styleUrls: ['./zim-view-birthday.component.scss']
})
export class ZimViewBirthdayComponent implements OnInit {

  basicRows = [];
  basicSort = [];
  ColumnMode = ColumnMode;

  isLoading: boolean;

  constructor(private _changeDetectorRef: ChangeDetectorRef,
    private _SerivceCus: CustomerService,
    private _ServiceBasic: BasicService
  ) { }

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  
  ngOnInit(): void {
    this._SerivceCus.customers$.pipe(takeUntil(this._unsubscribeAll)).subscribe(customers => {

      if (customers) {
        this.basicRows = customers;

        this.basicRows = [...this.basicRows];
      }
      else {
        this.basicRows = [];
      }

      this.isLoading = false;
    })

  }
}
