export class Pagination {
  page: number;
  count: number;
  total: number;
  constructor(page?: number, count?: number, total?: number) {
      this.page = page || 1;
      this.count = count || 10;
      this.total = total || 0;
  }
}
