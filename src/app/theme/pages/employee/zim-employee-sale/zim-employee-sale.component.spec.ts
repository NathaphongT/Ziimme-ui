import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZimEmployeeSaleComponent } from './zim-employee-sale.component';

describe('ZimEmployeeSaleComponent', () => {
  let component: ZimEmployeeSaleComponent;
  let fixture: ComponentFixture<ZimEmployeeSaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZimEmployeeSaleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZimEmployeeSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
