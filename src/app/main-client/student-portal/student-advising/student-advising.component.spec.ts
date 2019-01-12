import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentAdvisingComponent } from './student-advising.component';

describe('StudentAdvisingComponent', () => {
  let component: StudentAdvisingComponent;
  let fixture: ComponentFixture<StudentAdvisingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentAdvisingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentAdvisingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
