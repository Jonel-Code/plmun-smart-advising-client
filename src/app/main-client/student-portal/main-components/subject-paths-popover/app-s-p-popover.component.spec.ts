import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectPathsPopoverComponent } from './app-s-p-popover.component';

describe('SubjectPathsPopoverComponent', () => {
  let component: SubjectPathsPopoverComponent;
  let fixture: ComponentFixture<SubjectPathsPopoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubjectPathsPopoverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubjectPathsPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
