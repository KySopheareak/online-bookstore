import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RequestService } from './request.service';
import { CommonResponse } from '../models/response/common-response';

enum Endpoint {
  booklist = '/books/list'
}

@Injectable({
  providedIn: 'root'
})

export class ApiService {
  constructor(private requestService: RequestService) { }

    public getBooklist(data: any): Observable<CommonResponse<any>>{
      return this.requestService.postJSON<CommonResponse<any>>(Endpoint.booklist,{
        data,
        option: {
          is_loading: true
        }
      });
    }
}
