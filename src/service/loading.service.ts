import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  isLoading = false;
  loadingEventEmitter: EventEmitter<boolean> = new EventEmitter();
  private _tasks = 0;

  constructor() { }

  setLoading(isLoading: boolean) {
    if (isLoading) {
      this._tasks++;
    } else {
      if (this._tasks > 0) {
        this._tasks--;
      }
    }
    isLoading = this._tasks > 0;
    this.loadingEventEmitter.emit(isLoading);
  }

  // forceStop() {
  //   this.counter = 0;
  //   this.isLoading = false;
  //   this.loadingEventEmitter.emit(this.isLoading);
  // }
}
