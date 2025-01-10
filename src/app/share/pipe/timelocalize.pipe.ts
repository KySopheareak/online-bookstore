import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'timelocalize',
})
export class TimelocalizePipe implements PipeTransform {
  transform(value: any): any {
    return moment(value, 'HH:mm').locale('en').format('hh:mm');
  }
}
