import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(
    public router: Router,
    private oauth: OAuthService,
    private userService: UserService,
  ) { }

  async canActivate() {
    if (!this.oauth.hasValidAccessToken()) {
      await this.router.navigate(['login']);
      return false;
    } else {
      if (!this.userService.passwordChanged) {
        await this.router.navigate(['login/change']);
        return false;
      }
    }
    return true;
  }
}
