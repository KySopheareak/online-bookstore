import { Component } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-book-component',
  imports: [
    CommonModule, 
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './book-component.component.html',
  styleUrl: './book-component.component.scss'
})
export class BookComponentComponent {
  data: any;

  constructor(private apiService: ApiService, private http: HttpClient) {}

  ngOnInit() {
    this.getBookList();
  }

  async getBookList() {
    this.http.get('http://localhost:3000/api/books/list').subscribe(
      (response) => {
        this.data = response
      },
      (error) => {
        console.error('Error:', error);
        alert('Unable to fetch data. Please try again later.');
      }
    );
    
  }

}
