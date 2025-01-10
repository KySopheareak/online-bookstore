import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'roleTranslate',
})
export class RoleTranslatePipe implements PipeTransform {
  main_permission_keys = [
    'READ',
    'CREATE',
    'REGISTER',
    'EDIT',
    'DELETE',
    'REMOVE',
    'SUBMIT',
    'VERIFY',
    'APPROVE',
    'ACCEPT',
    'RETURN',
    'REJECT',
    'DISABLE',
    'TOPUP',
    'ALLOCATE',
  ];

  /**
   * @description While key exist in 'main_permission_keys',
   * you can make exception here to show different translation.
   */
  exceptions = [
    "ALLOW_DOWNLOAD_WORK_ACTIVITY_REQ",
  ];

  transform(value: string): string {
    let result = this.main_permission_keys.find((key: string) => value.includes(key));
    let exception = this.exceptions.find((key: string) => value.includes(key));

    return `${exception || result || value}`;
  }
}
