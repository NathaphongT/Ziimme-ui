import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchDataComponent } from './branch-data.component';

describe('BranchDataComponent', () => {
  let component: BranchDataComponent;
  let fixture: ComponentFixture<BranchDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BranchDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BranchDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
