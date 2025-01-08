import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'app-snackbar-component',
  imports: [CommonModule, TranslateModule],
  templateUrl: './snackbar-component.component.html',
  styleUrl: './snackbar-component.component.scss'
})
export class SnackbarComponentComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: { msg: string }) {}

  ngOnInit(): void {}
}
