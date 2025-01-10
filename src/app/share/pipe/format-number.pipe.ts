import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatNumber'
})
export class FormatNumberPipe implements PipeTransform {

  transform(value: number, ...args: unknown[]): string | null {
    if (!value && value != 0) return null;
    return value.toLocaleString("en-US");
  }

}
