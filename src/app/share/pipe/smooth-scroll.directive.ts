import { AfterViewInit, Directive, ElementRef, OnDestroy, Output, EventEmitter, NgZone, Input } from '@angular/core';
import SmoothScrollbar from 'smooth-scrollbar';
import { Data2d, ScrollbarOptions, ScrollListener, ScrollStatus } from 'smooth-scrollbar/interfaces';
import { Scrollbar } from 'smooth-scrollbar/scrollbar';

export class ScrollingEvent implements ScrollStatus {
  offset: Data2d;
  limit: Data2d;
  smoothScrollRef: SmoothScrollbar;
  constructor(scrollRef: SmoothScrollbar, scrollStatus: ScrollStatus) {
    this.offset = scrollStatus.offset;
    this.limit = scrollStatus.limit;
    this.smoothScrollRef = scrollRef;
  }

  prevent() {
    this.smoothScrollRef.setMomentum(0, 0);
  }
}

@Directive({
  selector: '[appSmoothScroll]',
  exportAs: 'smoothScroll'
})
export class SmoothScrollDirective implements AfterViewInit, OnDestroy {
  @Input() removeTrack = false;
  @Input() damping?: number;
  smoothScrollRef!: Scrollbar;
  /**
   * @deprecated
   */
  @Output() smoothscroll: EventEmitter<ScrollStatus> = new EventEmitter<ScrollStatus>();
  @Output() scrolling = new EventEmitter<ScrollingEvent>();
  @Output() initScroll = new EventEmitter<SmoothScrollbar>();
  constructor(
    private el: ElementRef,
    private _ngZone: NgZone
  ) {
  }

  onScroll = (scrollStatus: ScrollStatus) => {
    this.updateContinuosScrolling();
    this.smoothscroll.emit(scrollStatus);
    const event = new ScrollingEvent(this.smoothScrollRef, scrollStatus);
    this.scrolling.emit(event);
  }

  ngAfterViewInit(): void {
    this._ngZone.runOutsideAngular(() => {
      this.smoothScrollRef = SmoothScrollbar.init(this.el.nativeElement, { alwaysShowTracks: false, damping: this.damping });
      if (this.removeTrack) {
        this.smoothScrollRef.containerEl.children[2].remove();
      }
      this.initScroll.emit(this.smoothScrollRef);
      this.updateContinuosScrolling();
      this.smoothScrollRef.addListener(this.onScroll);
    });
  }

  updateContinuosScrolling(): void {
    const isScroll = this.el.nativeElement.clientWidth < this.el.nativeElement.scrollWidth || this.el.nativeElement.clientHeight < this.el.nativeElement.scrollHeight;
    this.smoothScrollRef.options.continuousScrolling = !isScroll;
  }

  ngOnDestroy(): void {
    this._ngZone.runOutsideAngular(() => {
      this.smoothScrollRef.removeListener(this.onScroll);
      this.smoothScrollRef.destroy();
    })
  }

}
