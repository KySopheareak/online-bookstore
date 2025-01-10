import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-localize-snackbar',
  templateUrl: './localize-snackbar.component.html',
  styleUrls: ['./localize-snackbar.component.scss'],
  imports: [
    CommonModule,
    TranslateModule
  ]
})
export class LocalizeSnackbarComponent implements OnInit {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: { msg: string }) {}

  ngOnInit(): void {}
}
