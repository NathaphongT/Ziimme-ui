import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseDataComponent } from './course-data.component';

describe('CourseDataComponent', () => {
  let component: CourseDataComponent;
  let fixture: ComponentFixture<CourseDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourseDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
