import { Component, OnInit } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  constructor(
    private oauthService: OAuthService,

  ) { }

  ngOnInit(): void {
  }

  logout() {
    this.oauthService.logOut();
  }
}
