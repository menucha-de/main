import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {MatDialog} from '@angular/material/dialog';

import { OAuthService } from 'angular-oauth2-oidc';
import { from, Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { SystemService } from '../../services/system.service';
import { UserService } from '../../services/user.service';
import { InfoDialogComponent } from '../info-dialog/info-dialog.component';
import { SysInfo } from 'src/app/models/sysinfo';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  formLogin: FormGroup;
  public loginInvalid: boolean;
  private returnUrl: string;
  hostname$: Observable<string>;
  private info: SysInfo;
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private oauthService: OAuthService,
    private system: SystemService,
    private userService: UserService,
    private dialog: MatDialog,
  ) {
    this.hostname$ = this.system.getInfo().pipe(
      tap(info => this.info = info),
      map(info => info.hostname),
    );
  }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';

    this.formLogin = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    this.loginInvalid = false;

    if (this.formLogin.valid) {
      try {
        const username = this.formLogin.get('username').value;
        const password = this.formLogin.get('password').value;
        from(this.oauthService.fetchTokenUsingPasswordFlow(username, password)).pipe(
          switchMap(() => this.userService.getUserInfo())
        ).subscribe(user => {
          this.userService.passwordChanged = !user.hasDefaultPassword;
          this.router.navigate([this.returnUrl]);
        }, () => {
          this.loginInvalid = true;
        });
        // this.oauthService.fetchTokenUsingPasswordFlow(username, password).then(() => {
        //   this.router.navigate([this.returnUrl]);
        // }).catch(() => {
        //     this.loginInvalid = true;
        // });
      } catch (err) {
        this.loginInvalid = true;
      }
    }
  }

  showInfo() {
    this.dialog.open(InfoDialogComponent, { data: { info: this.info } });
  }
}
