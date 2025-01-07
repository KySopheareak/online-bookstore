import { RESPONSE_STATUS } from "../enums/response-status.enum";
import { ErrorCode } from '../enums/error-code.enum';
export interface BaseResponse {
    status: RESPONSE_STATUS;
    message: string;
    errors?: {
        [key: string]: string[]
    };
    data?: any;
    error_code?: ErrorCode
}
