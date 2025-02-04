import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  SimpleChanges,
} from '@angular/core';
import { UntypedFormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MAT_OPTION_PARENT_COMPONENT } from '@angular/material/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SelectComponent } from '../select/select.component';

@Component({
  selector: 'app-option',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './option.component.html',
  styleUrls: ['./option.component.scss'],
})
export class OptionComponent implements OnInit, OnDestroy, OnChanges {
  __value: any;
  @Input() disabled: boolean = false;
  @Input()
  set value(val: any) {
    this.__value = val;
    this.selected = this.__value == this.control.value;
    this.cdr.detectChanges();
  }
  get value() {
    return this.__value;
  }

  static nextId = 0;
  id: string;
  control: UntypedFormControl;
  selected: boolean = false;
  destroy: Subject<void> = new Subject();
  constructor(
    @Optional()
    @Inject(MAT_OPTION_PARENT_COMPONENT)
    private parent: SelectComponent,
    private el: ElementRef<HTMLElement>,
    private cdr: ChangeDetectorRef
  ) {
    this.cdr.detach();
    OptionComponent.nextId++;
    this.id =
      'nssf-option-' + SelectComponent.nextId + '-' + OptionComponent.nextId;
    this.control = this.parent.form;
  }

  ngOnInit(): void {
    this.selected = this.control.value == this.value;
    if (this.selected) {
      this.onSelected();
    }
    this.control.valueChanges
      .pipe(takeUntil(this.destroy))
      .subscribe((value) => {
        this.selected = value == this.value;
        if (this.selected) {
          this.onSelected();
        }
        this.cdr.detectChanges();
      });
  }

  onSelected(): void {
    this.parent.writeText(this.el.nativeElement.innerText);
    this.parent.selectionChange.emit(this.value);
    // this.parent.close();
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes[this.disabled as any]) {
      this.cdr.detectChanges();
    }
  }

  onContentChange(e: any): void {
    if (this.selected) {
      this.parent.writeText(e[0].target.data);
      this.cdr.detectChanges();
    }
  }

  onClick(): void {
    if (this.selected) {
      this.parent.close();
      return;
    }
    this.control.setValue(this.value);
    this.parent.selectChange.emit(this.value);
    this.parent.close();
    this.parent.trigger.elementRef.nativeElement.focus();
  }


  @HostListener('keydown', ['$event'])
          // @ts-ignore
  onkeydown(e: KeyboardEvent) {
    const target = e.target as HTMLElement;
    switch (e.code) {
      case 'ArrowDown':
        e.preventDefault();
        // @ts-ignore
        if (target.parentElement.nextElementSibling) {
          // @ts-ignore
          target.parentElement.nextElementSibling.firstChild.focus();
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        // @ts-ignore
        if (target.parentElement.previousElementSibling) {
          // @ts-ignore
          target.parentElement.previousElementSibling.firstChild.focus();
        }
        break;
      case 'Tab':
        if (e.shiftKey) {
          // @ts-ignore
          if (target.parentElement.previousElementSibling) {
            return true;
          }
          return false;
        }
        // @ts-ignore
        if (target.parentElement.nextElementSibling) {
          return true;
        }
        return false;
    }
  }
  // renders: number = 0;
  // getRenders(): number {
  //   this.renders++;
  //   return this.renders;
  // }
}
