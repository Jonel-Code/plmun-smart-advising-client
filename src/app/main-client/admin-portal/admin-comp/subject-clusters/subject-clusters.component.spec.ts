import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectClustersComponent } from './subject-clusters.component';

describe('SubjectClustersComponent', () => {
  let component: SubjectClustersComponent;
  let fixture: ComponentFixture<SubjectClustersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubjectClustersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubjectClustersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
