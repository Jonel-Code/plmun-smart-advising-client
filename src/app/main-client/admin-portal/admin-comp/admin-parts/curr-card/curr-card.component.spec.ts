import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrCardComponent } from './curr-card.component';

describe('CurrCardComponent', () => {
  let component: CurrCardComponent;
  let fixture: ComponentFixture<CurrCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
