import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatePickerLocaleComponent } from './date-picker-locale.component';

describe('DatePickerLocaleComponent', () => {
  let component: DatePickerLocaleComponent;
  let fixture: ComponentFixture<DatePickerLocaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatePickerLocaleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatePickerLocaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
