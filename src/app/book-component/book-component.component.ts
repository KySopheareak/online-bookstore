import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { LangChangeEvent, TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import moment from 'moment';
import { lastValueFrom, Subject, takeUntil, timer } from 'rxjs';
import { Pagination } from '../../class/pagination';
import { LANG } from '../../models/core/lang.enum';
import { STATUS } from '../../models/enums/status.enum';
import { TableSetup, TableTemplateComponent } from '../share/table-template/table-template.component';
import { SessionStorageService } from '../../service/core/session-storage.service';
import { SessionStorage } from '../../models/enums/session-storage.enum';
import { SelectComponent } from '../share/select/select.component';
import { OptionComponent } from '../share/option/option.component';
import { DatePickerLocaleComponent } from '../share/date-picker-locale/date-picker-locale.component';
import { ApiService } from '../../service/api.service';
import { RESPONSE_STATUS } from '../../models/enums/response-status.enum';
import { LoadingService } from '../../service/loading.service';
import { TranslateObjectPipe } from "../share/pipe/translate-object.pipe";
import { SettingService } from '../../service/setting.service';
import { MatChipsModule } from '@angular/material/chips';

const PAGE_KEY = "BOOK_LIST";

@Component({
  selector: 'app-book-component',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    ReactiveFormsModule,
    TranslateModule,
    TableTemplateComponent,
    SelectComponent,
    OptionComponent,
    TranslateObjectPipe,
    MatChipsModule
],
  templateUrl: './book-component.component.html',
  styleUrl: './book-component.component.scss',
})
export class BookComponentComponent implements OnInit {
  lang: LANG;
  readonly LANG = LANG;
  readonly STATUS = STATUS;

  bookTable = new TableSetup();
  searchDataGroup!: FormGroup;
  banks: any[] = [];

  category: any[] = [];

  bookPagination: any;

  filter: Filter = {
    page_key: PAGE_KEY,
    category: [],
    page_index: 1,
    page_size: 10,
    search: '',
  };

  private _destroy: Subject<void> = new Subject();
  constructor(
    private translate: TranslateService,
    private router: Router,
    private route: ActivatedRoute,
    private _cd: ChangeDetectorRef,
    private _dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private _sessionStorage: SessionStorageService,
    private _apiService: ApiService,
    private _loadingService: LoadingService,
    private _settingService: SettingService 
  ) {
    this.lang = this.translate.currentLang as LANG;
    this.translate.onLangChange.pipe(takeUntil(this._destroy)).subscribe((event: LangChangeEvent) => {  
      this.lang = event.lang as LANG;
    });

    this.searchDataGroup = new UntypedFormGroup({
      book_category: new UntypedFormControl(null),
      search: new UntypedFormControl(''),
    });
  }

  ngOnInit() {
    this._setupbookTable();
    this._fetchPreviousRecords();
    this._fetchList();
    this._fetchCategory();
  }

  private _setupbookTable() {
    this.bookTable.setup({
      showAction: true,
      columns: [
        {
          colDef: 'title',
          title: 'title',
          value: 'title',
        },
        {
          colDef: 'author',
          title: 'author',
          value: 'author',
        },
        {
          colDef: 'price',
          title: 'price',
          value: 'price',
          useNumberFormat: true
        },
        {
          colDef: 'stock',
          title: 'stock',
          value: 'stock',
        },
        {
          colDef: 'category',
          title: 'category',
          value: 'category',
          class: 'text-center',
          useBadge: true,
          isArrayObj: true
        },
        {
          colDef: 'description',
          title: 'description',
          value: 'description',
        },
      ],
    });
  }

  private get dataJson(): any | null {
    const value = this.searchDataGroup.value;
    let storing_data: any = [];
    if(value.book_category != null) {
      storing_data.push(value.book_category);
      this.filter.category = storing_data;
    }
    return {
      page: this.filter.page_index,
      count: this.filter.page_size,
      search: value?.search,
      category: this.filter.category,
    };
  }

  private async _fetchList() {
    const response = await lastValueFrom(
      this._apiService.getBooklist(this.dataJson)
    );

    if (response.status != RESPONSE_STATUS.SUCCESS) return;
    this.bookTable.update({
      data: response.data.data,
      // pagination: response.data.pagination,
    });
    // this.bookPagination = response.data.pagination;
    
  }

  private async _fetchCategory() {
    let dataJson: any = {
      status: true
    }
    const response = await lastValueFrom(this._settingService.getCategoryList(dataJson));
    if(response.status !== RESPONSE_STATUS.SUCCESS) return;
    this.category = response.data.data;
  }

  private async _fetchPreviousRecords() {
    this.filter = this._sessionStorage.getObject(SessionStorage.filter);
    if (this.filter && this.filter.page_key == PAGE_KEY) {
      this.filter = this.filter;
      this.filter.page_index = this.filter.page_index
        ? parseInt(this.filter.page_index.toString())
        : 1;
      this.filter.page_size = this.filter.page_size
        ? parseInt(this.filter.page_size.toString())
        : 10;

      this.searchDataGroup.patchValue({
        search: this.filter.search ?? null,
        category: this.filter.category ?? null,
      });
    } else {
      this.clearPreviousRecord();

      this.filter = {
        page_key: PAGE_KEY,
        page_index: 1,
        page_size: 10,
        search: '',
        category: [],
      };
    }
  }

  onResetForm() {
    this.searchDataGroup.setValue({
      search: '',
      book_category: null,
    });

    this.filter = {
      page_key: PAGE_KEY,
      page_index: 1,
      page_size: 10,
      search: '',
      category: null,
    };

    this.clearPreviousRecord();
    this._fetchList();
    console.log(this.filter);
  }

  clearPreviousRecord() {
    this._sessionStorage.delete(SessionStorage.filter);
  }

  saveCurrentRecord() {
    const value = this.searchDataGroup.value;
    this.filter = {
      page_key: this.filter.page_key,
      page_index: this.filter.page_index,
      page_size: this.filter.page_size,
      search: value?.search,
      category: value?.book_category,
    };
    
    this._sessionStorage.saveObject(SessionStorage.filter, this.filter);
  }

  onPageChange(event: PageEvent): void {
    this.filter.page_index = event.pageIndex + 1;
    this.filter.page_size = event.pageSize;
    this.saveCurrentRecord();
    this._fetchList();
  }

  onSearch() {
    this.filter.page_index = 1;
    this.filter.page_size = 10;
    this.saveCurrentRecord();
    this._fetchList();
  }

  onSelectBookCategory(data: any) {
    let storing_data: any = [];
    storing_data.push(data);
    this.filter.category = storing_data;
    console.log(this.filter.category);
  }

  onViewDetail(data: any) {
    this.router.navigate(['detail', data._id], { relativeTo: this.route });
  }


  ngOnDestroy(): void {
    this._destroy.next();
    this._destroy.complete();
  }
}

interface Filter {
  page_key: string;
  page_index: number;
  page_size: number;
  search: string;
  category: any[] | null;  
}


