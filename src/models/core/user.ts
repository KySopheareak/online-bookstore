import { IRole } from "./role";

export interface User {
  filename: any;
  daily_working_branches: any;
  manage_branches: any;
  _id: string;
  dob: Date;
  first_name?: string;
  last_name?: string;
  first_name_kh?: string;
  last_name_kh?: string;
  first_name_en?: string;
  name_kh: string;
  name_en: string;
  card_type: string;
  last_name_en?: string;
  username: string;
  phone_number: string;
  email: string;
  personal_code: string;
  role: IRole;
  password?: string;
  department?: any;
  gender?: string;
  is_active?: boolean;
  enterprises?: Array<any> | string[];
  old_enterprises: string[]
  avatar: string;
  is_agent: boolean;
  phone: string;
  position: any;
  division: any;
  roles: Array<IRole> | string[]
}
