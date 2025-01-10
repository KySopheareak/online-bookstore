import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

    transform(data: any[], args?: Object): any[] {
    if (!data || !args) {
      return data;
    }

    const keys = Object.keys(args)[0];
    const values = Object.values(args)[0];

    if (Array.isArray(values)) {
      return data.filter(item => values.includes(item[keys]));

    } else return data.filter(item => item[keys] == values);
  }

}
