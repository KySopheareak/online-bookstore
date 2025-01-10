import { ChangeDetectorRef, Component } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MenuItem } from '../../models/core/menu-item';
import { LocalStorageEnum } from '../../models/enums/local-storage.enum';
import { Subject, takeUntil } from 'rxjs';
import { LangChangeEvent, TranslateModule, TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from '../../service/local-storage.service';
import { LANG } from '../../models/core/lang.enum';
import SmoothScrollbar from "smooth-scrollbar";
import { ScrollStatus } from 'smooth-scrollbar/interfaces';
import { User } from '../../models/core/user';
import { UtilService } from '../../service/core/util.service';
import { NavigationService } from '../../service/navigation.service';
import { HeaderTitle } from '../../models/header-title';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { SmoothScrollbarComponent } from '../share/smooth-scrollbar/smooth-scrollbar.component';
import { UserImageComponent } from '../share/user-image/user-image.component';
import { NavMenuComponent } from '../nav-menu/nav-menu.component';
import { EmpFullNamePipe } from "../share/pipe/emp-full-name.pipe";

@Component({
  selector: 'app-home-component',
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatIconModule,
    MatDividerModule,
    MatListModule,
    MatTooltipModule,
    MatToolbarModule,
    MatMenuModule,
    SmoothScrollbarComponent,
    UserImageComponent,
    NavMenuComponent,
    TranslateModule,
    EmpFullNamePipe
],
  templateUrl: './home-component.component.html',
  styleUrl: './home-component.component.scss'
})
export class HomeComponentComponent {
  isTablet!: boolean;
  isHandset!: boolean;

  isContentScrolled!: boolean;
  scrollToTop: boolean = false;

  displayMenuItems: MenuItem[] = [];

  isScrolled!: boolean;
  isMenuIcon: boolean = false;
  menuState: 'open' | 'close' = 'close';
  user!: User;
  lang: string = '';
  permissions: string[] = [];
  title: HeaderTitle | null = null;
  showActionButton: boolean = false;
  readonly LANG = LANG;

  private _destroyed = new Subject<void>();

  constructor(
    private breakpointObserver: BreakpointObserver,
    private translate: TranslateService,
    public util: UtilService,
    private localStorageService: LocalStorageService,
    private navigationService: NavigationService,
    private _cd: ChangeDetectorRef,
    private _router: Router,
  ) {
    this.lang = this.translate.currentLang as LANG;

    let value: any = this.localStorageService.decryptSpecialCharacter(LocalStorageEnum.user);
    console.log('VALUE: ', value)
    if(value){
      this.user = JSON.parse(value ? value : '');
    }

    this.util.showActionButton.pipe(takeUntil(this._destroyed)).subscribe((res) => {
      this.showActionButton = !!res;
    });

    this.permissions = localStorageService.getArray(LocalStorageEnum.permissions);
    
    }

  private _updateActive(root: string) {
    const active = this.displayMenuItems.find((menu) => menu.root === root);
    if (Boolean(active)) {
      if (!active!.expanded) {
        active!.expanded = true;
        this._cd.detectChanges();
      }
    }
  }

  ngOnInit(): void {
    this.getMenuItems();
    this._updateActive(this._router.url.slice(1).split('/').shift()!);
    this._router.events.pipe(takeUntil(this._destroyed)).subscribe((ev) => {
      if (ev instanceof NavigationEnd) {
        const root = ev.url.slice(1).split('/').shift()!;
        this._updateActive(root);
      }
    });

    this.util.headerTitle.subscribe((title) => {
      this.title = title;
    });

    this.breakpointObserver
      .observe(Breakpoints.Handset)
      .pipe(takeUntil(this._destroyed))
      .subscribe((response) => {
        this.isHandset = response.matches;
        this.isMenuIcon = response.matches;
      });

    this.breakpointObserver
      .observe(Breakpoints.TabletPortrait)
      .pipe(takeUntil(this._destroyed))
      .subscribe((response) => {
        this.isTablet = response.matches;
        this.isMenuIcon = response.matches;
      });

    this.translate.onLangChange
      .pipe(takeUntil(this._destroyed))
      .subscribe((event: LangChangeEvent) => {
        this.lang = event.lang as LANG;
      });
  }

  private traverseMenuItems(menuItems: MenuItem[]) {
    return menuItems.filter((item) => {
      if (item.children) {
        item.children = this.traverseMenuItems(item.children);
      }
      return true; 
    });
  }

  getMenuItems() {
    const menuItems = this.navigationService.getMenuItems(this.permissions);
    this.displayMenuItems = this.traverseMenuItems(menuItems);
  }

  onToggleMenu(): void {
    this.isMenuIcon = !this.isMenuIcon;
    this.util.menuChange.emit(this.isMenuIcon);
  }

  onCloseMenu(): void {
    this.isMenuIcon = true;
    this.util.menuChange.emit(this.isMenuIcon);
  }

  onMenuScroll(e: ScrollStatus): void {
    let scrolled = e.offset.y > 0;
    if (this.isScrolled != scrolled) {
      this.isScrolled = scrolled;
      this._cd.detectChanges();
    }
  }

  onClickMenu() {
    if (!this.isMenuIcon) {
      this.isMenuIcon = this.isHandset || this.isTablet;
    }
  }

  onLogout() {
    // if (this.IS_ENABLE_OAUTH && this.singleSignOnService.isLoggedIn) {
    //   this.singleSignOnService.onLogout();
    // } else {
    //   this.authService.logout().subscribe((res: any) => {
    //     if (res.status === 1) {
    //       this.authService.logOutEventEmitter.emit(true);
    //       this.requestService.onSignOut();
    //     }
    //   });
    // }
  }

  onScroll(status: ScrollStatus): void {
    let scrolled = status.offset.y > 200;
    if (this.isContentScrolled != scrolled) {
      this.isContentScrolled = scrolled;
      this._cd.detectChanges();
    }

    this.util.navigationScroll.emit(status);
  }

  onScrollLoaded(scroll: SmoothScrollbar): void {
    this.util.navigationScrollRef = scroll;
  }

  moveTop() {
    this.util.navigationScrollRef.scrollTo(0, 0, 350);
    this.util.navigationScrollRef.setMomentum(0, 1);
  }

  ngOnDestroy(): void {
    this._destroyed.next();
    this._destroyed.complete();
  }
}
