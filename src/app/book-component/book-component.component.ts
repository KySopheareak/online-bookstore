import { Component } from '@angular/core';
import { ApiService } from '../../service/api.service';

@Component({
  selector: 'app-book-component',
  imports: [],
  templateUrl: './book-component.component.html',
  styleUrl: './book-component.component.scss'
})
export class BookComponentComponent {
  data: any;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.getBooklist().subscribe((response) => {
      console.log('RESPONSE: ', response)
      this.data = response.data;
    });
  }
}
