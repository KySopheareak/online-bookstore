import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { KHMER_NUMBER } from './localize-pipe.pipe';
import { LANG } from '../../../models/core/lang.enum';

@Pipe({
  name: 'numberLocale',
  pure: false
})
export class NumberLocalePipe implements PipeTransform {
  static readonly MATCH = new Map([
    [LANG.KM, /[\u17E0-\u17E9]/g],
    [LANG.EN, /[0-9]/g]
  ]);

  constructor(
    private _translate: TranslateService
  ) {}

  transform(value: string | number | null, ...args: unknown[]): unknown {
    if (!value) return null;
    value = value.toString();
    if (this._translate.currentLang == LANG.KM) {
      return value.replace(NumberLocalePipe.MATCH.get(LANG.EN)!, this.transformEn);
    }
    return value.replace(NumberLocalePipe.MATCH.get(LANG.KM)!, this.transformKh);
  }

  transformKh(match: string) {
    return KHMER_NUMBER.indexOf(match).toString();
  }

  transformEn(match: string) {
    return KHMER_NUMBER[parseInt(match)];
  }

}
