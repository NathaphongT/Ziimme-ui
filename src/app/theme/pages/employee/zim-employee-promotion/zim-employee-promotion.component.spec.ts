import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZimEmployeePromotionComponent } from './zim-employee-promotion.component';

describe('ZimEmployeePromotionComponent', () => {
  let component: ZimEmployeePromotionComponent;
  let fixture: ComponentFixture<ZimEmployeePromotionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZimEmployeePromotionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZimEmployeePromotionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
