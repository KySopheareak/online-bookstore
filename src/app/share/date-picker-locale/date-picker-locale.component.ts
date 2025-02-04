import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  UntypedFormBuilder,
  UntypedFormControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MatMomentDateModule,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import {
  MatCalendarView,
  MatDatepicker,
  MatDatepickerInputEvent,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { TranslateService } from '@ngx-translate/core';
import { Moment } from 'moment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LANG } from '../../../models/core/lang.enum';

@Component({
  selector: 'app-date-picker-locale',
  templateUrl: './date-picker-locale.component.html',
  styleUrls: ['./date-picker-locale.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'datepicker-control',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatePickerLocaleComponent),
      multi: true,
    },
    {
      provide: MAT_DATE_LOCALE,
      useValue: 'en-US',
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: {
        parse: {
          dateInput: 'DD-MM-YYYY',
        },
        display: {
          dateInput: 'DD-MMM-YYYY',
          monthYearLabel: 'YYYY',
          dateA11yLabel: 'LL',
          monthYearA11yLabel: 'YYYY',
        },
      },
    },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: DatePickerLocaleComponent,
    },
  ],
  imports: [
    CommonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatMomentDateModule,
    MatButtonModule,
    MatDatepickerModule
  ]
})
export class DatePickerLocaleComponent
  implements OnDestroy, ControlValueAccessor, Validator
{
  @Input() max?: Date | string | Moment | null = null;
  @Input() min?: Date | string | Moment | null = null;
  @Input() startView: MatCalendarView = 'month';
  @Input() filter: any;
  @Input() closeOnMonthSelected: boolean = false;
  @Input() closeOnYearSelected: boolean = false;
  @Output() yearSelected: EventEmitter<Moment> = new EventEmitter();
  @Output() monthSelected: EventEmitter<Moment> = new EventEmitter();
  @Output() dateChange: EventEmitter<MatDatepickerInputEvent<Moment>> = new EventEmitter();
  @Output() opened: EventEmitter<void> = new EventEmitter();
  @Output() closed: EventEmitter<void> = new EventEmitter();

  onTouched: Function = () => {};
  touched: boolean = false;
  private destroyed: Subject<void> = new Subject();
  control: UntypedFormControl;
  // set disabled: boolean = false;

  constructor(
    private _adapter: DateAdapter<Moment>,
    private fb: UntypedFormBuilder,
    private translateService: TranslateService,
    private cd: ChangeDetectorRef,
    @Inject(MAT_DATE_LOCALE) private _locale: string
  ) {
    this.control = this.fb.control(null);
    this._locale = this.translateService.currentLang == LANG.KM ? 'km-KH' : 'en-US';
    
    this._adapter.setLocale(this._locale);
    this.translateService.onLangChange.pipe(takeUntil(this.destroyed)).subscribe((event) => {
        this._locale = event.lang == LANG.KM ? 'km-KH' : 'en-US';
        this._adapter.setLocale(this._locale);
      });
  }

  writeValue(obj: any): void {
    if (obj) {
      this.control.setValue(obj, { emitEvent: false });
    } else {
      this.control.setValue(null, { emitEvent: false });
    }
    this.cd.markForCheck();
  }

  registerOnChange(fn: any): void {
    this.control.valueChanges.pipe(takeUntil(this.destroyed)).subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean) {
    if (disabled) {
      this.control.disable();
    } else {
      this.control.enable();
    }
    this.cd.markForCheck();
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }

  openDatePicker(datepicker: MatDatepicker<Date>): void {
    datepicker.open();
    this.opened.emit();
  }

  onCloseDate(): void {
    this.closed.emit();
    this.onTouched();
  }

  onMonthSelected(e: Moment, picker: MatDatepicker<Moment>): void {
    if (this.closeOnMonthSelected) {
      this.control.setValue(e);
      picker.close();
    }
    this.monthSelected.emit(e);
  }

  onYearSelected(e: Moment, picker: MatDatepicker<Moment>): void {
    if (this.closeOnYearSelected) {
      this.control.setValue(e);
      picker.close();
    }
    this.yearSelected.emit(e);
  }

  validate(_control: AbstractControl): ValidationErrors | null {
    if (this.control.valid) {
      return null;
    }
    return this.control.errors;
  }

  onDateChange(event: any) {
    this.dateChange.emit(event);
  }
}
