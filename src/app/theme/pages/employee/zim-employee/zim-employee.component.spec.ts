import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZimEmployeeComponent } from './zim-employee.component';

describe('ZimEmployeeComponent', () => {
  let component: ZimEmployeeComponent;
  let fixture: ComponentFixture<ZimEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZimEmployeeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZimEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
