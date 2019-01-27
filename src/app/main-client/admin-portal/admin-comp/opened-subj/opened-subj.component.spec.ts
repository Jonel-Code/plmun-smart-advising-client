import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenedSubjComponent } from './opened-subj.component';

describe('OpenedSubjComponent', () => {
  let component: OpenedSubjComponent;
  let fixture: ComponentFixture<OpenedSubjComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenedSubjComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenedSubjComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
