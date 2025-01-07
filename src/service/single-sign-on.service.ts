import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { JwksValidationHandler, OAuthService } from 'angular-oauth2-oidc';
import { authLoginFlowConfig } from '../../config/oauth2-oidc.config';

@Injectable({
  providedIn: 'root'
})
export class SingleSignOnService {

  constructor(
    private oauthService: OAuthService,
    private snackbar: MatSnackBar,
    private router: Router
  ) {
    this.initOAuth2Config();
  }

  initOAuth2Config() {
    this.oauthService.configure(authLoginFlowConfig);
    this.oauthService.tokenValidationHandler = new JwksValidationHandler();
    this.oauthService.loadDiscoveryDocumentAndTryLogin();
  }

  onLogin() {
    this.oauthService.initCodeFlow();
  }

  get isLoggedIn() {
    return !!this.oauthService.getIdToken();
  }

  onRefreshToken() {
    this.oauthService.refreshToken();
  }

  getAccessToken() {
    return this.oauthService.getAccessToken();
  }

  onLogout() {
    this.oauthService.logOut();
  }

  onLoginFailed() {
    this.router.navigateByUrl('/login');
    this.snackbar.open("ដំណើរការចូលប្រើប្រាស់ប្រព័ន្ធមានបញ្ហា", '', { duration: 3000, horizontalPosition: 'center', panelClass: 'panel-error' });
  }
}
