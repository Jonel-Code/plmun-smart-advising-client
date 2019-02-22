import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudUploaderComponent } from './stud-uploader.component';

describe('StudUploaderComponent', () => {
  let component: StudUploaderComponent;
  let fixture: ComponentFixture<StudUploaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudUploaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudUploaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
