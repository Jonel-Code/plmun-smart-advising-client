import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileLabelComponent } from './mobile-label.component';

describe('MobileLabelComponent', () => {
  let component: MobileLabelComponent;
  let fixture: ComponentFixture<MobileLabelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MobileLabelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
