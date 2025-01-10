import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberFormat'
})
export class NumberFormatPipe implements PipeTransform {

  transform(value: any, args: string): string {    
    if (value >= 0 && typeof(value) == 'number') {
      switch (args) {
        case 'money':
          const formatter1= new Intl.NumberFormat('en-US');
          return formatter1.format(value) + ' ៛';

        case 'money-noSign':
          const formatter2 = new Intl.NumberFormat('en-US');
          return formatter2.format(value);
        

        default:
          return '';
      }

    } return '';
  }

}
