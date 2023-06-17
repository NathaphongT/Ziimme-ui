import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZimCustomerComponent } from './zim-customer.component';

describe('ZimCustomerComponent', () => {
  let component: ZimCustomerComponent;
  let fixture: ComponentFixture<ZimCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZimCustomerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZimCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
