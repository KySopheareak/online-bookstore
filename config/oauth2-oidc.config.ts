import { AuthConfig } from 'angular-oauth2-oidc';
import { environment } from '../src/environment/environment';

export const authLoginFlowConfig: AuthConfig = {
  // Url of the Identity Provider
  
  // issuer: environment.NSSF_AUTH_URL,

  // URL of the SPA to redirect the user to afte
  // r login
  // redirectUri: environment.NSSF_REDIRECT_URI,

  // URL of the SPA to redirect the user to after logout
  
  // postLogoutRedirectUri: environment.NSSF_LOGOUT_REDIRECT_URI,

  // The SPA's id. The SPA is registerd with this id at the auth-server
  // clientId: 'server.code',
  
  // clientId: environment.NSSF_ADMIN_AUTH_CLIENT_ID,

  // Just needed if your auth server demands a secret. In general, this
  // is a sign that the auth server is not configured with SPAs in mind
  // and it might not enforce further best practices vital for security
  // such applications.
  // dummyClientSecret: 'secret',

  responseType: 'code',

  // set the scope for the permissions the client should request
  // The first four are defined by OIDC.
  // Important: Request offline_access to get a refresh token
  // The api scope is a usecase specific one
  scope: 'openid profile roles email phone',

  clearHashAfterLogin: false,
  strictDiscoveryDocumentValidation: false
};