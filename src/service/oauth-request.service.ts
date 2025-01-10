import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../environment/environment';
import { LocalStorageEnum } from '../models/enums/local-storage.enum';
import { RequestOption } from '../models/request-option';
import { RequestParam } from '../models/request-param';
import { BaseResponse } from '../models/response/base.response';
import { LoadingService } from './loading.service';
import { LocalStorageService } from './local-storage.service';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RESPONSE_STATUS } from '../models/enums/response-status.enum';

@Injectable({
  providedIn: 'root'
})
export class OauthRequestService {

  constructor(private http: HttpClient,
    private loadingService: LoadingService,
    private localStorageService: LocalStorageService,
    private router: Router,
    private snackBar: MatSnackBar,
    private translate: TranslateService
    ) {
  }

  get<T>(path: string, request: RequestParam, responseType: XMLHttpRequestResponseType = "json") {
    const url = environment.api_url + path;
    this.clean(request.data);
    if (request.option?.is_loading) {
      this.loadingService.setLoading(true);
    }
    const headers = this.getAuthHeader();
    return this.http.get<T>(url, { params: request.data, headers, responseType: responseType as any }).pipe(
      map(res => {
        if (request.option?.is_loading) {
          this.loadingService.setLoading(false);
        }
        return res;
      }),
      catchError((error) => {
        if (request.option?.is_loading) {
          this.loadingService.setLoading(false);
        }
        return throwError({ message: error.message });
      })
    );
  }

  getJSON<T>(path: string, request?: RequestParam) {
    const url = environment.api_url + path;
    this.clean(request?.data);
    if (request?.option?.is_loading) {
      this.loadingService.setLoading(true);
    }

    const headers = this.getAuthHeader();
    headers.append('Content-Type', 'application/json');
    return this.http.get<BaseResponse>(url, { params: request?.data, headers }).pipe(
      map(res => this.handleResponse<T>(res, request?.option)),
      catchError((err) => this.handleHttpError(err, request?.option))
    );
  }

  post<T>(path: string, request: RequestParam) {
    const url = environment.api_url + path;
    this.clean(request.data);
    if (request.option?.is_loading) {
      this.loadingService.setLoading(true);
    }
    const headers = this.getAuthHeader();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    request.data = this.toFormData(request.data);
    return this.http.post<BaseResponse>(url, request.data, { headers }).pipe(
      map(res => this.handleResponse<T>(res, request.option)),
      catchError((err) => this.handleHttpError(err, request.option))
    );
  }

  postJSON<T>(path: string, request: RequestParam, isSnackBar?: any) {
    const url = environment.api_url + path;
    this.clean(request.data);
    if (request.option?.is_loading) {
      this.loadingService.setLoading(true);
    }

    const headers = this.getAuthHeader(request?.data?.is_refresh_token ? true : false);
    headers.append('Content-Type', 'application/json');

    let data = request?.data?.is_refresh_token ? {} : request.data;

    return this.http.post<BaseResponse>(url, data, { headers }).pipe(
      map((res: any) => {
        this.loadingService.setLoading(false);

        if (isSnackBar) {
          this.snackBar.open(res.status === 1 ? 'ជោគជ័យ' : 'បរាជ័យ', '', { duration: 2000, horizontalPosition: 'center', panelClass: res.status === 1 ? 'panelClass-success' : 'panelClass-error' });
        }
        this.handleResponse<T>(res, request.option)
        return res;
      }),
      catchError((err) => this.handleHttpError(err, request.option))
    );
  }

  private getAuthHeader(is_refresh_token: boolean = false): HttpHeaders {
    return new HttpHeaders();
  }

  private clean(obj: any) {
    for (const propName in obj) {
      if (obj[propName] === null || obj[propName] === undefined || obj[propName] === '') {
        delete obj[propName];
      }

      if (obj[propName] == 'n/a') {
        obj[propName] = null;
      }
    }
  }

  private handleHttpError(error: HttpErrorResponse, option?: RequestOption) {
    if (option?.is_loading) {
      this.loadingService.setLoading(false);
    }
    return throwError({ message: error.message });
  }

  private handleResponse<T>(res: any, option?: RequestOption) {
    if (option?.is_loading) {
      this.loadingService.setLoading(false);
    }

    const r = res as unknown as BaseResponse;
    if (r.status === RESPONSE_STATUS.NOT_FOUND) {
      this.localStorageService.delete(LocalStorageEnum.token);
      this.router.navigate(['/']);
      throwError({ message: res.message })
    }
    else if (r.status === RESPONSE_STATUS.SUCCESS) {
      return res;
    }
    else if (r.status === RESPONSE_STATUS.ERROR_CLIENT) {
      throwError({ message: r.message, errors: r.errors });
      return res;
    }
    else if (r.status === RESPONSE_STATUS.INTERNAL_SERVER_ERROR && option?.is_login) {
      this.snackBar.open('ឈ្មោះចូលប្រព័ន្ធ ឬ ពាក្យសម្ងាត់មិនត្រឹមត្រូវ', '', { duration: 3000, horizontalPosition: 'center', panelClass: 'panelClass-error' });
    }
    else {
      if (option?.is_alert_error) {
        this.snackBar.open("ប្រព័ន្ធមានបញ្ហា", '', { duration: 3000, horizontalPosition: 'center', panelClass: 'panelClass-error' });
      }

      throwError({ message: res.message });
    }
  }

  private toFormData<T>(formValue: any) {
    const formData = new FormData();

    for (const key of Object.keys(formValue)) {
      const value = formValue[key];
      formData.append(key, value);
    }
    return formData;
  }

  get oauth_base_url() {
    let url: string = environment.api_url;
    url = url.replace('/admin/api/v1', '/nssf-oauth/api');
    return url;
  }
}
