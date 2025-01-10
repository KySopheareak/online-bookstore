import { trigger, transition, style, animate } from '@angular/animations';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, NgZone, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { delay } from 'rxjs/operators';
import SmoothScrollbar from 'smooth-scrollbar';
import { ScrollStatus } from 'smooth-scrollbar/interfaces';
import { MenuItem } from '../../models/core/menu-item';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-nav-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.scss'],
  animations: [
    trigger('subItem', [
			transition(":enter", [
				style({ transform: 'translateX(-50px)', opacity: 0, height: 0 }),
				animate('.2s ease', style({ transform: 'translateX(0px)', opacity: 1, height: '*' }))
			]),
			transition(":leave", [
				animate('.2s ease', style({ transform: 'translateX(-50px)', opacity: 0, height: 0 }))
			])
		])
  ],
  imports: [
    CommonModule,
    TranslateModule,
    MatListModule,
    MatTooltipModule,
    RouterModule,
    MatIconModule
  ]
})
export class NavMenuComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() isMenuIcon?: boolean;
  @Input() isHandset?: boolean;
  @Input() isTablet?: boolean;
  @Input() menu: MenuItem[] = new Array();
  @Output() menuClick: EventEmitter<void> = new EventEmitter();
  @Output() scrollbar: EventEmitter<ScrollStatus> = new EventEmitter();

  constructor(
    private el: ElementRef,
    private cd: ChangeDetectorRef,
    private _ngZone: NgZone,
    private translateService: TranslateService
  ) {
    this.cd.detach();
    this.translateService.onLangChange.pipe(delay(0)).subscribe(() => {
      this.cd.detectChanges();
    });
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    // if (changes.isMenuIcon && changes.isMenuIcon.currentValue) {
    //   this.cd.reattach();
    // } else {
    //   this.cd.detach();
    // }
    // if (changes.menu) {
    //   this.cd.detectChanges();
    // }
    // if (changes.isMenuIcon || changes.isTablet || changes.isHandset) {
    //   this.cd.detectChanges();
    // }
  }

  onClickMenu(): void {
    this.menuClick.emit();
  }

  ngAfterViewInit(): void {
    this._ngZone.runOutsideAngular(() => SmoothScrollbar.init(this.el.nativeElement))
    .addListener((e) => {
      this.scrollbar.emit(e);
    })
  }

  toggleExpendMenu(menu: MenuItem): void {
    menu.expanded = !menu.expanded;
    this.cd.detectChanges();
  }

}
