import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZimViewCustomerComponent } from './zim-view-customer.component';

describe('ZimViewCustomerComponent', () => {
  let component: ZimViewCustomerComponent;
  let fixture: ComponentFixture<ZimViewCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZimViewCustomerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZimViewCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
