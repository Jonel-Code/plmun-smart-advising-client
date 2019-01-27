import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResSideNavComponent } from './res-side-nav.component';

describe('ResSideNavComponent', () => {
  let component: ResSideNavComponent;
  let fixture: ComponentFixture<ResSideNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResSideNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResSideNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
