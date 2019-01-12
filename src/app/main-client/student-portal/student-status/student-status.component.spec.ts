import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentStatusComponent } from './student-status.component';

describe('StudentStatusComponent', () => {
  let component: StudentStatusComponent;
  let fixture: ComponentFixture<StudentStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
