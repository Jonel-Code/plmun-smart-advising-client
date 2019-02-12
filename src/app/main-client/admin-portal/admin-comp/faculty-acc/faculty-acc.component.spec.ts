import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacultyAccComponent } from './faculty-acc.component';

describe('FacultyAccComponent', () => {
  let component: FacultyAccComponent;
  let fixture: ComponentFixture<FacultyAccComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacultyAccComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacultyAccComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
