import { Pipe, PipeTransform } from '@angular/core';
import { LANG } from '../../../models/core/lang.enum';

@Pipe({
  name: 'translateObject',
})
export class TranslateObjectPipe implements PipeTransform {
  transform(
    value: any,
    lang: LANG = LANG.KM,
    kh: string = 'name_kh',
    en: string = 'name_en'
  ): string | null {
    if (value == null) {
      return null;
    }

    if (lang === LANG.KM && value[kh]) {
      return value[kh];
    } else if (lang === LANG.EN && value[en]) {
      return value[en];
    } else {
      return value[en] || value[kh] || null;
    }
  }
}
