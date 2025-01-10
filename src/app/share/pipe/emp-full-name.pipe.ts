import { User } from '../../../models/core/user';
import { Pipe, PipeTransform } from '@angular/core';
import { LANG } from '../../../models/core/lang.enum';

@Pipe({
  name: 'empFullName'
})
export class EmpFullNamePipe implements PipeTransform {

  transform(value: User, language?: LANG | string): string {
    if(value){
      let names = [];
      if(language == LANG.KM){
        if(value.last_name_en){
          names.push(value.last_name_kh);
        }

        if(value.first_name_en){
          names.push(value.first_name_kh);
        }
      }else{
        if(value.last_name_en){
          names.push(value.last_name_en);
        }

        if(value.first_name_en){
          names.push(value.first_name_en);
        }
      }

      return names.join(' ');

    }

    return '';
  }

}