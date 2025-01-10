import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/core/user';
import { CommonResponse } from '../models/response/common-response';
import { RequestService } from './request.service';
import { IUserResponse } from '../models/response/user-response';

@Injectable({
  providedIn: 'root',
})
export class UserAdminService {
  constructor(
		private requestService: RequestService
	) { }

	/**
	 *
	 * @param page
	 * @param count
	 * @returns
	 */
	public getUser(data: {page: number, count: number, search?: string, department?: string, division?: string, role?: number}): Observable<IUserResponse> {
		return this.requestService.postJSON<IUserResponse>(`/user`, {
			data: Object.assign(data),
			option: {
				is_loading: true
			}
		});
	}


	/**
	 *
	 * @param page
	 * @param count
	 * @returns
	 */
	public getUserByID(id: string): Observable<CommonResponse<User>> {
		return this.requestService.getJSON<User>(`/user/${id}`, {
			data: {},
			option: {
				is_loading: true
			}
		});
	}


	/**
	 *  UPDATE USER PROFILE
	 * @param file
	 * @param id
	 * @returns
	 */
	public updateUserProfile(file: any, id: string): Observable<CommonResponse<User>> {
		const formData = new FormData();
		formData.append('avatar', file);

		return this.requestService.postJSON<any>(`/user/${id}/avatar`, {
			data: Object.assign(formData),
			option: {
				is_loading: true
			}
		});
	}

  public createUserProfile(file: any): Observable<CommonResponse<User>> {
		const formData = new FormData();
		formData.append('avatar', file);

		return this.requestService.postJSON<any>(`/user/upload/avatar`, {
			data: Object.assign(formData),
			option: {
				is_loading: true
			}
		});
	}

	/**
	 *
	 * @param data
	 * @returns
	 */
	public createUser(data: any): Observable<CommonResponse<User>> {
		return this.requestService.postJSON<CommonResponse<User>>(`/user/create`, {
			data,
			option: {
				is_loading: true,
				is_snack_bar: true,
				is_localize_msg: true,
			}
		});
	}

	/**
	 *
	 * @param data
	 * @returns
	 */
	public updateUser(data: any, id: string): Observable<CommonResponse<User>> {
		return this.requestService.postJSON<CommonResponse<User>>(`/user/${id}`, {
			data,
			option: {
				is_loading: true,
				is_snack_bar: true,
				is_localize_msg: true
			}
		});
	}

	toggleActive(id: string, is_active: boolean): Observable<CommonResponse<User>> {
		let path = "/user/active/" + id
		return this.requestService.postJSON<CommonResponse<User>>(path, {
			data: { is_active },
			option: {
				is_loading: true
			}
		}, true);
	}

	getUserByDepartment(department: string, page: number, count: number,): Observable<IUserResponse> {
		const path = `/user`;
		return this.requestService.postJSON<IUserResponse>(path, {
			data: { page, count, department },
			option: {
				is_loading: true
			}
		});
	}

	getAvatar(avatarId: string): Observable<Blob> {
		return this.requestService.get<Blob>("/user/avatar/" + avatarId, {
			data: null,
			option: {}
		}, 'blob');
	}

  public manageUpdateBranches(data: any, id: string): Observable<CommonResponse<User>> {
		return this.requestService.postJSON<CommonResponse<User>>(`/user/${id}/branches`, {
			data,
			option: {
				is_loading: true,
				is_snack_bar: true,
				is_localize_msg: true
			}
		});
	}
  public uploadSingature(file: any): Observable<CommonResponse<User>> {
		const formData = new FormData();
		formData.append('signature', file);
		return this.requestService.postJSON<any>(`/user/upload/signature`, {
			data: Object.assign(formData),
			option: {
				is_loading: true
			}
		});
	}

  public getAttachment(_id: string): Observable<Blob> {
		return this.requestService.get(`/user/attachment/${_id}`, {
      data: null,
			option: {
				is_loading: true
			}
		}, 'blob');
	}

  searchOldEnterpriseUser(search: string): Observable<CommonResponse<any>> {
    let path = '/ent-user/' + 'existing/search';
    return this.requestService.postJSON(path, {
      data: { search },
      option: {
        is_loading: true
      }
    })
  }

  searchOldUser(search: string): Observable<CommonResponse<any>> {
    let path = '/user/existing/search';
    return this.requestService.postJSON(path, {
      data: { search },
      option: {
        is_loading: true
      }
    })
  }
}
