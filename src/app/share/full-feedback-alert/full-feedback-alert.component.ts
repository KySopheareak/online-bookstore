import { TextFieldModule } from '@angular/cdk/text-field';
import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, TemplateRef } from '@angular/core';
import { AbstractControl, FormControl, ReactiveFormsModule, UntypedFormArray, UntypedFormControl, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { lastValueFrom } from 'rxjs';
import { FullFeedbackAlertType } from '../../../models/enums/full-feedback-alert-type';
import { LocalStorageService } from '../../../service/local-storage.service';

export interface FullFeedbackAlertData {
  type: FullFeedbackAlertType,
  title: string,
  messages: string[],
  notify?: boolean,
  confirm?: boolean,
  positive?: string,
  positiveIcon?: string,
  negative?: string,
  negativeIcon?: string,
  requiredReason?: boolean,
  reasonLabel?: string
  template?: TemplateRef<any>,
  form?: AbstractControl,
  date?: any,
  error_msg?: any,
  resetContribute?: any,
  order_nums?: any,
  [key: string]: any
}

@Component({
  selector: 'app-full-feedback-alert',
  templateUrl: './full-feedback-alert.component.html',
  styleUrls: ['./full-feedback-alert.component.scss'],
  imports: [
    CommonModule,
    TranslateModule,
    MatIconModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    TextFieldModule,
  ]
})
export class FullFeedbackAlertComponent implements OnInit {

  descriprion!: UntypedFormControl;
  conOrderNum!: UntypedFormControl;
  form?: AbstractControl;

  readonly TYPE = FullFeedbackAlertType; // FOR NO MODIFY TO THE ENUM

  constructor(
    private localStorage: LocalStorageService,
    private dialogRef: MatDialogRef<FullFeedbackAlertComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FullFeedbackAlertData
  ) {
    if (this.data.requiredReason) {
      this.descriprion = new UntypedFormControl(null, Validators.required);
    }

    if (this.data.resetContribute) {
      this.conOrderNum = new UntypedFormControl(null, Validators.required);
    }

    // if (this.data.form) {
    //   this.form = this.data.form as UntypedFormArray;

    //   const permissions = this.localStorage.getDecryption(LocalStorageEnum.permissions)!.split(",");
    //   if (this.data.isDependentType || permissions.includes(PERMISSION.ALLOW_EDIT_WITHOUT_ATTACHMENT)) {
    //     this.form.clearValidators();
    //     this.form.updateValueAndValidity();
    //   }
    // }
  }

  ngOnInit(): void {
    this.initialize();
  }

  onSubmit() {
    if (this.descriprion?.invalid) {
      this.descriprion?.markAllAsTouched()
    } else {
      this.dialogRef.close(this.descriprion?.value);
    }
  }

  onSubmitJsonResetContribute() {
    if (this.conOrderNum?.invalid && this.data.order_nums.length > 1) {
      this.conOrderNum?.markAllAsTouched()
    } else {
      let index = this.conOrderNum?.value;
      this.dialogRef.close(index ? index : 1);
    }
  }

  async initialize(): Promise<void> {
    this.dialogRef.addPanelClass(['animate__animated', 'animate__slideInUp', 'animate__faster']);
    await lastValueFrom(this.dialogRef.beforeClosed());
    this.dialogRef.removePanelClass(['animate__animated', 'animate__slideInUp', 'animate__faster']);
    this.dialogRef.addPanelClass(['animate__animated', 'animate__fadeOutDown', 'animate__faster']);
  }
}
