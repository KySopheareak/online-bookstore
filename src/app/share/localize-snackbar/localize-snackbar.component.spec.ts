import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalizeSnackbarComponent } from './localize-snackbar.component';

describe('LocalizeSnackbarComponent', () => {
  let component: LocalizeSnackbarComponent;
  let fixture: ComponentFixture<LocalizeSnackbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LocalizeSnackbarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalizeSnackbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
