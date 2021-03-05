import { Component } from '@angular/core';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';

export const authConfig: AuthConfig = {
  tokenEndpoint: 'auth/oauth2/token',
  clientId: 'ui',
  scope: 'all',
  dummyClientSecret: 'adryNYz2RNR8',
  requireHttps: false,
  customQueryParams: { request_cookie: true }
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    private oauthService: OAuthService
  ) {
    this.oauthService.configure(authConfig);
    this.oauthService.tryLogin();
  }
}
