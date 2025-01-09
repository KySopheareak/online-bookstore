import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormsModule, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { RESPONSE_STATUS } from '../../models/enums/response-status.enum';

@Component({
  selector: 'app-book-component',
  imports: [
    CommonModule, 
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    ReactiveFormsModule
  ],
  templateUrl: './book-component.component.html',
  styleUrl: './book-component.component.scss'
})
export class BookComponentComponent implements OnInit {
  data!: any;
  form!: FormGroup;
  displayedColumns: string[] = ['id', 'title', 'generation', 'rating'];
  dataSource: any = new MatTableDataSource(this.data);

  constructor(private apiService: ApiService, private http: HttpClient) {
    this.form = new UntypedFormGroup({
      search: new UntypedFormControl(''),
    });
  }

  ngOnInit() {
    this.getBookList();
  }

  async getBookList(title?: any) {
    let dataJson = {
      title: title
    }
    try {
      this.apiService.getBooklist(dataJson).subscribe(res => {
        if(res.status !== RESPONSE_STATUS.SUCCESS){
          return;
        }
        this.data = res.data;
        this.dataSource = new MatTableDataSource(this.data);
      })
    } catch (error){
      console.log('ERROR: ', error)
    }
  }

  onSearch() {
    const value = this.form?.value?.search;
    this.getBookList(value);
  }

  onReset() {
    this.form.controls['search'].reset();
    this.getBookList();
  }

}
