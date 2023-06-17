import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PositionDataComponent } from './position-data.component';

describe('DepartmentDataComponent', () => {
  let component: PositionDataComponent;
  let fixture: ComponentFixture<PositionDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PositionDataComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PositionDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
