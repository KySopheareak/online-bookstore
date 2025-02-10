import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TranslateService, LangChangeEvent, TranslateModule } from '@ngx-translate/core';
import { lastValueFrom, Observable, Subject, takeUntil, timer } from 'rxjs';

import { TranslateObjectPipe } from '../pipe/translate-object.pipe';
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { LocalizePipePipe } from '../pipe/localize-pipe.pipe';
import { FormatNumberPipe } from '../pipe/format-number.pipe';

import { CommonModule, LowerCasePipe } from '@angular/common';
import moment from 'moment';
import { Pagination } from '../../../class/pagination';
import { LANG } from '../../../models/core/lang.enum';
import { STATUS } from '../../../models/enums/status.enum';
import { LoadingService } from '../../../service/loading.service';
import { EnterpriseSmoothScrollTableDirective } from '../pipe/enterprise-smooth-scroll-table.directive';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PipeModule } from '../pipe/pipe.module';
import { EmptyListComponent } from '../empty-list/empty-list.component';
import { ExportExcelServiceService } from '../../../service/export-excel-service.service';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-table-template',
  templateUrl: './table-template.component.html',
  styleUrl: './table-template.component.scss',
  providers: [TranslateObjectPipe, LocalizePipePipe, FormatNumberPipe, LowerCasePipe],
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    PipeModule,
    EmptyListComponent,
    TranslateModule,
    MatSlideToggleModule,
    EnterpriseSmoothScrollTableDirective,
    MatTooltipModule,
    MatChipsModule
  ],
})
export class TableTemplateComponent implements OnInit, OnDestroy {
  lang: LANG;
  readonly LANG = LANG;
  readonly STATUS = STATUS;

  records: any[] = [];
  recordDataSource = new MatTableDataSource(this.records);
  recordPagination: Pagination = { page: 1, count: 10, total: 1 };
  pageSizeOptions = [5, 10, 20, 50, 100];
  displayedColumns: Array<string> = [];

  /**
   * @description List of page keys that allow for custom badge display
   */
  pageKeys: string[] = ['CONSOLIDATE_LIST', 'UPLOAD_EXCEL_PAGE_FORM'];

  isEmpty: boolean = false;

  @Input() setup = new TableSetup();

  @Output() onEdit: EventEmitter<any> = new EventEmitter();
  @Output() onRemove: EventEmitter<any> = new EventEmitter();
  @Output() onAccept: EventEmitter<any> = new EventEmitter();
  @Output() onDeselect: EventEmitter<any> = new EventEmitter();
  @Output() onSelect: EventEmitter<any> = new EventEmitter();
  @Output() onView: EventEmitter<any> = new EventEmitter();
  @Output() onToggleSlider: EventEmitter<any> = new EventEmitter();
  @Output() onPageChange: EventEmitter<any> = new EventEmitter();
  @Output() onExportCustomExcel: EventEmitter<void> = new EventEmitter<void>();

  @ViewChild(EnterpriseSmoothScrollTableDirective) tableSmoothScroll!: EnterpriseSmoothScrollTableDirective;
  private destroy = new Subject<void>();
  constructor(
    private translate: TranslateService,
    private transObj: TranslateObjectPipe,
    private localizePipe: LocalizePipePipe,
    private formatNumberPipe: FormatNumberPipe,
    private lowerCasePipe: LowerCasePipe,
    private excelService: ExportExcelServiceService,
    private loadingService: LoadingService,
  ) {
    this.lang = this.translate.currentLang as LANG;
    this.translate.onLangChange.pipe(takeUntil(this.destroy)).subscribe((event: LangChangeEvent) => {
      this.lang = event.lang as LANG;
    });
  }

  ngOnInit(): void {
    this.setup.updateNotifier.pipe(takeUntil(this.destroy)).subscribe((res: any) => {
      this.handleUpdate();
    });

    this.handleUpdate();
  }

  async handleUpdate() {
    this.records = this.setup?.data || [];
    this.recordDataSource = new MatTableDataSource(this.records);
    this.isEmpty = this.records.length === 0;
    this.recordPagination = this.setup?.pagination || { page: 1, count: 10, total: 0 };


    const cols = this.setup.columns;
    const shouldShowOrder = this.setup.showOrder && cols.length > 0;
    const shouldShowAction = this.setup.showAction && cols.length > 0;
    const hiddenColumns = this.setup.hiddenColumns;


    // Helper function to construct displayed columns based on visibility and ordering
    const buildDisplayedColumns = () => {
      let columns = cols.map(col => col.colDef);
      if (shouldShowOrder) columns.unshift('no');
      if (shouldShowAction) columns.push('action');
      return columns;
    };


    // Set displayed columns, filtering hidden columns if specified
    this.displayedColumns = hiddenColumns.length > 0
      ? buildDisplayedColumns().filter(col => !hiddenColumns.includes(col))
      : buildDisplayedColumns();


    await lastValueFrom(timer(0));
    this.tableSmoothScroll?.update();
  }


  getPropertyValue(element: any, column: ITableColumn) {
    // Determine if the value is a function
    if (typeof column.value === 'function') {
      return column.value(element);
    }

    const field = column.value.split('.').reduce((obj: any, key: any) => obj?.[key], element);
    if (typeof field === 'object' && field !== null) {
      if (field.name_kh || field.name_en) {
        if (column.useFullEnterprise) return `(${field.code}) ${this.transObj.transform(field)}`;
        else return this.transObj.transform(field);

      } else if (field.desc_kh || field.desc_en) {
        return this.transObj.transform(field, this.lang, 'desc_kh', 'desc_en');

      } else if (field.first_name_en || field.first_name_kh || field.last_name_kh || field.last_name_en) {
        return this.lang == LANG.KM ? `${field.last_name_kh} ${field.first_name_kh}` : `${field.last_name_en} ${field.first_name_en}`;

      } else {
        return field;
      }
    }

    return field;
  }

  onClickEdit(data: any) {
    this.onEdit.emit(data);
  }

  onClickRemove(data: any) {
    this.onRemove.emit(data);
  }

  onDeselectElement(data: any) {
    this.onDeselect.emit(data);
  }
  onSelectElement(data: any) {
    this.onSelect.emit(data);
  }

  onClickAccept(data: any) {
    this.onAccept.emit(data);
  }

  onClickView(data: any) {
    this.onView.emit(data);
  }

  onToggleActive(data: any, event: MatSlideToggleChange) {
    this.onToggleSlider.emit({ data, event });
  }

  onClickPageChange(event: any) {
    this.onPageChange.emit(event);
  }

  isNotString(value: any): value is string {
    return typeof value != 'string';
  }

  isArrayElement(value: any) {
    return Array.isArray(value);
  }

  onHandleExportCustomExcel() {
    this.onExportCustomExcel.emit();
  }

  async onHandleExportExcel() {
    this.loadingService.setLoading(true);
    const response = this.setup.fetchExportData ? await lastValueFrom(this.setup.fetchExportData()) : { data: this.records };


    /**
     * ===========================================================================
     * FILTER COLUMNS FOR EXPORT
     * ===========================================================================
     */
    const exportableColumns = this.setup.columns.filter(
      (col) => col.excelConfig?.export !== false // Default is true
    );


    /**
     * ===========================================================================
     * TRANSFORM DATA FOR EXPORT
     * ===========================================================================
     */
    const records = response?.data?.length > 0 ? response.data : response?.data?.data?.length > 0 ? response.data.data : [];
    const export_data = records.map((record: any, index: number) => {
      const rowData = exportableColumns.map(column => {
        const value = this.getPropertyValue(record, column);

        // Return formatted values based on column properties
        if ((value === undefined || value === null || value == "") && !column.useEmpAmount) {
          return '-'; // Empty cell for undefined or null
        } else if ((value === undefined || value === null || value == "") && column.useEmpAmount) {
          return '0'; // Empty cell for undefined or null  
        } else if (column.useDatePipe && !column.excelDatePipeFormat) {
          return this.localizePipe.transform(value, column.datePipeFormat || 'DD-MMM-yyyy');
        } else if (column.useNumberFormat) {
          return `${this.formatNumberPipe.transform(value)} ${column.numberFormatSuffix || ''}`;
        } else if (column.useGender) {
          return this.translate.instant('gender.' + value);
        } else if(column.excelDatePipeFormat) {
          const formatDate = (isoDate: string): string => {
            return moment(isoDate).format(column.excelDatePipeFormat || 'DD/MM/YYYY');
          };
          return `${formatDate(value)}`;
          
        } else if (column.useBadge && !column.isArrayObj) {
          if (this.isArrayElement(value)) {
            const translateArray = [];
            for (let item of value) {
              const translated = this.translate.instant((column?.badgePrefix || '') + item.toString().toLowerCase());
              translateArray.push(' ' + translated);
            }
            return translateArray.toString();

          } else {
            return this.translate.instant((column?.badgePrefix || '') + value.toString().toLowerCase());

          }
        }

        return value;
      });

      // Add index at the start of each row
      return [index + 1, ...rowData];
    });

    if(this.setup.additional_data) {
      const additional_data = records
      this.onPrepareAndDownloadExcel({ 
        columns: exportableColumns, 
        exportData: export_data, 
        title: this.setup.excelTitle || '', 
        excelDate: this.setup.excelDate,
        additional_data: additional_data 
      });
    } else {
      this.onPrepareAndDownloadExcel({ 
        columns: exportableColumns, 
        exportData: export_data, 
        title: this.setup.excelTitle || '', 
        excelDate: this.setup.excelDate
      });
    }


  }

  async onPrepareAndDownloadExcel(params: { columns: Array<ITableColumn>, exportData: any, title: string, excelDate?: any, additional_data?: any }) {
    const workbook = this.excelService.newWorkbook();
    const worksheet = workbook.addWorksheet();


    /**
     * ===========================================================================
     * GENERATE DEFAULT HEADER OF EXCEL FILE
     * ===========================================================================
     */
    if(params.additional_data) {
      await this.excelService.generateDefaultExcelHeader(workbook, worksheet, params.columns.length + 1);
    } else {
      await this.excelService.generateDefaultExcelHeader(workbook, worksheet, params.columns.length);
    }


    /**
     * ===========================================================================
     * SET REPORT TITLE
     * ===========================================================================
     */
    const report_title = this.translate.instant(params.title || '');
    this.excelService.setTitle(worksheet, `A9`, report_title, { bold: true });
    if(params.excelDate){
      if(params.excelDate.start_date != params.excelDate.end_date){
        const report_date = `ចាប់ពីថ្ងៃទី ${params.excelDate.start_date} រហូតដល់ថ្ងៃទី ${params.excelDate.end_date}`;
        this.excelService.setTitle(worksheet, `A10`, report_date, { bold: true });
      } else {
        const report_date = `ថ្ងៃទី ${params.excelDate.start_date}`;
        this.excelService.setTitle(worksheet, `A10`, report_date, { bold: true });
      }
    }


    /**
     * ===========================================================================
     * SET TABLE HEADER
     * ===========================================================================
     */
    if(params.additional_data) {
      const headers = [
        this.translate.instant('no'),
        ...params.columns.map(column =>
          Array.isArray(column.title)
            ? column.title.map(title => this.translate.instant(title)).join(' ')
            : this.translate.instant(column.title)
        ), 
        this.translate.instant('Ref No')
      ];
  
      const headerRow = worksheet.addRow(headers);
      this.excelService.generateTableHeader(headerRow, true, { x: 'center', y: 'middle' });
    } else {
      const headers = [
        this.translate.instant('no'),
        ...params.columns.map(column =>
          Array.isArray(column.title)
            ? column.title.map(title => this.translate.instant(title)).join(' ')
            : this.translate.instant(column.title)
        )
      ];
  
      const headerRow = worksheet.addRow(headers);
      this.excelService.generateTableHeader(headerRow, true, { x: 'center', y: 'middle' });
    }


    /**
     * ===========================================================================
     * GENERATE TABLE DATA
     * ===========================================================================
     */
    if(params.additional_data) {
      let additional_id = params.additional_data.map((item: any) => item._id);
      this.excelService.generateCustomTableData(params.exportData, worksheet, { x: 'center', y: 'middle' }, additional_id);
    } else {
      this.excelService.generateTableData(params.exportData, worksheet, { x: 'center', y: 'middle' });
    }
    // this.excelService.generateTableData(params.exportData, worksheet, { x: 'center', y: 'middle' });
    this.excelService.autoSetColumnWidth(worksheet);
    this.excelService.setCollumnWidth(worksheet, 'A', 10);


    /**
     * ================================================
     * EXPORT EXCEL
     * ================================================
     */
    this.excelService.export(workbook, worksheet, report_title);
    this.loadingService.setLoading(false);
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }
}

export class TableSetup {
  data: Array<any> = [];
  columns: Array<ITableColumn> = [];
  hiddenColumns: Array<string> = [];
  pagination: Pagination = { page: 1, count: 10, total: 0 };
  showOrder = true;
  showAction = true;
  pageKey?: string;

  exportExcel = false;
  exportCustomExcel = false;
  multi_excel?: boolean = false;
  additional_data?: boolean = false;
  excelTitle?: string;
  excelDate?: any;
  fetchExportData?: () => Observable<any> = undefined;

  updateNotifier = new EventEmitter<void>();

  actionHandlers: ITableActionsHandlers = {
    show_view_btn_if: () => true,
    show_edit_btn_if: () => false,
    show_delete_btn_if: () => false,
    show_accept_btn_if: () => false,
    show_select_btn_if: () => false,
    show_deselect_btn_if: () => false,
    show_toggle_btn_if: () => false,
    check_toggle_btn_if: () => false,
    show_toggle_add_btn_if: () => false,
    show_toggle_remove_btn_if: () => false,
  };

  private applyConfig(config: Partial<TableSetup>): void {
    Object.assign(this, {
      ...config,
      actionHandlers: {
        ...this.actionHandlers,
        ...config.actionHandlers
      }
    });
  }

  /**
   * @description Use to partially update class properties.
   * @param config - Partial configuration to update.
   */
  update(config?: Partial<TableSetup>): void {
    if (config) this.applyConfig(config);
    this.updateNotifier.emit();
  }

  /**
   * @description Recommended for initial class setup.
   * @param config - Initial configuration.
   * @param options - Optional settings for event emission.
   */
  setup(config: Partial<TableSetup>, options: ITableSetupOptions = { emitEvent: true }): void {
    this.applyConfig(config);
    if (options.emitEvent) this.updateNotifier.emit();
  }
}

export interface ITableColumn {
  colDef: string;
  title: string | Array<string>;
  value: string | ((element: any) => any);

  class?: string;
  useDatePipe?: boolean;
  datePipeFormat?: string;
  excelDatePipeFormat?: string;

  useBadge?: boolean;
  isArrayObj?: boolean;
  badgePrefix?: string;

  useGender?: boolean;
  useNumberFormat?: boolean;
  useEmpAmount?: boolean;
  useFullEnterprise?: boolean;
  sticky?: boolean;
  stickyEnd?: boolean;
  // export?: boolean;

  /**
   * @description
   * List configuration for exporting excel
   */
  excelConfig?: {
    export?: boolean;
    // alignment?: {
    //   vertical?: 'top' | 'middle' | 'bottom' | 'distributed' | 'justify';
    //   horizontal?: 'left' | 'center' | 'right' | 'fill' | 'justify' | 'centerContinuous' | 'distributed';
    // };
  };

  /**
   * @description
   * Provide suffix to number to make more meaning.
   * Accept string translate Eg: 'general.people'
   * Eg: [01នាក់, 23គ្រឿង,​....]
   */
  numberFormatSuffix?: string;
}

export interface ITableActionsHandlers {
  show_view_btn_if?: (element: any) => boolean;
  show_edit_btn_if?: (element: any) => boolean;
  show_delete_btn_if?: (element: any) => boolean;
  show_accept_btn_if?: (element: any) => boolean;
  show_select_btn_if?: (element: any) => boolean;
  show_deselect_btn_if?: (element: any) => boolean;
  show_toggle_btn_if?: (element: any) => boolean;
  check_toggle_btn_if?: (element: any) => boolean;
  show_toggle_add_btn_if?: (element: any) => boolean;
  show_toggle_remove_btn_if?: (element: any) => boolean;
}

export interface ITableSetupOptions {
  emitEvent: boolean
}
