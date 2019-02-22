import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudDataComponent } from './stud-data.component';

describe('StudDataComponent', () => {
  let component: StudDataComponent;
  let fixture: ComponentFixture<StudDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
