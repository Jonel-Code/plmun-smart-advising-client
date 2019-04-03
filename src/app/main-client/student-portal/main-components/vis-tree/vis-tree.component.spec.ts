import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisTreeComponent } from './vis-tree.component';

describe('VisTreeComponent', () => {
  let component: VisTreeComponent;
  let fixture: ComponentFixture<VisTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisTreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
