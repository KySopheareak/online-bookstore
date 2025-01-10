import { PERMISSION, SECTION } from "./permission.enum";


export const ROUTE_PERMISSIONS = {

  // -----------------------------------------------------
  // MAIN: CONSOLIDATE_REQUEST
  // -----------------------------------------------------

  CONSOLIDATE_REQUEST: [
    SECTION.UPLOAD_EXCEL,
    PERMISSION.ALLOW_UPLOAD_PAYSLIP
  ],

  // -----------------------------------------------------
  // MAIN: CONSOLIDATE_LIST
  // -----------------------------------------------------

  CONSOLIDATE_LIST : [
    SECTION.CONSOLIDATE_LIST,
    PERMISSION.READ_CON_RECORD,
    PERMISSION.ALLOW_CHECK_RECORD
  ],

  // -----------------------------------------------------
  // MAIN: CONSOLIDATE_LIST
  // -----------------------------------------------------

  PAYSLIP_LIST : [
    SECTION.PAYSLIP_LIST,
    PERMISSION.READ_PAYSLIP
  ],

  // -----------------------------------------------------
  // MAIN: CONSOLIDATE_LIST
  // -----------------------------------------------------

  INVOICE_LIST : [
    SECTION.INVOICE_LIST,
    PERMISSION.READ_INVOICE
  ],

  // -----------------------------------------------------
  // MAIN: USERS
  // -----------------------------------------------------
  NSSF_USER: [
    SECTION.NSSF_USER,
    PERMISSION.READ_NSSF_USER,
    PERMISSION.ALLOW_CREATE_NSSF_USER,
    PERMISSION.ALLOW_EDIT_NSSF_USER,
    PERMISSION.ALLOW_DISABLE_NSSF_USER,
  ],

  // -----------------------------------------------------
  // MAIN: SETTING
  // -----------------------------------------------------
  SETTING: [
    SECTION.SETTING,
    PERMISSION.READ_SETTING,
    PERMISSION.ALLOW_CREATE_SETTING,
    PERMISSION.ALLOW_EDIT_SETTING,
    PERMISSION.ALLOW_DISABLE_SETTING,
  ],
};

export const EXTENDED_ROUTE_PMS = {

  // -----------------------------------------------------
  // MAIN: CONSOLIDATE_REQUEST
  // -----------------------------------------------------

  CONSOLIDATE_REQUEST: [
    PERMISSION.ALLOW_UPLOAD_PAYSLIP
  ],

  // -----------------------------------------------------
  // MAIN: CONSOLIDATE_LIST
  // -----------------------------------------------------

  CONSOLIDATE_LIST : [
    PERMISSION.READ_CON_RECORD,
    PERMISSION.ALLOW_CHECK_RECORD
  ],

  // -----------------------------------------------------
  // MAIN: PAYSLIP_LIST
  // -----------------------------------------------------

  PAYSLIP_LIST : [
    PERMISSION.READ_PAYSLIP
  ],

   // -----------------------------------------------------
  // MAIN: INVOICE_LIST
  // -----------------------------------------------------

  INVOICE_LIST : [
    PERMISSION.READ_INVOICE
  ],

  // -----------------------------------------------------
  // MAIN: USERS
  // -----------------------------------------------------
  NSSF_USER: [
    PERMISSION.READ_NSSF_USER,
    PERMISSION.ALLOW_CREATE_NSSF_USER,
    PERMISSION.ALLOW_EDIT_NSSF_USER,
    PERMISSION.ALLOW_DISABLE_NSSF_USER,
  ],

  // -----------------------------------------------------
  // MAIN: SETTING
  // -----------------------------------------------------
  SETTING: [
    PERMISSION.READ_SETTING,
    PERMISSION.ALLOW_CREATE_SETTING,
    PERMISSION.ALLOW_EDIT_SETTING,
    PERMISSION.ALLOW_DISABLE_SETTING,
  ],
};

export const ROUTE_PMS_JSON = [
  {
    name: SECTION.UPLOAD_EXCEL,
    key: 'CONSOLIDATE_REQUEST',
    icon: 'upload-excel',
    children: [
      {
        name: SECTION.UPLOAD_EXCEL,
        path: '/upload-excel',
        pms_keys: EXTENDED_ROUTE_PMS.CONSOLIDATE_REQUEST,
      },
    ],
  },
  {
    name: SECTION.CONSOLIDATE_LIST,
    key: 'CONSOLIDATE_LIST',
    icon: 'list_alt_check',
    children: [
      {
        name: SECTION.CONSOLIDATE_LIST,
        path: '/consolidate-list',
        pms_keys: EXTENDED_ROUTE_PMS.CONSOLIDATE_LIST,
      },
    ],
  },
  {
    name: SECTION.PAYSLIP_LIST,
    key: 'PAYSLIP_LIST',
    icon: 'receipt_long',
    children: [
      {
        name: SECTION.PAYSLIP_LIST,
        path: '/payslip-list',
        pms_keys: EXTENDED_ROUTE_PMS.PAYSLIP_LIST,
      },
    ],
  },
  {
    name: SECTION.INVOICE_LIST,
    key: 'INVOICE_LIST',
    icon: 'currency_exchange',
    children: [
      {
        name: SECTION.INVOICE_LIST,
        path: '/receipt-list',
        pms_keys: EXTENDED_ROUTE_PMS.INVOICE_LIST,
      },
    ],
  },
  {
    name: SECTION.NSSF_USER,
    key: 'NSSF_USER',
    icon: 'manage_accounts',
    children: [
      {
        name: SECTION.NSSF_USER,
        path: '/user-admin',
        pms_keys: EXTENDED_ROUTE_PMS.NSSF_USER,
      },
    ],
  },
  {
    name: SECTION.SETTING,
    key: 'SETTING',
    icon: 'settings',
    children: [
      {
        name: SECTION.SETTING,
        path: '/organization',
        pms_keys: EXTENDED_ROUTE_PMS.SETTING,
      },
    ],
  },
];
