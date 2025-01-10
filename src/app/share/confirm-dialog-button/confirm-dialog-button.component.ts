import { Component, Inject, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { REJECT_TYPE } from '../../../models/enums/reject_type.enum';
import { STATUS } from '../../../models/enums/status.enum';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';

export enum RejectStatus {
  PHOTO = 'PHOTO', // 2
  IDCARD = 'IDCARD', // 3
  PHOTO_IDCARD = 'PHOTO_IDCARD', // 1
  DENIED = 'DENIED', // 4
}

@Component({
  selector: 'app-confirm-dialog-button',
  templateUrl: './confirm-dialog-button.component.html',
  styleUrls: ['./confirm-dialog-button.component.scss'],
  imports: [
    CommonModule,
    TranslateModule,
    MatDialogModule,
    MatIconModule
  ]
})
export class ConfirmDialogButtonComponent implements OnInit {
  title: string = '';
  confirm_desc: string = '';
  confirm_desc_param: string = '';
  confirm_type: string = '';
  CONFIRM_TYPE_ADVANCE: string = CONFIRM_TYPE.ADVANCE;
  CONFIRM_TYPE_NORMAL: string = CONFIRM_TYPE.NORMAL;
  formDataGroup: UntypedFormGroup;
  favorite_reject_type: string = '';
  is_no_action: boolean = false;

  STATUS: any = STATUS;
  REJECT_TYPE: any = REJECT_TYPE;

  member_photo: boolean = false;
  idcard_photo: boolean = false;

  rejectData: any;

  constructor(
    private formBuilder: UntypedFormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.title = this.data.title;
    this.confirm_desc = this.data.confirm_desc;
    this.confirm_desc_param = this.data.confirm_desc_param;
    this.confirm_type = this.data.confirm_type;
    this.is_no_action = this.data.is_no_action;
    this.formDataGroup = this.formBuilder.group({
      reason: [
        '',
        this.data.is_reject && this.favorite_reject_type == REJECT_TYPE.REJECT
          ? Validators.required
          : '',
      ],
      reject_option: ['', this.data.is_reject ? Validators.required : null],
    });
  }

  ngOnInit(): void {}
}

export enum CONFIRM_TYPE {
  ADVANCE = 'ADVANCE',
  NORMAL = 'NORMAL',
}
