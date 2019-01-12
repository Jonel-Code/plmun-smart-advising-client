import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectPathsComponent } from './subject-paths.component';

describe('SubjectPathsComponent', () => {
  let component: SubjectPathsComponent;
  let fixture: ComponentFixture<SubjectPathsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubjectPathsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubjectPathsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
