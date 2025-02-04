import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-empty-list',
  templateUrl: './empty-list.component.html',
  styleUrls: ['./empty-list.component.scss'],
  imports: [
    CommonModule,
    MatIconModule,
    TranslateModule
  ]
})
export class EmptyListComponent implements OnInit {
  @Input() length!: number;
  @Input() isEmpty: boolean = true;
  loading: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}
