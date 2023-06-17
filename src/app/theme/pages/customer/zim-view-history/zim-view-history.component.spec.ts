import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZimViewHistoryComponent } from './zim-view-history.component';

describe('ZimViewHistoryComponent', () => {
  let component: ZimViewHistoryComponent;
  let fixture: ComponentFixture<ZimViewHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZimViewHistoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZimViewHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
