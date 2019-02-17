import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCurrCardComponent } from './add-curr-card.component';

describe('AddCurrCardComponent', () => {
  let component: AddCurrCardComponent;
  let fixture: ComponentFixture<AddCurrCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCurrCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCurrCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
