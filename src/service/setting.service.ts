import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RequestService } from './request.service';
import { CommonResponse } from '../models/response/common-response';

enum Endpoint {
  category = '/category-list'
}

@Injectable({
  providedIn: 'root'
})

export class SettingService {
  constructor(private requestService: RequestService) { }

    public getCategoryList(data: any): Observable<CommonResponse<any>>{
      return this.requestService.postJSON<CommonResponse<any>>(Endpoint.category,{
        data,
        option: {
          is_loading: true
        }
      });
    }
}
