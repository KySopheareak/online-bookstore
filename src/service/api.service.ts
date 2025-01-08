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

    public getBooklist(): Observable<CommonResponse<any>>{
      return this.requestService.get<CommonResponse<any>>(Endpoint.booklist,{
        option: {
          is_loading: true
        }
      });
    }
}
