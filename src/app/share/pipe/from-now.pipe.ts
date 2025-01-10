import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';
import { UtilService } from '../../../service/core/util.service';


@Pipe({
  name: 'fromNow',
  pure: false
})
export class FromNowPipe implements PipeTransform {
  constructor(
    private util: UtilService,
  ) {
  }

  transform(value: Date | string, noSuffix: boolean): unknown {
    return moment(value).locale(this.util.currentLang).fromNow(noSuffix);
  }

}
