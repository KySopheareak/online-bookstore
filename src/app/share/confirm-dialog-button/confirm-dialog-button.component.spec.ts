import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDialogButtonComponent } from './confirm-dialog-button.component';

describe('ConfirmDialogButtonComponent', () => {
  let component: ConfirmDialogButtonComponent;
  let fixture: ComponentFixture<ConfirmDialogButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmDialogButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmDialogButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
