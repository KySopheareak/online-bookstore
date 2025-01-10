import { Injectable } from '@angular/core';
import { EXTENDED_ROUTE_PMS } from '../models/core/route-permission';
import { MenuItem } from '../models/core/menu-item';
import { SECTION } from '../models/core/permission.enum';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  constructor() {}

  getMenuItems(permissions: string[]): MenuItem[] {
    return [
      {
        name: SECTION.UPLOAD_EXCEL,
        path: '/upload-excel',
        icon: 'upload-excel',
        root: 'upload-excel',
        isNoPermission: EXTENDED_ROUTE_PMS.CONSOLIDATE_REQUEST.filter((p) => permissions?.includes(p)).length === 0,
      },
      {
        name: SECTION.CONSOLIDATE_LIST,
        path: '/consolidate-list',
        icon: 'list_alt_check',
        root: 'consolidate-list',
        isNoPermission: EXTENDED_ROUTE_PMS.CONSOLIDATE_LIST.filter((p) => permissions?.includes(p)).length === 0,
      },
      {
        name: SECTION.PAYSLIP_LIST,
        path: '/payslip-list',
        icon: 'receipt_long',
        root: 'payslip-list',
        isNoPermission: EXTENDED_ROUTE_PMS.PAYSLIP_LIST.filter((p) => permissions?.includes(p)).length === 0,
      },
      {
        name: SECTION.INVOICE_LIST,
        path: '/receipt-list',
        icon: 'currency_exchange',
        root: 'receipt-list',
        isNoPermission: EXTENDED_ROUTE_PMS.INVOICE_LIST.filter((p) => permissions?.includes(p)).length === 0,
      },
      {
        name: SECTION.NSSF_USER,
        path: '/user-admin',
        icon: 'manage_accounts',
        root: 'user-admin',
        isNoPermission:
          EXTENDED_ROUTE_PMS.NSSF_USER.filter((p) => permissions?.includes(p))
            .length === 0,
      },
      {
        name: SECTION.SETTING,
        icon: 'settings',
        isNoPermission:
          EXTENDED_ROUTE_PMS.SETTING.filter((p) => permissions?.includes(p))
            .length === 0,
        root: 'setting',
        expanded: false,
        children: [
          // {
          //   name: SECTION.SETTING_DEPARTMENT,
          //   path: 'setting/department',
          //   icon: 'meeting_room',
          //   isNoPermission:
          //     EXTENDED_ROUTE_PMS.SETTING.filter((p) => permissions?.includes(p))
          //       .length === 0,
          // },
          {
            name: SECTION.SETTING_ROLE,
            path: 'setting/role',
            icon: 'work',
            isNoPermission:
              EXTENDED_ROUTE_PMS.SETTING.filter((p) => permissions?.includes(p))
                .length === 0,
          },
          {
            name: SECTION.SETTING_BANK,
            path: 'setting/bank',
            icon: 'assured_workload',
            isNoPermission:
              EXTENDED_ROUTE_PMS.SETTING.filter((p) => permissions?.includes(p))
                .length === 0,
          },
        ],
      },
    ] as MenuItem[];
  }
}
