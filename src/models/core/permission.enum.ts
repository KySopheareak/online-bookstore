/**
 * @NOTE: Search by key: 'MAIN' , 'SUB'
 */
export enum PERMISSION {

  // -----------------------------------------------------
  // MAIN: CONSOLIDATE_REQUEST
  // -----------------------------------------------------
  ALLOW_UPLOAD_PAYSLIP = 'ALLOW_UPLOAD_PAYSLIP',


  // -----------------------------------------------------
  // MAIN: CONSOLIDATE_LIST
  // -----------------------------------------------------
  READ_CON_RECORD = 'READ_CON_RECORD',
  ALLOW_CHECK_RECORD = 'ALLOW_CHECK_RECORD',


  // -----------------------------------------------------
  // MAIN: PAYSLIP
  // -----------------------------------------------------
  READ_PAYSLIP = 'READ_PAYSLIP',

  // -----------------------------------------------------
  // MAIN: INVOICE
  // -----------------------------------------------------
  READ_INVOICE = 'READ_INVOICE',


  // -----------------------------------------------------
  // MAIN: SYSTEM TRACKING
  // -----------------------------------------------------
  READ_TRACKING = 'READ_TRACKING',



  // -----------------------------------------------------
  // MAIN: NSSF USER
  // -----------------------------------------------------
  READ_NSSF_USER = 'READ_NSSF_USER',
  ALLOW_CREATE_NSSF_USER = 'ALLOW_CREATE_NSSF_USER',
  ALLOW_EDIT_NSSF_USER = 'ALLOW_EDIT_NSSF_USER',
  ALLOW_DISABLE_NSSF_USER = 'ALLOW_DISABLE_NSSF_USER',


  // -----------------------------------------------------
  // MAIN: SETTINGS
  // -----------------------------------------------------
  READ_SETTING = 'READ_SETTING',
  ALLOW_CREATE_SETTING = 'ALLOW_CREATE_SETTING',
  ALLOW_EDIT_SETTING = 'ALLOW_EDIT_SETTING',
  ALLOW_DISABLE_SETTING = 'ALLOW_DISABLE_SETTING',

}

/**
 * @NOTE: Search by key: 'MAIN'
 */
export enum SECTION {

  // -----------------------------------------------------
  // MAIN: CONS0LIDATE_REQUEST
  // -----------------------------------------------------
  UPLOAD_EXCEL = 'upload_excel',

  // -----------------------------------------------------
  // MAIN: CONSOLIDATE_LIST
  // -----------------------------------------------------
  CONSOLIDATE_LIST = 'consolidate_list',

  // -----------------------------------------------------
  // MAIN: PAYSLIP
  // -----------------------------------------------------
  PAYSLIP_LIST = "payslip_list",

  // -----------------------------------------------------
  // MAIN: RECEIPT
  // -----------------------------------------------------
  INVOICE_LIST = "receipt_list",


  // -----------------------------------------------------
  // MAIN: SYSTEM TRACKING
  // -----------------------------------------------------
  SYSTEM_TRACKING = 'menu.tracking_system',


  // -----------------------------------------------------
  // MAIN: NSSF USER
  // -----------------------------------------------------
  NSSF_USER = 'user_admin',

  // -----------------------------------------------------
  // MAIN: SETTINGS
  // -----------------------------------------------------
  SETTING = 'setting',
  SETTING_DEPARTMENT = 'departments',
  SETTING_ROLE = 'role',
  SETTING_BANK = 'bank',

  // -----------------------------------------------------
  // MAIN: ABOUT_US
  // -----------------------------------------------------
  ABOUT_US = 'about_us'
}
