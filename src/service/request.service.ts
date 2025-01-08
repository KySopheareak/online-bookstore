import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { environment } from '../environment/environment';
import { LocalStorageEnum } from '../models/enums/local-storage.enum';
import { RequestOption } from '../models/request-option';
import { RequestParam } from '../models/request-param';
import { BaseResponse } from '../models/response/base.response';
import { LoadingService } from './loading.service';
import { LocalStorageService } from './local-storage.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RESPONSE_STATUS } from '../models/enums/response-status.enum';
// import { OauthService } from './oauth.service';
// import { TranslateService } from '@ngx-translate/core';
import { CommonResponse } from '../models/response/common-response';
import { SnackbarComponentComponent } from '../app/share/snackbar-component/snackbar-component.component';
import { HttpClient, HttpErrorResponse, HttpEventType, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class RequestService {

    constructor(
        private http: HttpClient,
        private loadingService: LoadingService,
        private localStorageService: LocalStorageService,
        // private oauthService: OauthService,
        private router: Router,
        private snackBar: MatSnackBar,
        // private tr: TranslateService
    ) { }

    get<T>(path: string, request: RequestParam, responseType: XMLHttpRequestResponseType = "json") {
        const url = environment.api_url + path;
        this.clean(request.data);
        if (request.option?.is_loading) {
            this.loadingService.setLoading(true);
        }
        const headers = this.getAuthHeader();
        return this.http.get<T>(url, { params: request.data, headers, responseType: responseType as any }).pipe(
            map(res => {
                if (res instanceof Blob) {
                    return res;
                }
                return this.handleResponse(res, request.option)
            }),
            catchError((error) => {
                return throwError(() => ({ message: error.message }));
            }),
            finalize(() => {
                if (request.option?.is_loading) {
                    this.loadingService.setLoading(false);
                }
            })
        );
    }

    postAny<T>(path: string, options: {
        option: any,
        request: RequestParam
    } = { option: {}, request: {} }) {
        const url = environment.api_url + path;
        this.clean(options.request.data);
        if (options.request.option?.is_loading) {
            this.loadingService.setLoading(true);
        }
        const headers = this.getAuthHeader();
        if (options.option.contentType) {
            headers.append("Content-Type", options.option.contentType);
        }
        return this.http.post<T>(url, options.request.data, Object.assign({ headers }, options.option)).pipe(
            map(res => {
                if (res instanceof Blob) {
                    if (options.request.option?.is_loading) {
                        this.loadingService.setLoading(false);
                    }
                    return res;
                }
                return this.handleResponse(res, options.request.option);
            }),
            catchError(err => {
                return throwError(() => ({ message: err.message }));
            }),
            finalize(() => {
                if (options.request.option?.is_loading) {
                    this.loadingService.setLoading(false);
                }
            })
        )
    }

    getJSON<T = CommonResponse<any>>(path: string, request?: RequestParam): Observable<CommonResponse<T>> {
        const url = environment.api_url + path;
        this.clean(request?.data);
        if (request?.option?.is_loading) {
            this.loadingService.setLoading(true);
        }
        const headers = this.getAuthHeader();
        headers.append('Content-Type', 'application/json');
        return this.http.get<CommonResponse<T>>(url, { params: request?.data, headers }).pipe(
            map(res => this.handleResponse<T>(res, request?.option)),
            catchError((err) => this.handleHttpError(err, request?.option)),
            finalize(() => {
                if (request?.option?.is_loading) {
                    this.loadingService.setLoading(false);
                }
            })
        );
    }

    post<T>(path: string, request: RequestParam, responseType: XMLHttpRequestResponseType = "json") {
        const url = environment.api_url + path;
        this.clean(request.data);
        if (request.option?.is_loading) {
            this.loadingService.setLoading(true);
        }
        const headers = this.getAuthHeader();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        request.data = this.toFormData(request.data);
        return this.http.post<BaseResponse>(url, request.data, { headers, responseType: responseType as any }).pipe(
            map(res => this.handleResponse<T>(res, request.option)),
            catchError((err) => this.handleHttpError(err, request.option)),
            finalize(() => {
                if (request?.option?.is_loading) {
                    this.loadingService.setLoading(false);
                }
            })
        );
    }

    postData<T>(path: string, request: RequestParam = {}): Observable<T> {
        let url = environment.api_url + path;
        let headers = this.getAuthHeader();
        if (request.option?.is_loading) {
            this.loadingService.setLoading(true);
        }
        return this.http.post<T>(url, request.data, {
            headers,
            responseType: 'json'
        }).pipe(
            map(res => this.handleResponse<T>(res, request.option)),
            catchError((err) => this.handleHttpError(err, request.option)),
            finalize(() => {
                if (request?.option?.is_loading) {
                    this.loadingService.setLoading(false);
                }
            })
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
                if (isSnackBar) {
                    this.snackBar.open(res.status === 1 ? 'ជោគជ័យ' : 'បរាជ័យ', '', { duration: 2000, horizontalPosition: 'center', panelClass: res.status === 1 ? 'panel-success' : 'panel-error' });
                }
                this.handleResponse<T>(res, request.option);
                return res;
            }),
            catchError((err) => this.handleHttpError(err, request.option)),
            finalize(() => {
                if (request?.option?.is_loading) {
                    this.loadingService.setLoading(false);
                }
            })
        );
    }

    postFile<T>(path: string, request: RequestParam): Observable<T> {
        const url = environment.api_url + path;
        this.clean(request.data);
        if (request.option?.is_loading) {
            this.loadingService.setLoading(true);
        }
        const headers = this.getAuthHeader();
        headers.append('Content-Type', 'multipart/form-data');
        request.data = this.toFormData(request.data);

        return this.http.post<BaseResponse>(url, request.data, { headers }).pipe(
            map(res => this.handleResponse<T>(res, request.option)),
            catchError((err) => this.handleHttpError(err, request.option)),
            finalize(() => {
                if (request?.option?.is_loading) {
                    this.loadingService.setLoading(false);
                }
            })
        );
    }

    postFileProgress<T>(path: string, request: RequestParam): Observable<number | T> {
        const url = environment.api_url + path;
        this.clean(request.data);
        if (request.option?.is_loading) {
            this.loadingService.setLoading(true);
        }
        const headers = this.getAuthHeader();
        headers.append('Content-Type', 'multipart/form-data;boundary=abc');
        request.data = this.toFormData(request.data);
        return this.http.post<BaseResponse>(url, request.data, { headers, reportProgress: true, responseType: 'json', observe: "events" }).pipe(
            map((res: any) => {
                if (res.type == HttpEventType.UploadProgress) {
                    return Math.round(res.loaded / res.total * 100);
                } else if (res.type === HttpEventType.Response) {
                    return this.handleResponse<T>(res.body, request.option)
                }
            }),
            catchError((err) => this.handleHttpError(err, request.option)),
            finalize(() => {
                if (request?.option?.is_loading) {
                    this.loadingService.setLoading(false);
                }
            })
        );
    }

    // patchJSON<T>(path: string, request: RequestParam, isSnackBar?: any): Observable<T> {

    //   return this.http.patch<T>(path, request.data, { responseType: 'json' })
    //   .pipe(
    //     map(
    //       response => {

    //         return response;
    //       }
    //     ),
    //     catchError(error => this.handleHttpError(error, request.option))
    //   )
    // }

    patchJSON<T>(path: string, request: RequestParam, isSnackBar?: any): Observable<T> {
        const url = environment.api_url + path;
        this.clean(request.data);
        const isLoading = request.option?.is_loading;
        if (isLoading) {
            this.loadingService.setLoading(true);
        }
        const headers = this.getAuthHeader();
        headers.append('Content-Type', 'application/json');
        return this.http.patch<T>(url, request.data, { headers, responseType: 'json' }).pipe(
            map((res: any) => {
                if (isSnackBar) {
                    this.snackBar.open(res.status === 1 ? 'ជោគជ័យ' : 'បរាជ័យ', '', { duration: 2000, horizontalPosition: 'center', panelClass: res.status === 1 ? 'panel-success' : 'panel-error' });
                }
                this.handleResponse<T>(res, request.option)
                return res;
            }),
            catchError((err) => this.handleHttpError(err, request.option)),
            finalize(() => {
                if (request?.option?.is_loading) {
                    this.loadingService.setLoading(false);
                }
            })
        );
    }

    patch<T>(path: string, request: RequestParam, isSnackBar?: any): Observable<T> {
        const url = environment.api_url + path;
        const isLoading = request.option?.is_loading;
        if (isLoading) {
            this.loadingService.setLoading(true);
        }
        const headers = this.getAuthHeader();
        return this.http.patch<T>(url, request.data, { headers, responseType: 'json' })
            .pipe(
                map((response: any) => {
                    this.handleResponse<T>(response, request.option);
                    return response;
                }),
                catchError(err => this.handleHttpError(err, request.option)),
                finalize(() => {
                    if (isLoading) {
                        this.loadingService.setLoading(false);
                    }
                })
            );
    }

    putJSON<T>(path: string, request: RequestParam, isSnackBar?: any) {
        let url = environment.api_url + path;
        this.clean(request.data);
        this.loadingService.setLoading(true);
        const headers = this.getAuthHeader();
        headers.append('Content-Type', 'application/json');
        return this.http.put<T>(url, request.data, { headers }).pipe(
            map((res: any) => {
                if (isSnackBar) {
                    this.snackBar.open(res.status === 1 ? 'ជោគជ័យ' : 'បរាជ័យ', '', { duration: 2000, horizontalPosition: 'center', panelClass: res.status === 1 ? 'panel-success' : 'panel-error' });
                }
                this.handleResponse<T>(res, request.option);
                return res;
            }),
            catchError((err) => this.handleHttpError(err, request.option)),
            finalize(() => {
                this.loadingService.setLoading(false);
            })
        );
    }

    deleteJSON<T>(path: string, request: RequestParam, isSnackBar?: any) {
        const url = environment.api_url + path;
        if (request.option?.is_loading) {
            this.loadingService.setLoading(true);
        }
        const headers = this.getAuthHeader();
        headers.append('Content-Type', 'application/json');
        return this.http.delete<T>(url, { headers, params: request.data }).pipe(
            map((res: any) => {
                this.handleResponse<T>(res, request.option);
                if (isSnackBar) {
                    this.snackBar.open(res.status === 1 ? 'ជោគជ័យ' : 'បរាជ័យ', '', { duration: 2000, horizontalPosition: 'center', panelClass: res.status === 1 ? 'panel-success' : 'panel-error' });
                }
                return res;
            }),
            catchError((err) => this.handleHttpError(err, request.option)),
            finalize(() => {
                if (request.option?.is_loading) {
                    this.loadingService.setLoading(false);
                }
            })
        );
    }

    private clean(obj: any) {
        for (const propName in obj) {
            if (obj[propName] === null || obj[propName] === undefined || obj[propName] === '') {
                delete obj[propName];
            }

            // if (obj[propName] == 'n/a') {
            //             obj[propName] = null;
            // }
        }
    }

    private getAuthHeader(is_refresh_token: boolean = false): HttpHeaders {
        const token = this.localStorageService.get(is_refresh_token ? LocalStorageEnum.refresh_token : LocalStorageEnum.token);
        if (token) {
            return new HttpHeaders({
                Authorization: 'Bearer ' + token
            });
        }
        return new HttpHeaders();
    }

    private handleResponse<T>(res: any, option?: RequestOption) {
        const r = res as unknown as BaseResponse;

        if (r.status === RESPONSE_STATUS.NOT_FOUND) {
            // this.localStorageService.delete(LocalStorageEnum.token);
            // this.router.navigate(['/login']);

            throwError(() => ({ message: res.message }))
        }
        else if (r.status === RESPONSE_STATUS.SUCCESS) {
            return res;
        }
        else if (r.status === RESPONSE_STATUS.UNKNOWN) {
            return res;
        }
        else if (r.status === RESPONSE_STATUS.ERROR_CLIENT) {
            if (r.error_code && option?.is_snack_bar == undefined) {
                if (["1006", "1003", "1012"].includes(r.error_code)) {
                    return r;
                }
                this.snackBar.openFromComponent(SnackbarComponentComponent, {
                    duration: 1800,
                    panelClass: 'panel-error',
                    data: {
                        message: 'error_code.' + r.error_code
                    }
                });
                return res;

            } else if (r.error_code && option?.is_snack_bar != undefined) {
                if (option.is_snack_bar) {
                    this.snackBar.openFromComponent(SnackbarComponentComponent, {
                        duration: 4000,
                        panelClass: 'panel-error',
                        data: {
                            message: "error_code." + r.error_code || r.error_code[0]
                        },
                    });
                }

            } else if (!r.error_code && option?.is_snack_bar != undefined) {
                if (option.is_snack_bar) {
                    let splitter = (str: string, split_by: string) => { return str.split(split_by) };
                    let errors = Object.values(r.errors as object).map(item => {
                        return {
                            msg: item[0].message || item[0],
                            code: item[0]?.code
                        }
                    })

                    // let localize_msg = errors[0].code ? "code." + errors[0].code :
                    //     errors[0].msg.includes('is required') ? this.tr.instant('response_message.required', {value: this.tr.instant(`response_message.${splitter(errors[0].msg, ' ')[0].toLowerCase()}`)}) :
                    //     errors[0].msg;

                    let general_message = errors[0].code ? "code." + errors[0].code : errors[0].msg;
                    this.snackBar.openFromComponent(SnackbarComponentComponent, {
                        duration: 4000,
                        panelClass: 'panel-error',
                        data: {
                            // message: option.is_localize_msg ? localize_msg : general_message
                        },
                    });
                }

            }

            throwError(() => ({ message: r.message, errors: r.errors }));
            return res;
        }
        else if (r.status === RESPONSE_STATUS.INTERNAL_SERVER_ERROR && option?.is_login) {
            this.snackBar.open('ឈ្មោះចូលប្រព័ន្ធ ឬ ពាក្យសម្ងាត់មិនត្រឹមត្រូវ', '', { duration: 3000, horizontalPosition: 'center', panelClass: 'panel-error' });
        }
        else {
            if (option?.is_alert_error) {
                this.snackBar.open("ប្រព័ន្ធមានបញ្ហា", '', { duration: 3000, horizontalPosition: 'center', panelClass: 'panel-error' });
            }
            throwError(() => ({ message: res.message }));
        }
    }

    private handleHttpError(error: HttpErrorResponse, option?: RequestOption) {
        return throwError(() => ({ message: error.message }));
    }

    private toFormData<T>(formValue: any) {
        const formData = new FormData();
        for (const key of Object.keys(formValue)) {
            const value = formValue[key];
            console.log(value)
            formData.append(key, value);
        }
        return formData;
    }

    onSignOut() {
        this.localStorageService.delete(LocalStorageEnum.token);
        this.localStorageService.delete(LocalStorageEnum.expiry_time);
        this.localStorageService.delete(LocalStorageEnum.refresh_token);
        this.localStorageService.delete(LocalStorageEnum.permissions);
        this.localStorageService.delete(LocalStorageEnum.user);
        this.router.navigate(['/login']);
    }

    onCleanAuthInfo() {
        this.localStorageService.delete(LocalStorageEnum.token);
        this.localStorageService.delete(LocalStorageEnum.expiry_time);
        this.localStorageService.delete(LocalStorageEnum.refresh_token);
        this.localStorageService.delete(LocalStorageEnum.permissions);
        this.localStorageService.delete(LocalStorageEnum.user);
    }
}
