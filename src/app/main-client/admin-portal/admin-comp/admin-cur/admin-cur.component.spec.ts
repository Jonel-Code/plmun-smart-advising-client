import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCurComponent } from './admin-cur.component';

describe('AdminCurComponent', () => {
  let component: AdminCurComponent;
  let fixture: ComponentFixture<AdminCurComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminCurComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
