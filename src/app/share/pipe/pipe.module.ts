import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmpFullNamePipe } from './emp-full-name.pipe';
import { FilterPipe } from './filter.pipe';
import { FormatNumberPipe } from './format-number.pipe';
import { FromNowPipe } from './from-now.pipe';
import { LocalizePipePipe } from './localize-pipe.pipe';
import { LocalizeTimePipe } from './localize-time.pipe';
import { NumberLocalePipe } from './number-locale.pipe';
import { RoleTranslatePipe } from './role-translate.pipe';
import { TimelocalizePipe } from './timelocalize.pipe';
import { TranslateObjectPipe } from './translate-object.pipe';
import { TypelocalizetimePipe } from './typelocalizetime.pipe';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    LocalizePipePipe,
    FromNowPipe,
    FormatNumberPipe,
    NumberLocalePipe,
    EmpFullNamePipe,
    RoleTranslatePipe,
    TranslateObjectPipe,
    FilterPipe,
    LocalizeTimePipe,
    TimelocalizePipe,
    TypelocalizetimePipe
  ],
  exports: [
    LocalizePipePipe,
    FormatNumberPipe,
    FromNowPipe,
    NumberLocalePipe,
    EmpFullNamePipe,
    RoleTranslatePipe,
    TranslateObjectPipe,
    FilterPipe,
    LocalizeTimePipe,
    TimelocalizePipe,
    TypelocalizetimePipe,
  ],
})
export class PipeModule {}
