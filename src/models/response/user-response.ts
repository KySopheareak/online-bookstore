import { Pagination } from "../../class/pagination";
import { BaseResponse } from "./base.response";
import { User } from "../core/user";

export interface IUserResponse extends BaseResponse {
        data: User[],
        pagination: Pagination;
}