import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZimEmployeeTotalComponent } from './zim-employee-total.component';

describe('ZimEmployeeTotalComponent', () => {
  let component: ZimEmployeeTotalComponent;
  let fixture: ComponentFixture<ZimEmployeeTotalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZimEmployeeTotalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZimEmployeeTotalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
