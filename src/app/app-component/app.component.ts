import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { GuardsCheckStart, NavigationCancel, NavigationEnd, NavigationSkipped, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { UtilService } from '../../service/core/util.service';
import { LoadingService } from '../../service/loading.service';
import { delay } from 'rxjs';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TranslateModule, NgxSpinnerModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'bookstore-admin';
  isLoading = false;
  private iconPath: string = "/icons/";
  private iconExt: string = '.svg';

  constructor(
    private icon: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private util: UtilService,
    private _loadingService: LoadingService,
    private _ngxSpinnerService: NgxSpinnerService,
    private router: Router 
  ) {
  }

  ngOnInit() {
    this.util.initializeTranslate();
    this.addIcons();
    this._loadingService.loadingEventEmitter.pipe(delay(0)).subscribe((isLoading: boolean) => {
      if (isLoading) {
        this._ngxSpinnerService.show("pageLoading");
      } else {
        this._ngxSpinnerService.hide("pageLoading");
      }
    });

    this.router.events.subscribe((event): void => {
      if (event instanceof NavigationStart) {
        this.isLoading = true;
      } else if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof GuardsCheckStart || event instanceof NavigationSkipped) {
        this.isLoading = false;
      }
    });
  }

  addIcons() {
    this.addIcon('mail', 'mail');
    this.addIcon('pass', 'lock');
    this.addIcon('next', 'next');
    this.addIcon('next_step', 'next_step');
    this.addIcon("menu", "menu-toggle");
    this.addIcon("en", "gb");
    this.addIcon("km", "kh");
    this.addIcon("notification", "notification");
    this.addIcon('news', 'news');
    this.addIcon('news_color', 'news_color');
    this.addIcon('invalid', 'invalid');
    this.addIcon('valid', 'valid');
    this.addIcon('valid_color', 'valid_color');
    this.addIcon('invalid_color', 'invalid_color');
    this.addIcon('valid_status_color', 'valid_status_color');
    this.addIcon('invalid_status_color', 'invalid_status_color');
    this.addIcon('not_found', 'not_found');
    this.addIcon('not_found_status_color', 'not_found_status_color');
    this.addIcon('not_found_color', 'not_found_color');
    this.addIcon('invoice', 'invoice');
    this.addIcon("request", "request");
    this.addIcon("members", "members");
    this.addIcon("members_color", "members_color");
    this.addIcon("request_color", "request_color");
    this.addIcon("pending", "pending");
    this.addIcon("reject", "reject");
    this.addIcon("active", "active");
    this.addIcon('tracking_time', 'tracking_time');
    this.addIcon('tracking_time_color', 'tracking_time_color');
    this.addIcon('person', 'person');
    this.addIcon('person_color', 'person_color');
    this.addIcon("upload", "upload");
    this.addIcon('folder_create', 'folder_create');
    this.addIcon('cloud', 'cloud');
    this.addIcon('upload_data', 'upload_data');
    this.addIcon('submit', 'submit');
    this.addIcon('upload_invoice', 'upload_invoice');
    this.addIcon('allocate', 'allocate');
    this.addIcon('info', 'info');
    this.addIcon('info_color', 'info_color');
    this.addIcon('penalty', 'penalty');
    this.addIcon('penalty_color', 'penalty_color');
    this.addIcon('history', 'history');
    this.addIcon('history_color', 'history_color');
    this.addIcon("contract", "contract");
    this.addIcon("contract_color", "contract_color");
    this.addIcon('excel', 'excel');
    this.addIcon('empty_list', 'empty_list');
    this.addIcon('file_search', 'file_search');
    this.addIcon('invoice_no_color', 'invoice_no_color');
    this.addIcon('location_pin', 'location_pin');
    this.addIcon('erase', 'erase');
    this.addIcon('pdf_color', 'pdf_color');

    this.addIcon('ent-doc-folder', 'ent-doc-folder');
    this.addIcon('ent-mission', 'ent-mission');
    this.addIcon('ent-plan', 'ent-plan');
    this.addIcon('ent-report', 'ent-report');
    this.addIcon('ent-follow-up', 'ent-follow-up');
    this.addIcon('ent-plan-location', 'ent-plan-location');
    this.addIcon('ent-general-info', 'ent-general-info');
    this.addIcon('ent-info', 'ent-info');
    this.addIcon('excel_edit', 'excel_edit');

  }

  private addIcon(name: string, filename: string): void {
    this.icon.addSvgIcon(name, this.sanitizer.bypassSecurityTrustResourceUrl(this.iconPath + filename + this.iconExt));
  }
}
