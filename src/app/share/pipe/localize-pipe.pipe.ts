import { ChangeDetectorRef, Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';
import { LANG } from '../../../models/core/lang.enum';
import { UtilService } from '../../../service/core/util.service';

// const mom = moment();
export const KHMER_NUMBER =  ["\u17E0","\u17E1","\u17E2","\u17E3","\u17E4","\u17E5","\u17E6","\u17E7","\u17E8","\u17E9"];

@Pipe({
  name: 'localizePipe',
  pure: false
})
export class LocalizePipePipe implements PipeTransform {
  value: string = '';
  lastValue: Date = new Date();
  prevLang: LANG | undefined;
  constructor(
    private util: UtilService
  ) { }

  updateValue(value: Date, template: string): void {
    this.value = moment(value).locale(this.util.currentLang).format(template)
    .replace(
      /[\u17E0-\u17E9]/g,
      function(match: string) {
        let val = KHMER_NUMBER.indexOf(match);
        return val.toString();
      }
    );
  }

  transform(value?: string | Date | number | null, template: string = "DD-MMM-yyyy"): string | null | undefined {
    if (!value) return null;
    let date = new Date(value);
    if (this.util.currentLang == this.prevLang && date.getTime() == this.lastValue.getTime()) {
      return this.value;
    }
    this.lastValue = date;
    this.prevLang = this.util.currentLang;
    this.updateValue(date, template);
    return this.value;
  }

}
