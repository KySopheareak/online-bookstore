import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home-component',
  imports: [ RouterOutlet, RouterLink, RouterLinkActive, MatIconModule],
  templateUrl: './home-component.component.html',
  styleUrl: './home-component.component.scss',
})
export class HomeComponentComponent {

}
