import { DOCUMENT } from '@angular/common';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../environment/environment';
import { OauthRequestService } from './oauth-request.service';
import * as CryptoJS from 'crypto-js';
import { RequestOption } from '../models/request-option';
import { LoadingService } from './loading.service';
import { SingleSignOnService } from './single-sign-on.service';


@Injectable({
  providedIn: 'root'
})
export class OauthService {

  constructor(private http: HttpClient,
    private singleSignOnService: SingleSignOnService,
    private snackBar: MatSnackBar,
    private oauthRequestService: OauthRequestService,
    private loadingService: LoadingService,
    @Inject(DOCUMENT) private document: Document) {
  }

  /**
   * Get token
   * @param code
   * @param scope
   * @param session_state
   * @returns
   */
  // authClient<T>(request: RequestParam): Observable<T> {
  //   let options = {
  //     headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
  //   };

  //   return this.http.post<T>(`${environment.NSSF_AUTH_URL}/connect/token`, new URLSearchParams(request.data).toString(), options).pipe(
  //     map(res => this.handleResponse<T>(res, request.option)),
  //     catchError((err) => this.handleHttpError(err, request.option))
  //   );
  // }

  /**
   * Get user profile
   * @param token_id
   * @returns
   */
  getUserProfile<T>(access_token: string): Observable<T> {
    let data: any = {
      access_token: access_token
    };

    return this.oauthRequestService.postJSON<T>('/userinfo', {
      data,
      option: {
        is_loading: true,
        is_alert_error: true
      }
    }).pipe(map((res: any) => {
      if (res) {
        if (res.status === 1) {
          this.snackBar.open(res.status === 1 ? 'ជោគជ័យ' : 'បរាជ័យ', '', { duration: 1000, horizontalPosition: 'center', panelClass: 'panelClass-success' });
        }
        return res;
      } else {
        this.snackBar.open('បរាជ័យ', '', { duration: 1000, horizontalPosition: 'center', panelClass: 'panelClass-error' });
      }
    }));
  }

  /**
   * Convert hash to base64URL
   * @param code
   * @returns
   */
  base64URL(code: any) {
    return code.toString(CryptoJS.enc.Base64).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  }

  /**
   * Handle oauth response
   * @param res
   * @param option
   * @returns
   */
  private handleResponse<T>(res: any, option?: RequestOption) {
    if (option?.is_loading) {
      this.loadingService.setLoading(false);
    }

    if (!res.error) {
      return res;
    }
    else {
      if (option?.is_alert_error) {
        this.singleSignOnService.onLoginFailed();
      }

      throwError({ message: res.message });
    }
  }

  /**
   * Handle oauth error response
   * @param error
   * @param option
   * @returns
   */
  private handleHttpError(error: HttpErrorResponse, option?: RequestOption) {
    if (option?.is_loading) {
      this.loadingService.setLoading(false);
    }
    return throwError({ message: error.message });
  }
}
