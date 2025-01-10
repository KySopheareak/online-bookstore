export interface IRole {
  permissions: string[];
  _id: number;
  name: string;
  name_kh: string;
  default_page: string | null;
}
