import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { App } from 'src/app/models/app';
import { ContainerService } from '../../../services/container.service';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { PasswordDialogComponent } from 'src/app/utils/password-dialog/password-dialog.component';
import { UpdatesComponent } from '../updates/updates.component';
import { Credentials } from 'src/app/models/credentials';
import { ToastService } from 'src/app/utils/toast/toast.service';

@Component({
  selector: 'app-install',
  templateUrl: './install.component.html',
  styleUrls: ['./install.component.scss']
})
export class InstallComponent implements OnInit {

  updates: App[];
  credentials: Credentials;
  installingAll: Boolean;
  actionBarIcon: String;
  actionBarTitle: String;
  actionBarSubtitle: String;
  actionBarEnabled: boolean;
  constructor(
    private cservice: ContainerService,
    private router: Router,
    private route: ActivatedRoute,
    private ddialog: MatDialog,
    private uComponent: UpdatesComponent,
    private toaster: ToastService
  ) { }

  ngOnInit(): void {
    this.updates = this.uComponent.updates;
    if (this.updates == undefined) {
      this.router.navigate(['../../updates'], { relativeTo: this.route });
    }
    this.credentials = this.uComponent.credentials;
    this.installingAll = false;
    this.actionBarIcon = 'autorenew';
    this.actionBarTitle = 'Update all';
    this.actionBarSubtitle = 'Updates all installed system apps';
    this.actionBarEnabled = true;
  }
  /*download() {
    //download and install and then
    this.router.navigate(['/main/system/updates/restart']);
  }
  background() {
    //download and install and then
    this.router.navigate(['/main/system/updates/restart']);
  }*/

  update(app?: App) {
    if (app === undefined || app == null) {
      var appsCopy = [] as App[];
      this.actionBarTitle = 'Updating apps';
      this.actionBarSubtitle = '';
      this.actionBarEnabled = false;
      this.installingAll = true;
      this.updates.forEach((app: App) => {
        appsCopy.push(app);
      });
      appsCopy.forEach((app: App) => {
        this.doUpdate(app);
      })
    } else {
      this.doUpdate(app);
    }
  }

  doUpdate(app: App) {
    // delete app from list of apps with available updates
    this.updates.splice(this.updates.indexOf(app), 1);
    if (this.updates.length < 1 && this.installingAll == false) {
      this.actionBarTitle = 'Updating apps';
      this.actionBarSubtitle = '';
      this.actionBarEnabled = false;
      this.installingAll = true;
    }

    app.user = this.credentials.user;
    app.passwd = this.credentials.pass;
    app.state = 'UPGRADINGSTARTED';

    this.cservice.updateApp('system', app.name, app).subscribe(() => {
      if (this.updates.length < 1) {
        this.actionBarIcon = 'done';
        this.actionBarTitle = 'System is up to date';
        this.actionBarSubtitle = '';
        this.actionBarEnabled = false;
      }
    }, (error) => {
      this.toaster.openSnackBar(error.error, 'Error');
    });
  }

  /*********install(app: App) {
    const dialog = new MatDialogConfig();
    dialog.autoFocus = true;
    dialog.data = {};
    const dialogRef = this.ddialog.open(PasswordDialogComponent, dialog);

    dialogRef.afterClosed().subscribe(
      data => {
        if (data !== undefined) {
          app.user = data.user;
          app.passwd = data.pass;
          app.state = 'STARTING';
          this.cservice.installApp('system', app).subscribe(() => {
            // this.broadcasterService.broadcast('reload-apps');
            // this.cservice.installing.set(app.name, false);
          }, () => {
            // this.broadcasterService.broadcast('reload-apps');
            // this.cservice.installing.set(app.name, false);
          });
        }
      }
    )
  }*/
}
