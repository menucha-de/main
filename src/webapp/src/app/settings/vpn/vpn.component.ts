import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, share, switchMap, tap } from 'rxjs/operators';
import { App } from 'src/app/models/app';
import { BroadcasterService } from 'src/app/services/broadcaster.service';
import { ContainerService } from 'src/app/services/container.service';
import { Auth, PasswordDialogComponent } from 'src/app/utils/password-dialog/password-dialog.component';
import { VpnService } from './vpn.service';


@Component({
  selector: 'app-vpn',
  templateUrl: './vpn.component.html',
  styleUrls: ['./vpn.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VpnComponent implements OnInit {

  private readonly name = 'vpn';
  private readonly namespace = 'system';
  private readonly device = 'tun0';
  private readonly noConfig = 'None. Upload OpenVPN Configuration first!';
  private readonly notConfigured = 'Not configured';

  isEnabled$ = new BehaviorSubject<boolean>(false);
  address$ = new BehaviorSubject<string>(this.notConfigured);
  hasConfig$ = new BehaviorSubject<boolean>(false);
  uploading$ = new BehaviorSubject<boolean>(false);
  installing$ = new BehaviorSubject<boolean>(false);

  getAddress$: Observable<string> = this.vpnService.getVpnAddress(this.device).pipe(
    switchMap(address => {
      if (address == null) {
        return this.getAddress$;
      } else {
        return of(address);
      }
    })
  );

  log$: Observable<string>;
  app$: Observable<App>;
  @ViewChild('file') file: ElementRef<HTMLInputElement>;
  @ViewChild('downloadLogEl') downloadLogEl: HTMLAnchorElement;
  appInfo$: Observable<{ installed: boolean }>;
  constructor(
    private appService: ContainerService,
    private vpnService: VpnService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private broadcaster: BroadcasterService,
  ) { }

  ngOnInit(): void {
    // this.hasConfig$ = this.vpnService.isEnabled().pipe(
    //   map(status => status !== 'noConfig')
    // );

    this.app$ = this.appService.getInstalled().pipe(
      map(apps => {
        return apps.find(app => app.name === this.name);
      }),
      share()
    );
    this.appInfo$ = this.app$.pipe(
      map(app => {
        if (app) {
          this.checkEnabled();
          return { installed: true };
        } else {
          return { installed: false };
        }
      })
    );
  }

  checkEnabled() {
    this.vpnService.isEnabled().pipe(
      tap(status => {
        if (status === 'noConfig') {
          this.hasConfig$.next(false);
        } else {
          this.isEnabled$.next(status === 'true');
          this.hasConfig$.next(true);
        }
      }),
      switchMap(status => {
        if (status === 'true') {
          return this.vpnService.getVpnAddress(this.device);
        } else {
          if (status === 'noConfig') {
            return of(this.noConfig);
          }
          return of(this.notConfigured);
        }
      }),
      tap(address => {
        this.address$.next(address);
      })
    ).subscribe();
  }

  install() {
    const config: MatDialogConfig<Auth> = {
      autoFocus: true,
      data: {
        user: '',
        pass: ''
      }
    };
    const dialogRef = this.dialog.open<PasswordDialogComponent, Auth, Auth>(PasswordDialogComponent, config);
    dialogRef.afterClosed().pipe(
      switchMap(data => {
        if (data != null) {
          this.installing$.next(true);
          return this.appService.getAvailable().pipe(
            switchMap(apps => {
              if (apps != null) {
                const vpn = apps.find(app => app.name === this.name);
                vpn.user = data.user;
                vpn.passwd = data.pass;
                return this.appService.installApp(this.namespace, vpn).pipe(map(() => true));
              }
            })
          );
        } else {
          return of(false);
        }
      })
    ).subscribe(installed => {
      if (installed) {
        const current = this.router.url;
        this.router.navigateByUrl('main', { skipLocationChange: true }).then(() => {
          this.router.navigateByUrl(current);
        });
      }
    });
  }

  handleUpload(files: FileList) {
    if (files.item(0) != null) {
      this.uploading$.next(true);
      this.vpnService.uploadOpenVPNConfig(files.item(0)).pipe(
        switchMap(() => this.vpnService.setEnabled(false)),
      ).subscribe(() => {
        this.isEnabled$.next(false);
        this.address$.next(this.notConfigured);
        this.hasConfig$.next(true);
        this.uploading$.next(false);
        this.broadcaster.broadcast('vpn', 'Disabled');
        this.snackBar.open('Successfully uploaded configuration file!', '', { duration: 2000 });
      }, () => {
        this.uploading$.next(false);
      });
    }
  }

  upload() {
    this.file.nativeElement.click();
  }

  setEnabled(value: boolean) {
    if (value) {
      this.address$.next('Waiting ...');
    } else {
      this.address$.next('Disabling ...');
    }
    this.vpnService.setEnabled(value).pipe(
      switchMap(() => {
        if (value) {
          return this.getAddress$;
        } else {
          return of(this.notConfigured);
        }
      }),
    ).subscribe(address => {
      this.isEnabled$.next(value);
      this.address$.next(address);
      const status = value ? 'Enabled' : 'Disabled';
      this.broadcaster.broadcast('vpn', status);
    }, () => {
      this.address$.next('Failed to get address');
    });
  }

  reset() {
    this.vpnService.setEnabled(false).pipe(
      switchMap(() => this.app$),
      switchMap(app => this.vpnService.reset(app)),
    ).subscribe(() => {
      this.isEnabled$.next(false);
      this.address$.next(this.noConfig);
      this.broadcaster.broadcast('vpn', 'Not configured');
      this.hasConfig$.next(false);
    });
  }

  downloadLog(link: HTMLAnchorElement) {
    link.click();
  }
}
