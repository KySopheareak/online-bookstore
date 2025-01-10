import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, Output, EventEmitter, NgZone } from '@angular/core';
import SmoothScrollbar from 'smooth-scrollbar';
import { ScrollStatus } from 'smooth-scrollbar/interfaces';

@Component({
  selector: 'app-smooth-scrollbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './smooth-scrollbar.component.html',
  styleUrls: ['./smooth-scrollbar.component.scss']
})
export class SmoothScrollbarComponent implements OnInit, AfterViewInit {

  @Output() smoothScroll = new EventEmitter<ScrollStatus>();
  @Output() scrollLoaded = new EventEmitter<SmoothScrollbar>();

  // private scrollRef!: SmoothScrollbar;

  constructor(
    private el: ElementRef,
    private _ngZone: NgZone,
    private cd: ChangeDetectorRef
  ) {
    this.cd.detach();
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    const scrollRef = this._ngZone.runOutsideAngular(() => SmoothScrollbar.init(this.el.nativeElement));
    this.scrollLoaded.emit(scrollRef);
    scrollRef.addListener(status => {
      this.smoothScroll.emit(status);
    });
  }

}
