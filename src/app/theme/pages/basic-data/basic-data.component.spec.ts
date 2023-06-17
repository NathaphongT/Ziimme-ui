import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicDataComponent } from './basic-data.component';

describe('BasicDataComponent', () => {
  let component: BasicDataComponent;
  let fixture: ComponentFixture<BasicDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BasicDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BasicDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
