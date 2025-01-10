import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmoothScrollbarComponent } from './smooth-scrollbar.component';

describe('SmoothScrollbarComponent', () => {
  let component: SmoothScrollbarComponent;
  let fixture: ComponentFixture<SmoothScrollbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmoothScrollbarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmoothScrollbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
