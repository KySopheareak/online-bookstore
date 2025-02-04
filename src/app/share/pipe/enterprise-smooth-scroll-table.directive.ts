import { AfterViewInit, ChangeDetectorRef, Directive, ElementRef, Host, HostListener, Input, NgZone, OnDestroy, OnInit, Output } from '@angular/core';
import { fromEvent, lastValueFrom, Subject, Subscription, takeUntil, timer } from 'rxjs';
import SmoothScrollbar from 'smooth-scrollbar';
import { ScrollListener, ScrollStatus } from 'smooth-scrollbar/interfaces';
import { UtilService } from '../../../service/core/util.service';

@Directive({
  selector: '[appEnterpriseSmoothScrollTable]',
})
export class EnterpriseSmoothScrollTableDirective implements AfterViewInit, OnInit, OnDestroy {
  smoothScroll!: SmoothScrollbar;
  @Input() damping = 0.3;
  private _destroyed = new Subject<void>();

  constructor(
    private el: ElementRef<HTMLElement>,
    private _ngZone: NgZone,
    private _utilService: UtilService,
    private _cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this._utilService.menuChange.pipe(takeUntil(this._destroyed))
    .subscribe(_ev => {
      timer(280).subscribe(() => {
        // @ts-ignore
        this.onScroll(this.smoothScroll);
      });
    });
  }

  onScroll: ScrollListener = (scroll: ScrollStatus): void => {
    const stickyElements = Array.from(this.el.nativeElement.querySelectorAll<HTMLElement>('.sticky-right'));
    const stickyLeftElements = Array.from(this.el.nativeElement.querySelectorAll<HTMLElement>('.sticky-left'));
    for (const stickyElement of stickyElements) {
      if (stickyElement.classList.contains('mat-mdc-table-sticky')) {
        stickyElement.classList.remove('mat-mdc-table-sticky');
      }
      const x = scroll.offset.x - scroll.limit.x;
      stickyElement.style.transform = this._getTranslate(x);
    }
    for (const stickyLeftElement of stickyLeftElements) {
      if (stickyLeftElement.classList.contains('mat-mdc-table-sticky')) {
        stickyLeftElement.classList.remove('mat-mdc-table-sticky');
      }
      stickyLeftElement.style.transform = this._getTranslate(scroll.offset.x);
    }
  }

  private _getTranslate(x: number): string {
    return "translate3d(" + x + "px, 0px, 0px)";
  }

  @HostListener("window:resize", ["$event"])
  onResize(_e: Event) {
    this.update();
  }

  ngAfterViewInit(): void {
    this._ngZone.runOutsideAngular(() => {
      this.smoothScroll = SmoothScrollbar.init(this.el.nativeElement, { continuousScrolling: true, damping: this.damping, renderByPixels: false });
      this.smoothScroll.addListener(this.onScroll);
      this._cd.markForCheck();
    });
    fromEvent<WheelEvent>(this.el.nativeElement, "wheel", {
      passive: false
    }).pipe(takeUntil(this._destroyed))
    .subscribe(event => {
      if (event.shiftKey) {
        event.preventDefault();
        // @ts-ignore
        const move = this.smoothScroll.scrollLeft - (event.wheelDelta / Math.abs(event.wheelDelta) * 40);
        this._ngZone.runOutsideAngular(() => {
          this.smoothScroll.setPosition(move);
        });
      }
    });
  }

  public async update(duration = 250) {
    this._ngZone.runOutsideAngular(() => {
      this.smoothScroll.update();
      this.smoothScroll.scrollTo(0, 0, duration);
      const stickyElements = Array.from(this.el.nativeElement.querySelectorAll<HTMLElement>('.sticky-right, .sticky-left'));
      for (const stickyElement of stickyElements) {
        stickyElement.style.transform = "";
      }
      this._cd.markForCheck();
    });

    await lastValueFrom(timer(duration));

    // @ts-ignore
    this.onScroll(this.smoothScroll);
  }

  ngOnDestroy(): void {
    this._ngZone.runOutsideAngular(() => {
      this.smoothScroll.removeListener(this.onScroll);
      this.smoothScroll.destroy();
    });
    this._destroyed.next();
    this._destroyed.complete();
  }

}
