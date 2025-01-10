import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({
  name: 'typelocalizetime',
})
export class TypelocalizetimePipe implements PipeTransform {
  transform(value: any): any {
    return moment(value, 'HH:mm').locale('km').format('A');
  }
}
