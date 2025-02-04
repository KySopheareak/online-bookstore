import { CdkOverlayOrigin, FullscreenOverlayContainer, OverlayContainer, OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MAT_OPTION_PARENT_COMPONENT } from '@angular/material/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ScrollStatus } from 'smooth-scrollbar/interfaces';
import { SmoothScrollDirective } from '../pipe/smooth-scroll.directive';
import { NG_VALUE_ACCESSOR, ReactiveFormsModule, ControlValueAccessor, UntypedFormControl, UntypedFormBuilder } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

/**
 * null value will emit search event
 */
@Component({
  selector: 'app-select',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  providers: [
    {
      provide: MAT_OPTION_PARENT_COMPONENT,
      useExisting: SelectComponent,
    },
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: SelectComponent,
    },
    {
      provide: OverlayContainer, 
      useClass: FullscreenOverlayContainer
    }
  ],
  host: {
    class: 'app-select',
    'aria-expanded': 'false',
  },
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    SmoothScrollDirective,
    OverlayModule 
  ]
})
export class SelectComponent
  implements OnInit, OnDestroy, OnChanges, ControlValueAccessor
{
  private __searchPlaceholder?: string;
  @Input()
  set searchPlaceholder(text: string) {
    this.__searchPlaceholder = text;
    this.cdr.detectChanges();
  }
  get searchPlaceholder(): string {
    return this.__searchPlaceholder!;
  }

  @Input() enableSearch?: boolean;
  @Input() value: any;
  @Input() label?: string;
  @Input() no_border?: boolean = false;

  isSubmittedSearchLastValue: boolean = false;

  @Input() disabled?: boolean;
  @Input() readonly?: boolean;

  @Output() textSearchChange: EventEmitter<string> = new EventEmitter();
  @Output() listScroll: EventEmitter<ScrollStatus> = new EventEmitter();
  @Output() searchSubmit: EventEmitter<string> = new EventEmitter();
  @Output() selectionChange: EventEmitter<any> = new EventEmitter();
  @Output() selectChange = new EventEmitter<any>();

  // @ts-ignore
  @ViewChild('listElement') listElement: ElementRef<HTMLElement>;
  // @ts-ignore

  @ViewChild('trigger') trigger: CdkOverlayOrigin;

  @ViewChild('listContainer') listContain!: SmoothScrollDirective;

  // @ViewChild("trigger") trigger!: CdkOverlayOrigin;

  valueText: string | null = null;
  static nextId = 0;
  form: UntypedFormControl;
  search: UntypedFormControl;
  destroy: Subject<void> = new Subject();
  onTouched: Function = () => {};
  touched: boolean = false;
  _opened: boolean = false;

  set opened(value: boolean) {
    this._opened = value;
  }

  get opened() {
    return this._opened;
  }

  id: number;

  constructor(private cdr: ChangeDetectorRef, private fb: UntypedFormBuilder) {
    // this.cdr.detach();
    this.id = ++SelectComponent.nextId;
    this.form = this.fb.control(null);
    this.search = this.fb.control(null);
  }

  ngOnInit(): void {
    this.search.valueChanges
      .pipe(takeUntil(this.destroy))
      .subscribe((value) => {
        this.isSubmittedSearchLastValue = false;
        this.textSearchChange.emit(value);
        if (!value) {
          this.searchSubmit.emit();
          this.isSubmittedSearchLastValue = true;
        }
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes[this.value] &&
      (changes[this.value].currentValue || changes[this.value].currentValue == 0)
    ) {
      this.form.setValue(changes[this.value].currentValue);
    }
    if (changes[this.label as string] || changes[this.disabled as any] || changes[this.readonly as any]) {
      this.cdr.detectChanges();
    }
  }

  writeValue(obj: any): void {
    if (!obj) {
      this.writeText(null);
    }
    if (obj === null) {
      this.search.reset('');
    }
    this.form.setValue(obj);
    this.cdr.detectChanges();
  }

  writeText(text: string | null): void {
    this.valueText = text;
    this.cdr.detectChanges();
  }

  registerOnChange(fn: any): void {
    this.form.valueChanges.pipe(takeUntil(this.destroy)).subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

  onListScroll(e: any): void {
    this.listScroll.emit(e);
  }

  onSearchSubmit(e: Event): void {
    e.preventDefault();
    if (this.isSubmittedSearchLastValue) {
      return;
    }
    this.isSubmittedSearchLastValue = true;
    this.searchSubmit.emit(this.search.value);
  }

  onSearchBlur(e: Event): void {
    e.preventDefault();
    if (this.search.value === null || this.isSubmittedSearchLastValue) return;
    this.searchSubmit.emit(this.search.value);
    this.isSubmittedSearchLastValue = true;
  }

  toggle(): void {
    this.opened = true;
    this.cdr.detectChanges();
    if (this.listContain?.smoothScrollRef.contentEl.firstChild) {
      // @ts-ignore
      this.listContain.smoothScrollRef.contentEl.firstChild?.firstChild?.focus();
    }
  }

  @HostListener('window:keydown', ['$event'])
  onwindowkeydown(e: KeyboardEvent) {
    if (this.opened && e.code === 'Escape') {
      e.preventDefault();
      this.opened = false;
      this.cdr.detectChanges();
      this.trigger.elementRef.nativeElement.focus();
    }
  }

  close(): void {
    this.opened = false;
    this.onTouched();
    this.cdr.detectChanges();
  }
}
