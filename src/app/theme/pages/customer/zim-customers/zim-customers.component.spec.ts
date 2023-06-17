import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZimCustomersComponent } from './zim-customers.component';

describe('ZimCustomersComponent', () => {
  let component: ZimCustomersComponent;
  let fixture: ComponentFixture<ZimCustomersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZimCustomersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZimCustomersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
