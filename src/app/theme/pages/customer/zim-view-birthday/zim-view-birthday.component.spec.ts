import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZimViewBirthdayComponent } from './zim-view-birthday.component';

describe('ZimViewBirthdayComponent', () => {
  let component: ZimViewBirthdayComponent;
  let fixture: ComponentFixture<ZimViewBirthdayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZimViewBirthdayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZimViewBirthdayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
