import { BaseResponse } from './base.response';

export interface CommonResponse<Data> extends BaseResponse {
    pagination: any;
    data: Data
}