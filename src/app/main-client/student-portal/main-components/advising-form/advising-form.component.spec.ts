import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvisingFormComponent } from './advising-form.component';

describe('AdvisingFormComponent', () => {
  let component: AdvisingFormComponent;
  let fixture: ComponentFixture<AdvisingFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvisingFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvisingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
