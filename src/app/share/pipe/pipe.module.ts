import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocalizePipePipe } from './localize-pipe.pipe';
import { FromNowPipe } from './from-now.pipe';
import { FormatNumberPipe } from './format-number.pipe';
import { NumberFormatPipe } from './number-format.pipe';
import { NumberLocalePipe } from './number-locale.pipe';
import { EmpFullNamePipe } from './emp-full-name.pipe';
import { RoleTranslatePipe } from './role-translate.pipe';
import { TranslateObjectPipe } from './translate-object.pipe';
import { FilterPipe } from './filter.pipe';
import { LocalizeTimePipe } from './localize-time.pipe';
import { TimelocalizePipe } from './timelocalize.pipe';
import { TypelocalizetimePipe } from './typelocalizetime.pipe';

@NgModule({
  declarations: [
    // LocalizePipePipe,
    // FromNowPipe,
    // FormatNumberPipe,
    // NumberLocalePipe,
    // EmpFullNamePipe,
    // RoleTranslatePipe,
    // TranslateObjectPipe,
    // FilterPipe,
    // LocalizeTimePipe,
    // TimelocalizePipe,
    // TypelocalizetimePipe,
  ],
  imports: [CommonModule],
  exports: [
    // LocalizePipePipe,
    // FormatNumberPipe,
    // FromNowPipe,
    // NumberLocalePipe,
    // EmpFullNamePipe,
    // RoleTranslatePipe,
    // TranslateObjectPipe,
    // FilterPipe,
    // LocalizeTimePipe,
    // TimelocalizePipe,
    // TypelocalizetimePipe,
  ],
})
export class PipeModule {}
