import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnackbarComponentComponent } from './snackbar-component.component';

describe('SnackbarComponentComponent', () => {
  let component: SnackbarComponentComponent;
  let fixture: ComponentFixture<SnackbarComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SnackbarComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SnackbarComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
